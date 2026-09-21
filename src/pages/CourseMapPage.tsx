import { Link } from "react-router-dom";
import { Stars } from "../components/Stars";
import { useProgress } from "../context/ProgressContext";
import { chapters, lessons } from "../data/lessons";
import { isLessonUnlocked } from "../storage/repository";

export function CourseMapPage() {
  const { state } = useProgress();
  return <main className="page map-page"><header className="page-header"><p className="eyebrow">课程地图</p><h1>一步一步，写出真正的 C 代码。</h1><p>完成即可解锁下一课；低于三星的课程会保留重练提示。</p></header><div className="learning-path">{chapters.map((chapter) => <section className={`path-chapter ${chapter.available ? "" : "coming"}`} key={chapter.id}><header><div className="chapter-index">{String(chapter.order).padStart(2, "0")}</div><div><span>CHAPTER {chapter.order}</span><h2>{chapter.title}</h2><p>{chapter.description}</p></div>{!chapter.available && <b className="coming-pill">即将开放</b>}</header>{chapter.available && <div className="lesson-list">{chapter.lessonIds.map((id, index) => {
    const lesson = lessons.find((item) => item.id === id)!;
    const record = state.progress.lessonRecords[id];
    const unlocked = isLessonUnlocked(state, id);
    const content = <><span className={`lesson-status ${record ? "done" : unlocked ? "open" : "locked"}`}>{record ? "✓" : unlocked ? index + 1 : "🔒"}</span><span className="lesson-copy"><b>{lesson.title}</b><small>{lesson.description}</small></span>{record && record.bestStars < 3 && <span className="retry-note">建议重练</span>}{record ? <Stars value={record.bestStars} label={false} /> : <span className="lesson-difficulty">难度 {lesson.difficulty}</span>}</>;
    return unlocked ? <Link className="lesson-row" to={`/lesson/${id}`} key={id}>{content}</Link> : <div className="lesson-row disabled" key={id}>{content}</div>;
  })}</div>}</section>)}</div></main>;
}
