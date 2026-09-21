import { Link, useSearchParams } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";
import { buildWeakExercise, practiceExercises } from "../data/lessons";

const icons: Record<string, string> = { symbols: "{}", keywords: "int", snippets: "</>", program: "#", weak: "!" };

export function PracticePage() {
  const { state } = useProgress();
  const [searchParams] = useSearchParams();
  const weakExercise = buildWeakExercise(state.missedCharacters);
  const items = searchParams.get("mode") === "weak" ? [weakExercise] : [...practiceExercises, weakExercise];
  return <main className="page practice-page"><header className="page-header"><p className="eyebrow">Practice</p><h1>选择今天想强化的内容。</h1><p>自由练习会计入今日数据与连续学习天数，但不会改变课程解锁状态。</p></header><section className="practice-grid">{items.map((exercise) => <article className={`practice-card ${exercise.mode === "weak" ? "weak-practice" : ""}`} key={exercise.id}><div className="practice-icon">{icons[exercise.mode]}</div><div><span>{exercise.mode.toUpperCase()}</span><h2>{exercise.title}</h2><p>{exercise.description}</p></div><div className="practice-tags">{exercise.targetCharacters.slice(0, 5).map((item) => <code key={item}>{item}</code>)}</div><Link className="secondary-button" to={`/lesson/${exercise.id}`}>开始练习 →</Link></article>)}</section></main>;
}
