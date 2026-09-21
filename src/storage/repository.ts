import { lessons } from "../data/lessons";
import type { DailyRecord, PersistedState, ResultRecord } from "../types";

const STORAGE_KEY = "c-typing-trainer:progress:v2";
export const STORAGE_VERSION = 1;

export const defaultState: PersistedState = {
  version: STORAGE_VERSION,
  progress: {
    currentLessonId: lessons[0].id,
    completedLessonIds: [],
    lessonRecords: {},
  },
  totals: {
    practiceTimeMs: 0,
    completedCharacters: 0,
    correctActions: 0,
    errorActions: 0,
    bestCpm: 0,
  },
  missedCharacters: {},
  dailyStats: {},
  settings: {
    showVirtualKeyboard: true,
    typingSound: true,
    keyboardLayout: "us-qwerty",
  },
};

function cloneDefaultState() {
  return JSON.parse(JSON.stringify(defaultState)) as PersistedState;
}

export function localDateKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function loadState(): PersistedState {
  if (typeof window === "undefined") return cloneDefaultState();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return cloneDefaultState();
    const parsed = JSON.parse(raw) as Partial<PersistedState>;
    if (parsed.version !== STORAGE_VERSION) return cloneDefaultState();
    return {
      ...cloneDefaultState(),
      ...parsed,
      progress: { ...cloneDefaultState().progress, ...parsed.progress },
      totals: { ...cloneDefaultState().totals, ...parsed.totals },
      settings: { ...cloneDefaultState().settings, ...parsed.settings },
    };
  } catch {
    return cloneDefaultState();
  }
}

export function saveState(state: PersistedState) {
  if (typeof window !== "undefined") {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }
}

function emptyDailyRecord(): DailyRecord {
  return {
    practiceTimeMs: 0,
    completedCharacters: 0,
    correctActions: 0,
    errorActions: 0,
    completedSessions: 0,
    bestCpm: 0,
  };
}

export function recordCompletedResult(
  state: PersistedState,
  result: ResultRecord,
  correctActions: number,
  errorCharacters: string[],
) {
  const dateKey = localDateKey(new Date(result.completedAt));
  const daily = state.dailyStats[dateKey] ?? emptyDailyRecord();
  const isCourse = result.mode === "course";
  const completedLessonIds = isCourse && !state.progress.completedLessonIds.includes(result.lessonId)
    ? [...state.progress.completedLessonIds, result.lessonId]
    : state.progress.completedLessonIds;
  const lessonIndex = lessons.findIndex((lesson) => lesson.id === result.lessonId);
  const nextLesson = lessons[lessonIndex + 1];
  const previousRecord = state.progress.lessonRecords[result.lessonId];
  const missedCharacters = { ...state.missedCharacters };
  errorCharacters.forEach((character) => {
    const label = character === "\n" ? "Enter" : character === " " ? "Space" : character;
    missedCharacters[label] = (missedCharacters[label] ?? 0) + 1;
  });

  return {
    ...state,
    progress: {
      ...state.progress,
      completedLessonIds,
      currentLessonId: isCourse && nextLesson ? nextLesson.id : state.progress.currentLessonId,
      lessonRecords: isCourse ? {
        ...state.progress.lessonRecords,
        [result.lessonId]: {
          attempts: (previousRecord?.attempts ?? 0) + 1,
          bestStars: Math.max(previousRecord?.bestStars ?? 0, result.stars),
          bestCpm: Math.max(previousRecord?.bestCpm ?? 0, result.cpm),
          bestAccuracy: Math.max(previousRecord?.bestAccuracy ?? 0, result.accuracy),
          lastCompletedAt: result.completedAt,
        },
      } : state.progress.lessonRecords,
    },
    totals: {
      practiceTimeMs: state.totals.practiceTimeMs + result.activeMs,
      completedCharacters: state.totals.completedCharacters + result.completedCharacters,
      correctActions: state.totals.correctActions + correctActions,
      errorActions: state.totals.errorActions + result.errors,
      bestCpm: Math.max(state.totals.bestCpm, result.cpm),
    },
    missedCharacters,
    dailyStats: {
      ...state.dailyStats,
      [dateKey]: {
        practiceTimeMs: daily.practiceTimeMs + result.activeMs,
        completedCharacters: daily.completedCharacters + result.completedCharacters,
        correctActions: daily.correctActions + correctActions,
        errorActions: daily.errorActions + result.errors,
        completedSessions: daily.completedSessions + 1,
        bestCpm: Math.max(daily.bestCpm, result.cpm),
      },
    },
    lastResult: result,
  } satisfies PersistedState;
}

export function getStreak(state: PersistedState, now = new Date()) {
  let streak = 0;
  const cursor = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const todayKey = localDateKey(cursor);
  if ((state.dailyStats[todayKey]?.completedSessions ?? 0) === 0) {
    cursor.setDate(cursor.getDate() - 1);
  }
  while ((state.dailyStats[localDateKey(cursor)]?.completedSessions ?? 0) > 0) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getTodayStats(state: PersistedState) {
  return state.dailyStats[localDateKey()] ?? emptyDailyRecord();
}

export function isLessonUnlocked(state: PersistedState, lessonId: string) {
  const index = lessons.findIndex((lesson) => lesson.id === lessonId);
  if (index <= 0) return index === 0;
  return state.progress.completedLessonIds.includes(lessons[index - 1].id);
}
