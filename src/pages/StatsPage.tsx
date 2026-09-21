import { MetricCard } from "../components/MetricCard";
import { useProgress } from "../context/ProgressContext";
import { getStreak, localDateKey } from "../storage/repository";

function recentDays() { return Array.from({ length: 7 }, (_, offset) => { const date = new Date(); date.setDate(date.getDate() - (6 - offset)); return { key: localDateKey(date), label: `${date.getMonth() + 1}/${date.getDate()}` }; }); }

export function StatsPage() {
  const { state } = useProgress();
  const totalActions = state.totals.correctActions + state.totals.errorActions;
  const accuracy = totalActions ? (state.totals.correctActions / totalActions) * 100 : 0;
  const days = recentDays();
  const maxCpm = Math.max(1, ...days.map(({ key }) => state.dailyStats[key]?.bestCpm ?? 0));
  const missed = Object.entries(state.missedCharacters).sort(([, a], [, b]) => b - a).slice(0, 8);
  return <main className="page stats-page"><header className="page-header"><p className="eyebrow">Stats</p><h1>你的输入正在变得更稳定。</h1><p>速度很重要，但准确率始终优先。</p></header><section className="stats-metrics"><MetricCard label="Total Practice Time" value={`${Math.floor(state.totals.practiceTimeMs / 60_000)} min`} /><MetricCard label="Total Characters" value={state.totals.completedCharacters.toLocaleString()} /><MetricCard label="Average Accuracy" value={totalActions ? `${accuracy.toFixed(1)}%` : "—"} /><MetricCard label="Best CPM" value={state.totals.bestCpm ? Math.round(state.totals.bestCpm).toString() : "—"} /><MetricCard label="Completed Lessons" value={state.progress.completedLessonIds.length.toString()} /><MetricCard label="Current Streak" value={`${getStreak(state)} days`} /></section><div className="stats-columns"><section className="chart-card"><div className="card-heading"><div><p className="eyebrow">最近 7 天</p><h2>Best CPM</h2></div><span>Characters / minute</span></div><div className="bar-chart">{days.map(({ key, label }) => { const value = state.dailyStats[key]?.bestCpm ?? 0; return <div className="bar-column" key={key}><span>{value ? Math.round(value) : ""}</span><div className="bar-track"><i style={{ height: `${Math.max(value ? 8 : 2, (value / maxCpm) * 100)}%` }} /></div><small>{label}</small></div>; })}</div></section><section className="missed-card"><div className="card-heading"><div><p className="eyebrow">Most Missed</p><h2>薄弱字符</h2></div></div>{missed.length ? <ol>{missed.map(([character, count]) => <li key={character}><code>{character}</code><span>{count} errors</span><b style={{ width: `${Math.max(8, (count / missed[0][1]) * 100)}%` }} /></li>)}</ol> : <p className="empty-copy">还没有错误记录。完成一次练习后再来看看。</p>}</section></div></main>;
}
