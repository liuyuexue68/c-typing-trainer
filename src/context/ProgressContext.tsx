import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { loadState, recordCompletedResult, saveState } from "../storage/repository";
import type { PersistedState, ResultRecord } from "../types";

interface ProgressContextValue {
  state: PersistedState;
  completeResult: (result: ResultRecord, correctActions: number, errors: string[]) => void;
  toggleVirtualKeyboard: () => void;
  toggleTypingSound: () => void;
}

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState(loadState);
  const value = useMemo<ProgressContextValue>(() => ({
    state,
    completeResult(result, correctActions, errors) {
      setState((current) => {
        const next = recordCompletedResult(current, result, correctActions, errors);
        saveState(next);
        return next;
      });
    },
    toggleVirtualKeyboard() {
      setState((current) => {
        const next = { ...current, settings: { ...current.settings, showVirtualKeyboard: !current.settings.showVirtualKeyboard } };
        saveState(next);
        return next;
      });
    },
    toggleTypingSound() {
      setState((current) => {
        const next = { ...current, settings: { ...current.settings, typingSound: !current.settings.typingSound } };
        saveState(next);
        return next;
      });
    },
  }), [state]);
  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}
