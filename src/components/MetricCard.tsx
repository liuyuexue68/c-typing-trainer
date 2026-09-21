export function MetricCard({ label, value, note }: { label: string; value: string; note?: string }) {
  return <article className="metric-card"><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</article>;
}
