export type ExerciseMode = "course" | "symbols" | "keywords" | "snippets" | "program" | "weak";

export interface Lesson {
  id: string;
  chapterId: string;
  order: number;
  title: string;
  description: string;
  syntaxHint?: string;
  difficulty: number;
  content: string;
  targetCharacters: string[];
  mode: ExerciseMode;
}

export interface Chapter {
  id: string;
  order: number;
  title: string;
  description: string;
  available: boolean;
  lessonIds: string[];
}

export interface LessonRecord {
  attempts: number;
  bestStars: number;
  bestCpm: number;
  bestAccuracy: number;
  lastCompletedAt: string;
}

export interface DailyRecord {
  practiceTimeMs: number;
  completedCharacters: number;
  correctActions: number;
  errorActions: number;
  completedSessions: number;
  bestCpm: number;
}

export interface ResultRecord {
  lessonId: string;
  title: string;
  mode: ExerciseMode;
  accuracy: number;
  cpm: number;
  errors: number;
  activeMs: number;
  completedCharacters: number;
  stars: number;
  completedAt: string;
}

export interface PersistedState {
  version: number;
  progress: {
    currentLessonId: string;
    completedLessonIds: string[];
    lessonRecords: Record<string, LessonRecord>;
  };
  totals: {
    practiceTimeMs: number;
    completedCharacters: number;
    correctActions: number;
    errorActions: number;
    bestCpm: number;
  };
  missedCharacters: Record<string, number>;
  dailyStats: Record<string, DailyRecord>;
  settings: {
    showVirtualKeyboard: boolean;
    typingSound: boolean;
    keyboardLayout: "us-qwerty";
  };
  lastResult?: ResultRecord;
}
