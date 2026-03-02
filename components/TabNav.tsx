"use client";

import { useRef, useEffect, useCallback } from "react";

type Tab = "activities" | "accomplishments" | "compliances" | "duty_pnco";

interface TabNavProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: "activities", label: "ACTIVITIES", icon: "◈" },
  { key: "accomplishments", label: "ACCOMPLISHMENTS", icon: "★" },
  { key: "compliances", label: "COMPLIANCES", icon: "◇" },
  { key: "duty_pnco", label: "DUTY PNCO", icon: "⊕" },
];

export default function TabNav({ activeTab, onTabChange }: TabNavProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const activeIndex = TABS.findIndex((t) => t.key === activeTab);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        const next = Math.min(activeIndex + 1, TABS.length - 1);
        tabRefs.current[next]?.focus();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        const prev = Math.max(activeIndex - 1, 0);
        tabRefs.current[prev]?.focus();
      } else if (e.key === "Enter") {
        const focused = document.activeElement;
        const idx = tabRefs.current.findIndex((ref) => ref === focused);
        if (idx !== -1) {
          onTabChange(TABS[idx].key);
        }
      }
    },
    [activeIndex, onTabChange]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <nav className="flex gap-3 px-10 pt-5 pb-2">
      {TABS.map((tab, i) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            ref={(el) => { tabRefs.current[i] = el; }}
            tabIndex={0}
            onClick={() => onTabChange(tab.key)}
            className={`
              relative px-8 py-3.5 text-xl font-bold tracking-[0.12em] uppercase transition-all duration-300
              rounded-lg border outline-none
              ${isActive
                ? "bg-accent/15 border-accent/50 text-accent tv-glow-cyan"
                : "bg-card border-border text-muted"
              }
            `}
            style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
          >
            <span className="flex items-center gap-3">
              <span className={`text-lg ${isActive ? "opacity-100" : "opacity-40"}`}>
                {tab.icon}
              </span>
              {tab.label}
            </span>
            {isActive && (
              <div className="absolute bottom-0 left-4 right-4 h-0.5 bg-accent rounded-full" />
            )}
          </button>
        );
      })}

      {/* Auto-cycle indicator */}
      <div className="ml-auto flex items-center gap-2 text-sm text-muted/50">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M23 4v6h-6M1 20v-6h6" />
          <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
        </svg>
        <span className="tracking-wider">AUTO</span>
      </div>
    </nav>
  );
}
