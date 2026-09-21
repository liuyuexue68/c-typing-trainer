export function Stars({ value, label = true }: { value: number; label?: boolean }) {
  return <span className="stars" aria-label={`${value} 星`}>{Array.from({ length: 5 }, (_, index) => <span className={index < value ? "filled" : ""} key={index} aria-hidden="true">★</span>)}{label && <small>{value}/5</small>}</span>;
}
