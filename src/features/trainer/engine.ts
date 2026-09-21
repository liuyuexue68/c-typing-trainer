export type TrainerStatus = "active" | "paused" | "completed";

export interface TrainerState {
  target: string;
  cursor: number;
  wrongInput: string | null;
  correctActions: number;
  errorActions: number;
  completedCharacters: number;
  status: TrainerStatus;
  autoPairHints: number[];
}

export type EngineResult = {
  state: TrainerState;
  accepted: boolean;
  errorCharacter?: string;
};

const pairFor: Record<string, string> = {
  "(": ")",
  "[": "]",
  "{": "}",
  "\"": "\"",
  "'": "'",
  "<": ">",
};

export function normalizeTarget(value: string) {
  return value.replace(/\r\n?/g, "\n").replace(/\t/g, "    ");
}

export function createTrainerState(target: string): TrainerState {
  return {
    target: normalizeTarget(target),
    cursor: 0,
    wrongInput: null,
    correctActions: 0,
    errorActions: 0,
    completedCharacters: 0,
    status: "active",
    autoPairHints: [],
  };
}

function shouldHintAnglePair(target: string, cursor: number) {
  const lineStart = target.lastIndexOf("\n", cursor - 1) + 1;
  return target.slice(lineStart, cursor).trimStart().startsWith("#include");
}

function findClosingIndex(target: string, cursor: number, opener: string) {
  const closer = pairFor[opener];
  if (!closer) return -1;
  if (opener === "<" && !shouldHintAnglePair(target, cursor)) return -1;
  if (opener === "\"" || opener === "'") {
    const occurrencesBefore = Array.from(target.slice(0, cursor)).filter((character) => character === opener).length;
    if (occurrencesBefore % 2 === 1) return -1;
    return target.indexOf(closer, cursor + 1);
  }

  let depth = 0;
  for (let index = cursor; index < target.length; index += 1) {
    if (target[index] === opener) depth += 1;
    if (target[index] === closer) depth -= 1;
    if (depth === 0) return index;
  }
  return -1;
}

function advancePastAutoPairs(cursor: number, autoPairHints: number[]) {
  let nextCursor = cursor;
  const pendingPairs = new Set(autoPairHints);

  while (pendingPairs.delete(nextCursor)) nextCursor += 1;

  return {
    cursor: nextCursor,
    autoPairHints: autoPairHints.filter((index) => pendingPairs.has(index)),
  };
}

function advancePastIndentation(target: string, cursor: number, key: string) {
  if (key !== "Enter") return cursor;

  let nextCursor = cursor;
  while (target[nextCursor] === " ") nextCursor += 1;
  return nextCursor;
}

export function pauseTrainer(state: TrainerState): TrainerState {
  return state.status === "active" ? { ...state, status: "paused" } : state;
}

export function resumeTrainer(state: TrainerState): TrainerState {
  return state.status === "paused" ? { ...state, status: "active" } : state;
}

export function applyKey(state: TrainerState, key: string): EngineResult {
  if (state.status !== "active") return { state, accepted: false };

  if (key === "Backspace") {
    if (!state.wrongInput) return { state, accepted: false };
    return { state: { ...state, wrongInput: null }, accepted: true };
  }

  if (state.wrongInput) return { state, accepted: false };

  const expected = state.target[state.cursor];
  let produced = key;
  if (key === "Enter") produced = "\n";
  if (key === "Tab") produced = "    ";

  const isCharacterInput = produced === "\n" || produced === "    " || produced.length === 1;
  if (!isCharacterInput) return { state, accepted: false };

  const matches = key === "Tab"
    ? state.target.slice(state.cursor, state.cursor + 4) === "    "
    : expected === produced;

  if (!matches) {
    const wrongInput = key === "Tab" ? "⇥" : key === "Enter" ? "↵" : key;
    return {
      accepted: true,
      errorCharacter: expected,
      state: {
        ...state,
        wrongInput,
        errorActions: state.errorActions + 1,
      },
    };
  }

  const advance = key === "Tab" ? 4 : 1;
  const typedCursor = state.cursor + advance;
  const indentedCursor = advancePastIndentation(state.target, typedCursor, key);
  const hintIndex = key !== "Tab" ? findClosingIndex(state.target, state.cursor, produced) : -1;
  const nextHints = hintIndex > state.cursor && !state.autoPairHints.includes(hintIndex)
    ? [...state.autoPairHints, hintIndex]
    : state.autoPairHints;
  const autoCompleted = advancePastAutoPairs(indentedCursor, nextHints);
  const nextCursor = autoCompleted.cursor;
  const completed = nextCursor >= state.target.length;

  return {
    accepted: true,
    state: {
      ...state,
      cursor: nextCursor,
      correctActions: state.correctActions + 1,
      completedCharacters: state.completedCharacters + advance + (nextCursor - typedCursor),
      autoPairHints: autoCompleted.autoPairHints,
      status: completed ? "completed" : "active",
    },
  };
}

export function calculateAccuracy(correctActions: number, errorActions: number) {
  const total = correctActions + errorActions;
  return total === 0 ? 100 : (correctActions / total) * 100;
}

export function calculateCpm(completedCharacters: number, activeMs: number) {
  if (activeMs <= 0) return 0;
  return completedCharacters / (activeMs / 60_000);
}

export function getStarRating(accuracy: number) {
  if (accuracy >= 98) return 5;
  if (accuracy >= 95) return 4;
  if (accuracy >= 90) return 3;
  if (accuracy >= 80) return 2;
  return 1;
}
