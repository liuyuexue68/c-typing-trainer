import { describe, expect, it } from "vitest";
import {
  applyKey,
  calculateAccuracy,
  calculateCpm,
  createTrainerState,
  getStarRating,
  normalizeTarget,
  pauseTrainer,
  resumeTrainer,
} from "./engine";

describe("trainer engine", () => {
  it("normalizes CRLF and tabs", () => {
    expect(normalizeTarget("a\r\n\tb")).toBe("a\n    b");
  });

  it("accepts ordinary characters and completes on the final character", () => {
    let state = createTrainerState("int");
    state = applyKey(state, "i").state;
    state = applyKey(state, "n").state;
    state = applyKey(state, "t").state;
    expect(state.cursor).toBe(3);
    expect(state.status).toBe("completed");
  });

  it("inserts a wrong character and requires Backspace", () => {
    let state = createTrainerState("a");
    state = applyKey(state, "x").state;
    expect(state.wrongInput).toBe("x");
    expect(state.errorActions).toBe(1);
    expect(applyKey(state, "a").accepted).toBe(false);
    state = applyKey(state, "Backspace").state;
    state = applyKey(state, "a").state;
    expect(state.status).toBe("completed");
    expect(state.errorActions).toBe(1);
  });

  it("maps Tab to exactly four target spaces as one action", () => {
    const result = applyKey(createTrainerState("    x"), "Tab");
    expect(result.state.cursor).toBe(4);
    expect(result.state.correctActions).toBe(1);
    expect(result.state.completedCharacters).toBe(4);
  });

  it("maps Enter to a newline", () => {
    const result = applyKey(createTrainerState("\n"), "Enter");
    expect(result.state.status).toBe("completed");
  });

  it("automatically inserts the next line indentation after Enter", () => {
    let state = createTrainerState("{\n    printf();\n}");
    state = applyKey(state, "{").state;
    state = applyKey(state, "Enter").state;

    expect(state.cursor).toBe(6);
    expect(state.target[state.cursor]).toBe("p");
    expect(state.completedCharacters).toBe(6);
    expect(state.correctActions).toBe(2);
  });

  it("does not skip an intentional blank line when applying indentation", () => {
    let state = createTrainerState("a\n\n    b");
    state = applyKey(state, "a").state;
    state = applyKey(state, "Enter").state;

    expect(state.cursor).toBe(2);
    expect(state.target[state.cursor]).toBe("\n");

    state = applyKey(state, "Enter").state;
    expect(state.cursor).toBe(7);
    expect(state.target[state.cursor]).toBe("b");
  });

  it("auto-completes an empty pair", () => {
    const result = applyKey(createTrainerState("printf();"), "p");
    let state = result.state;
    for (const key of "rintf") state = applyKey(state, key).state;
    state = applyKey(state, "(").state;
    expect(state.autoPairHints).not.toContain(7);
    expect(state.cursor).toBe(8);
    expect(state.completedCharacters).toBe(8);
    expect(state.target[state.cursor]).toBe(";");
  });

  it.each([
    ["()", "("],
    ["{}", "{"],
    ["[]", "["],
    ["\"\"", "\""],
  ])("automatically types the closer for %s", (target, opener) => {
    const state = applyKey(createTrainerState(target), opener).state;
    expect(state.cursor).toBe(target.length);
    expect(state.completedCharacters).toBe(target.length);
    expect(state.correctActions).toBe(1);
    expect(state.status).toBe("completed");
  });

  it("keeps the caret inside a non-empty pair and skips the closer later", () => {
    let state = applyKey(createTrainerState("(abc)"), "(").state;
    expect(state.cursor).toBe(1);
    expect(state.autoPairHints).toContain(4);

    for (const key of "abc") state = applyKey(state, key).state;

    expect(state.cursor).toBe(5);
    expect(state.completedCharacters).toBe(5);
    expect(state.correctActions).toBe(4);
    expect(state.autoPairHints).toHaveLength(0);
    expect(state.status).toBe("completed");
  });

  it("automatically closes nested pairs in the correct order", () => {
    let state = createTrainerState("([x])");
    for (const key of "([x") state = applyKey(state, key).state;

    expect(state.cursor).toBe(5);
    expect(state.completedCharacters).toBe(5);
    expect(state.correctActions).toBe(3);
    expect(state.status).toBe("completed");
  });

  it("only hints angle brackets in include context", () => {
    let includeState = createTrainerState("#include <stdio.h>");
    for (const key of "#include ") includeState = applyKey(includeState, key).state;
    includeState = applyKey(includeState, "<").state;
    expect(includeState.autoPairHints).toContain(17);

    let compareState = createTrainerState("a < b");
    for (const key of "a ") compareState = applyKey(compareState, key).state;
    compareState = applyKey(compareState, "<").state;
    expect(compareState.autoPairHints).toHaveLength(0);
  });

  it("does not treat a closing quote as a new opener", () => {
    let state = createTrainerState("\"x\" \"y\"");
    state = applyKey(state, "\"").state;
    expect(state.autoPairHints).toContain(2);
    state = applyKey(state, "x").state;
    expect(state.cursor).toBe(3);
    expect(state.autoPairHints).not.toContain(4);
  });

  it("calculates accuracy, CPM and stars", () => {
    expect(calculateAccuracy(98, 2)).toBe(98);
    expect(calculateCpm(120, 60_000)).toBe(120);
    expect(getStarRating(98)).toBe(5);
    expect(getStarRating(79)).toBe(1);
  });

  it.each([";", "\"", "'", "\\", "{", "}", "(", ")", "[", "]", "<", ">", "+", "-", "=", "!", "&", "|"])(
    "accepts required symbol %s",
    (symbol) => {
      expect(applyKey(createTrainerState(symbol), symbol).state.status).toBe("completed");
    },
  );

  it.each(["++", "--", "==", "!=", "&&", "||", "abc 123", "\\n"])("accepts required sequence %s", (sequence) => {
    let state = createTrainerState(sequence);
    for (const character of sequence) state = applyKey(state, character).state;
    expect(state.status).toBe("completed");
  });

  it("pauses and resumes without accepting input while paused", () => {
    let state = pauseTrainer(createTrainerState("a"));
    expect(applyKey(state, "a").accepted).toBe(false);
    state = resumeTrainer(state);
    expect(applyKey(state, "a").state.status).toBe("completed");
  });
});
