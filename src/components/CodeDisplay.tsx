import type { TrainerState } from "../features/trainer/engine";

export function CodeDisplay({ state }: { state: TrainerState }) {
  return <pre className="code-display" aria-label="需要输入的代码"><code>{Array.from(state.target).map((character, index) => {
    const classNames = [index < state.cursor ? "typed" : "", index === state.cursor ? "current" : "", state.autoPairHints.includes(index) ? "pair-hint" : ""].filter(Boolean).join(" ");
    return <span className={classNames} key={`${index}-${character}`}>{character}{index === state.cursor && state.wrongInput && <span className="wrong-char">{state.wrongInput}</span>}</span>;
  })}</code></pre>;
}
