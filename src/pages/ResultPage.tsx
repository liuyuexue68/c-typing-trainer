import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Stars } from "../components/Stars";
import { useProgress } from "../context/ProgressContext";
import { getNextLesson } from "../data/lessons";

function formatTime(ms: number) { const total = Math.floor(ms / 1000); return `${String(Math.floor(total / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`; }

export function ResultPage() {
  const { state } = useProgress();
  const navigate = useNavigate();
  const result = state.lastResult;
  const next = result?.mode === "course" ? getNextLesson(result.lessonId) : undefined;
  const nextDestination = next ? `/lesson/${next.id}` : result?.mode === "course" ? "/courses" : "/practice";
  useEffect(() => {
    if (!result) return;
    const handleKey = (event: KeyboardEvent) => {
      if (event.ctrlKey || event.metaKey || event.altKey) return;
      if (event.key.toLowerCase() === "r") { event.preventDefault(); navigate(`/lesson/${result.lessonId}`); }
      if (event.key === "Enter") { event.preventDefault(); navigate(nextDestination); }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [navigate, nextDestination, result]);
  if (!result) return <main className="page empty-page"><h1>还没有练习结果</h1><Link className="primary-button" to="/courses">选择课程</Link></main>;
  return <main className="result-page"><section className="result-card"><div className="result-check">✓</div><p className="eyebrow">Lesson Complete</p><h1>{result.title}</h1><Stars value={result.stars} />{result.stars < 3 && <p className="practice-advice">这一课已经完成，但准确率还可以提高。课程已解锁，建议稍后回来重练。</p>}<div className="result-metrics"><div><span>Accuracy</span><strong>{result.accuracy.toFixed(1)}%</strong></div><div><span>Speed</span><strong>{Math.round(result.cpm)} CPM</strong></div><div><span>Errors</span><strong>{result.errors}</strong></div><div><span>Time</span><strong>{formatTime(result.activeMs)}</strong></div></div><div className="result-actions"><Link className="secondary-button" to={`/lesson/${result.lessonId}`}>R · 再练一次</Link>{next ? <Link className="primary-button" to={`/lesson/${next.id}`}>Enter · 下一课 →</Link> : <Link className="primary-button" to={result.mode === "course" ? "/courses" : "/practice"}>返回{result.mode === "course" ? "课程" : "练习"} →</Link>}</div></section></main>;
}
