import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { allExercises, lessons } from "../data/lessons";
import { isLessonUnlocked } from "../storage/repository";
import type { PersistedState } from "../types";

interface WebMcpTool {
  name: string;
  title: string;
  description: string;
  inputSchema: object;
  annotations: { readOnlyHint: boolean; untrustedContentHint: boolean };
  execute(input: unknown): unknown | Promise<unknown>;
}

declare global {
  interface Document {
    readonly modelContext?: {
      registerTool(tool: WebMcpTool, options?: { signal?: AbortSignal }): void | Promise<void>;
    };
  }
}

export function WebMcpTools() {
  const { state } = useProgress();
  const stateRef = useRef<PersistedState>(state);
  const navigate = useNavigate();
  stateRef.current = state;

  useEffect(() => {
    const context = document.modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    const report = (error: unknown) => {
      if (error instanceof DOMException && error.name === "AbortError") return;
      console.warn("WebMCP tool registration failed", error);
    };

    void Promise.resolve(context.registerTool({
      name: "read_training_status",
      title: "Read C typing progress",
      description: "Read the learner's current lesson and aggregate C typing practice progress without changing it.",
      inputSchema: { type: "object", properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: false },
      execute() {
        const current = stateRef.current;
        const total = current.totals.correctActions + current.totals.errorActions;
        return {
          currentLessonId: current.progress.currentLessonId,
          completedLessons: current.progress.completedLessonIds.length,
          totalLessons: lessons.length,
          totalCharacters: current.totals.completedCharacters,
          averageAccuracy: total ? Number(((current.totals.correctActions / total) * 100).toFixed(1)) : null,
          bestCpm: Math.round(current.totals.bestCpm),
        };
      },
    }, { signal: lifecycle.signal })).catch(report);

    void Promise.resolve(context.registerTool({
      name: "start_typing_exercise",
      title: "Start C typing exercise",
      description: "Open an available course lesson or practice exercise. It only navigates to the exercise; the learner must type with a physical keyboard.",
      inputSchema: {
        type: "object",
        properties: { exerciseId: { type: "string", description: "Lesson or practice exercise ID." } },
        required: ["exerciseId"],
        additionalProperties: false,
      },
      annotations: { readOnlyHint: false, untrustedContentHint: false },
      execute(input) {
        const exerciseId = typeof input === "object" && input !== null && "exerciseId" in input ? String((input as { exerciseId: unknown }).exerciseId) : "";
        const exists = exerciseId === "practice-weak" || allExercises.some((exercise) => exercise.id === exerciseId);
        if (!exists) throw new Error("Unknown exercise ID.");
        const courseLesson = lessons.some((lesson) => lesson.id === exerciseId);
        if (courseLesson && !isLessonUnlocked(stateRef.current, exerciseId)) throw new Error("This course lesson is still locked.");
        navigate(`/lesson/${exerciseId}`);
        return { status: "opened", exerciseId, inputMethod: "physical-keyboard" };
      },
    }, { signal: lifecycle.signal })).catch(report);

    return () => lifecycle.abort();
  }, [navigate]);

  return null;
}
