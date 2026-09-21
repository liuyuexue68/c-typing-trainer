import { describe, expect, it } from "vitest";
import { defaultState, getStreak, isLessonUnlocked, recordCompletedResult } from "./repository";
import type { PersistedState, ResultRecord } from "../types";

function freshState(): PersistedState {
  return JSON.parse(JSON.stringify(defaultState)) as PersistedState;
}

const result: ResultRecord = {
  lessonId: "c1-l1",
  title: "分号与括号",
  mode: "course",
  accuracy: 96,
  cpm: 120,
  errors: 2,
  activeMs: 60_000,
  completedCharacters: 100,
  stars: 4,
  completedAt: "2026-09-21T03:00:00.000Z",
};

describe("progress repository", () => {
  it("records course completion, metrics and missed characters", () => {
    const next = recordCompletedResult(freshState(), result, 48, [";", ";"]);
    expect(next.progress.completedLessonIds).toEqual(["c1-l1"]);
    expect(next.progress.currentLessonId).toBe("c1-l2");
    expect(next.progress.lessonRecords["c1-l1"].bestStars).toBe(4);
    expect(next.totals.completedCharacters).toBe(100);
    expect(next.missedCharacters[";"]).toBe(2);
  });

  it("unlocks only the next sequential lesson", () => {
    const state = freshState();
    expect(isLessonUnlocked(state, "c1-l1")).toBe(true);
    expect(isLessonUnlocked(state, "c1-l2")).toBe(false);
    state.progress.completedLessonIds.push("c1-l1");
    expect(isLessonUnlocked(state, "c1-l2")).toBe(true);
  });

  it("counts a streak from completed sessions", () => {
    const state = freshState();
    state.dailyStats["2026-09-20"] = { practiceTimeMs: 1, completedCharacters: 1, correctActions: 1, errorActions: 0, completedSessions: 1, bestCpm: 1 };
    state.dailyStats["2026-09-21"] = { practiceTimeMs: 1, completedCharacters: 1, correctActions: 1, errorActions: 0, completedSessions: 1, bestCpm: 1 };
    expect(getStreak(state, new Date(2026, 8, 21, 12))).toBe(2);
  });
});
