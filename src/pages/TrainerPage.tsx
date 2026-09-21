import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { CodeDisplay } from "../components/CodeDisplay";
import { VirtualKeyboard } from "../components/VirtualKeyboard";
import { useProgress } from "../context/ProgressContext";
import { buildWeakExercise, getExercise } from "../data/lessons";
import { applyKey, calculateAccuracy, calculateCpm, createTrainerState, getStarRating, pauseTrainer, resumeTrainer, type TrainerState } from "../features/trainer/engine";
import { playTypingSound } from "../features/trainer/typingSound";
import type { ResultRecord } from "../types";

function formatTime(ms: number) { const total = Math.floor(ms / 1000); return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`; }

export function TrainerPage() {
  const { lessonId } = useParams();
  const navigate = useNavigate();
  const { state: progress, completeResult } = useProgress();
  const exercise = useMemo(() => lessonId === "practice-weak" ? buildWeakExercise(progress.missedCharacters) : getExercise(lessonId), [lessonId, progress.missedCharacters]);
  const [trainer, setTrainer] = useState<TrainerState>(() => createTrainerState(exercise?.content ?? ""));
  const trainerRef = useRef(trainer);
  const [activeMs, setActiveMs] = useState(0);
  const errorCharacters = useRef<string[]>([]);
  const completedRef = useRef(false);
  const restart = useCallback(() => { if (!exercise) return; const next = createTrainerState(exercise.content); errorCharacters.current = []; completedRef.current = false; trainerRef.current = next; setActiveMs(0); setTrainer(next); }, [exercise]);

  useEffect(() => restart(), [restart]);
  useEffect(() => { trainerRef.current = trainer; }, [trainer]);
  useEffect(() => { if (trainer.status !== "active") return; const interval = window.setInterval(() => setActiveMs((value) => value + 100), 100); return () => window.clearInterval(interval); }, [trainer.status]);
  useEffect(() => { const pause = () => setTrainer((current) => pauseTrainer(current)); const visibility = () => { if (document.hidden) pause(); }; window.addEventListener("blur", pause); document.addEventListener("visibilitychange", visibility); return () => { window.removeEventListener("blur", pause); document.removeEventListener("visibilitychange", visibility); }; }, []);
  useEffect(() => {
    if (!exercise) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (trainer.status === "paused") {
        if (event.key === "Enter" || event.key === "Escape") { event.preventDefault(); setTrainer((current) => resumeTrainer(current)); }
        else if (event.key.toLowerCase() === "r") { event.preventDefault(); restart(); }
        return;
      }
      if (trainer.status !== "active") return;
      if (event.key === "Escape") { event.preventDefault(); setTrainer((current) => pauseTrainer(current)); return; }
      const relevant = event.key.length === 1 || ["Tab", "Enter", "Backspace"].includes(event.key);
      if (!relevant) return;
      event.preventDefault();
      const result = applyKey(trainerRef.current, event.key);
      if (result.errorCharacter) errorCharacters.current.push(result.errorCharacter);
      if (result.accepted && progress.settings.typingSound) {
        playTypingSound(result.errorCharacter ? "error" : event.key === "Backspace" ? "backspace" : "key");
      }
      trainerRef.current = result.state;
      setTrainer(result.state);
    };
    const preventInput = (event: Event) => event.preventDefault();
    window.addEventListener("keydown", handleKeyDown); window.addEventListener("paste", preventInput); window.addEventListener("drop", preventInput);
    return () => { window.removeEventListener("keydown", handleKeyDown); window.removeEventListener("paste", preventInput); window.removeEventListener("drop", preventInput); };
  }, [exercise, progress.settings.typingSound, restart, trainer.status]);
  useEffect(() => {
    if (!exercise || trainer.status !== "completed" || completedRef.current) return;
    completedRef.current = true;
    const safeDuration = Math.max(100, activeMs);
    const accuracy = calculateAccuracy(trainer.correctActions, trainer.errorActions);
    const result: ResultRecord = { lessonId: exercise.id, title: exercise.title, mode: exercise.mode, accuracy, cpm: calculateCpm(trainer.completedCharacters, safeDuration), errors: trainer.errorActions, activeMs: safeDuration, completedCharacters: trainer.completedCharacters, stars: getStarRating(accuracy), completedAt: new Date().toISOString() };
    completeResult(result, trainer.correctActions, errorCharacters.current);
    window.setTimeout(() => navigate("/result"), 500);
  }, [activeMs, completeResult, exercise, navigate, trainer]);

  if (!exercise) return <main className="trainer-error"><h1>没有找到这项练习</h1><Link to="/courses">返回课程</Link></main>;
  const accuracy = calculateAccuracy(trainer.correctActions, trainer.errorActions);
  const cpm = calculateCpm(trainer.completedCharacters, activeMs);
  const currentCharacter = trainer.target[trainer.cursor] ?? "";
  const progressPercent = trainer.target.length ? (trainer.cursor / trainer.target.length) * 100 : 0;
  return <main className="trainer-page">
    <header className="trainer-topbar"><Link className="trainer-back" to={exercise.mode === "course" ? "/courses" : "/practice"} aria-label="退出练习">×</Link><div className="lesson-identity"><span>{exercise.mode === "course" ? `LESSON ${exercise.order}` : "PRACTICE"}</span><strong>{exercise.title}</strong></div><div className="trainer-metrics"><div><span>Accuracy</span><b>{accuracy.toFixed(1)}%</b></div><div><span>Speed</span><b>{Math.round(cpm)} <small>CPM</small></b></div><div><span>Errors</span><b className={trainer.errorActions ? "error-value" : ""}>{trainer.errorActions}</b></div><div><span>Time</span><b>{formatTime(activeMs)}</b></div></div></header>
    <div className="trainer-progress"><span style={{ width: `${progressPercent}%` }} /></div>
    <section className="trainer-workspace"><div className="trainer-instruction"><div><span className="physical-badge">实体键盘</span><h1>{exercise.description}</h1></div><p>{exercise.syntaxHint}</p></div><div className={`editor-shell ${trainer.wrongInput ? "has-error" : ""}`}><div className="editor-toolbar"><span><i /><i /><i /></span><b>lesson.c</b><em>UTF-8 · Spaces: 4</em></div><CodeDisplay state={trainer} /><div className="editor-footer"><span>{trainer.wrongInput ? "按 Backspace 删除错误字符" : "直接使用电脑键盘输入，无需点击文本框"}</span><span>{trainer.cursor} / {trainer.target.length}</span></div></div>{progress.settings.showVirtualKeyboard && <VirtualKeyboard character={currentCharacter} wrong={Boolean(trainer.wrongInput)} />}<p className="trainer-help"><kbd>Esc</kbd> 暂停　·　Tab 输入 4 个空格　·　括号与引号会像 VS 一样自动闭合</p></section>
    {trainer.status === "paused" && <div className="pause-overlay" role="dialog" aria-modal="true" aria-label="练习已暂停"><div className="pause-card"><span>Ⅱ</span><p className="eyebrow">Paused</p><h2>练习已暂停</h2><p>暂停期间不会计时，也不会接收代码输入。</p><button className="primary-button" onClick={() => setTrainer((current) => resumeTrainer(current))}>Enter · 继续</button><button className="text-button" onClick={restart}>R · 重新开始</button><Link to={exercise.mode === "course" ? "/courses" : "/practice"}>返回{exercise.mode === "course" ? "课程" : "练习"}</Link></div></div>}
  </main>;
}
