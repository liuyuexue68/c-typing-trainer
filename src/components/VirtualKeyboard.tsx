const rows = [
  ["`", "1", "2", "3", "4", "5", "6", "7", "8", "9", "0", "-", "=", "Backspace"],
  ["Tab", "q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "[", "]", "\\"],
  ["Caps", "a", "s", "d", "f", "g", "h", "j", "k", "l", ";", "'", "Enter"],
  ["Shift", "z", "x", "c", "v", "b", "n", "m", ",", ".", "/", "Shift"],
  ["Space"],
];
const shifted: Record<string, string> = { "~": "`", "!": "1", "@": "2", "#": "3", "$": "4", "%": "5", "^": "6", "&": "7", "*": "8", "(": "9", ")": "0", "_": "-", "+": "=", "{": "[", "}": "]", "|": "\\", ":": ";", "\"": "'", "<": ",", ">": ".", "?": "/" };
const displayShift: Record<string, string> = Object.fromEntries(Object.entries(shifted).map(([symbol, base]) => [base, symbol]));

function expectedKey(character: string, wrong: boolean) {
  if (wrong) return { key: "Backspace", shift: false };
  if (character === "\n") return { key: "Enter", shift: false };
  if (character === " ") return { key: "Space", shift: false };
  if (character === "\t") return { key: "Tab", shift: false };
  if (shifted[character]) return { key: shifted[character], shift: true };
  return { key: character.toLowerCase(), shift: /[A-Z]/.test(character) };
}

export function VirtualKeyboard({ character, wrong = false }: { character: string; wrong?: boolean }) {
  const expected = expectedKey(character, wrong);
  return <section className="keyboard-panel" aria-label="US QWERTY 实体键盘提示"><div className="keyboard-heading"><div><span className="live-dot" />实体键盘提示</div><span>US QWERTY · 仅提示，不可点击</span></div><div className="keyboard" aria-hidden="true">{rows.map((row, rowIndex) => <div className="keyboard-row" key={rowIndex}>{row.map((key, keyIndex) => {
    const active = key.toLowerCase() === expected.key.toLowerCase() || (key === "Shift" && expected.shift);
    const wide = ["Backspace", "Tab", "Caps", "Enter", "Shift", "Space"].includes(key);
    return <div className={`key ${wide ? `key-${key.toLowerCase()}` : ""} ${active ? "active" : ""}`} key={`${key}-${keyIndex}`}>{displayShift[key] && <small>{displayShift[key]}</small>}<span>{key === "Space" ? "" : key.toUpperCase()}</span></div>;
  })}</div>)}</div></section>;
}
