import { Link } from "react-router-dom";
import { MetricCard } from "../components/MetricCard";
import { Stars } from "../components/Stars";
import { useProgress } from "../context/ProgressContext";
import { chapters, lessons } from "../data/lessons";
import { getStreak, getTodayStats } from "../storage/repository";

export function HomePage() {
  const { state } = useProgress();
  const today = getTodayStats(state);
  const accuracyTotal = today.correctActions + today.errorActions;
  const accuracy = accuracyTotal ? (today.correctActions / accuracyTotal) * 100 : null;
  const currentLesson = lessons.find((lesson) => lesson.id === state.progress.currentLessonId) ?? lessons[0];
  const completedCount = state.progress.completedLessonIds.length;
  const topMissed = Object.entries(state.missedCharacters).sort(([, a], [, b]) => b - a).slice(0, 3);
  return <main className="page home-page">
    <section className="welcome-row"><div><p className="eyebrow">今日训练</p><h1>把 C 语言敲进肌肉记忆。</h1><p>使用实体键盘，从符号开始，逐步掌握真实代码结构。</p></div><div className="streak"><span>🔥</span><strong>{getStreak(state)}</strong><small>连续学习天数</small></div></section>
    <section className="metrics" aria-label="今日学习数据"><MetricCard label="今日练习" value={`${Math.floor(today.practiceTimeMs / 60_000)} min`} /><MetricCard label="输入字符" value={today.completedCharacters.toLocaleString()} /><MetricCard label="平均准确率" value={accuracy === null ? "—" : `${accuracy.toFixed(1)}%`} /><MetricCard label="最佳速度" value={today.bestCpm ? `${Math.round(today.bestCpm)} CPM` : "— CPM"} /></section>
    <section className="continue-card"><div className="level-token">{String(currentLesson.order).padStart(2, "0")}</div><div className="continue-copy"><p className="eyebrow">继续学习 · {chapters.find((chapter) => chapter.id === currentLesson.chapterId)?.title}</p><h2>{currentLesson.title}</h2><p>{currentLesson.description}</p><div className="progress-track"><span style={{ width: `${(completedCount / lessons.length) * 100}%` }} /></div></div><Link className="primary-button" to={`/lesson/${currentLesson.id}`}>继续练习 <span>→</span></Link></section>
    <div className="home-columns"><section><div className="section-heading"><div><p className="eyebrow">课程路径</p><h2>循序渐进，不随机拼代码</h2></div><Link className="text-link" to="/courses">查看全部 →</Link></div><div className="course-grid home-course-grid">{chapters.slice(0, 3).map((chapter) => {
      const completed = chapter.lessonIds.filter((id) => state.progress.completedLessonIds.includes(id)).length;
      const records = chapter.lessonIds.map((id) => state.progress.lessonRecords[id]).filter(Boolean);
      const bestStars = records.length ? Math.max(...records.map((record) => record.bestStars)) : 0;
      return <Link className={`chapter-card ${chapter.order === 1 ? "current" : ""}`} to="/courses" key={chapter.id}><div className="chapter-top"><span>CHAPTER {String(chapter.order).padStart(2, "0")}</span><span className={completed ? "status-pill" : "lock"}>{completed ? `${completed} 已完成` : "待学习"}</span></div><h3>{chapter.title}</h3><p>{chapter.description}</p><Stars value={bestStars} label={false} /><footer><span>{chapter.lessonIds.length} 节课</span><strong>{completed} / {chapter.lessonIds.length}</strong></footer></Link>;
    })}</div></section><aside className="weak-card"><p className="eyebrow">需要加强</p><h2>薄弱字符</h2>{topMissed.length ? <div className="weak-list">{topMissed.map(([character, count]) => <div key={character}><code>{character}</code><span>{count} 次错误</span></div>)}</div> : <p className="empty-copy">完成练习后，这里会显示最容易打错的字符。</p>}<Link className="secondary-button" to="/practice?mode=weak">专项训练</Link></aside></div>
  </main>;
}
