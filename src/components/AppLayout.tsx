import { useEffect, useRef, useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import { useProgress } from "../context/ProgressContext";

export function AppLayout() {
  const { state, toggleVirtualKeyboard, toggleTypingSound } = useProgress();
  const [settingsOpen, setSettingsOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const close = (event: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(event.target as Node)) setSettingsOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);
  return (
    <div className="app-shell">
      <header className="topbar">
        <NavLink className="brand" to="/" aria-label="C Typing Trainer 首页"><span className="brand-mark">&lt;C&gt;</span><span>C Typing Trainer</span></NavLink>
        <nav aria-label="主导航"><NavLink to="/courses">学习</NavLink><NavLink to="/practice">自由练习</NavLink><NavLink to="/stats">统计</NavLink></nav>
        <div className="settings-wrap" ref={panelRef}>
          <button className="icon-button" aria-label="设置" aria-expanded={settingsOpen} onClick={() => setSettingsOpen((open) => !open)}><span aria-hidden="true">⚙</span></button>
          {settingsOpen && <div className="settings-popover"><strong>练习设置</strong><label className="switch-row"><span><b>显示虚拟键盘</b><small>只提示实体键盘位置，不能点击输入</small></span><input type="checkbox" checked={state.settings.showVirtualKeyboard} onChange={toggleVirtualKeyboard} /></label><label className="switch-row"><span><b>打字音效</b><small>实体键盘输入时播放轻微按键声</small></span><input type="checkbox" checked={state.settings.typingSound} onChange={toggleTypingSound} /></label><div className="layout-note"><span>键盘布局</span><b>US QWERTY</b></div></div>}
        </div>
      </header>
      <Outlet />
    </div>
  );
}
