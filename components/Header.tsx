"use client";

import { useState, useEffect } from "react";

interface HeaderProps {
  lastUpdated: string;
  connectionLost?: boolean;
  isStale?: boolean;
}

export default function Header({ lastUpdated, connectionLost, isStale }: HeaderProps) {
  const [time, setTime] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    function tick() {
      const now = new Date();
      setDate(
        now.toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })
      );
      setTime(
        now.toLocaleTimeString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        })
      );
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const updatedLabel = lastUpdated
    ? `Updated ${new Date(lastUpdated).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}`
    : "";

  return (
    <header className="relative z-10">
      {/* Gradient accent bar */}
      <div className="header-gradient-bar h-1" />

      <div className="flex items-center justify-between px-10 py-4 bg-surface/80">
        {/* Title block */}
        <div className="flex items-center gap-5">
          <div className="flex flex-col">
            <h1
              className="text-4xl font-bold tracking-[0.15em] text-foreground tv-text-glow-cyan uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              RICTMD Information Board
            </h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-2xl tracking-wide">{date}</span>
            </div>
          </div>
        </div>

        {/* Right side: clock + status */}
        <div className="flex items-center gap-6">
          {/* Status indicators */}
          <div className="flex items-center gap-3">
            {connectionLost ? (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-danger/10 border border-danger/30">
                <div className="w-2.5 h-2.5 rounded-full bg-danger animate-pulse" />
                <span className="text-sm font-semibold text-danger tracking-wide">OFFLINE</span>
              </div>
            ) : isStale ? (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-warning/10 border border-warning/30">
                <div className="w-2.5 h-2.5 rounded-full bg-warning" />
                <span className="text-sm font-semibold text-warning tracking-wide">STALE</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-success/10 border border-success/30">
                <div className="live-dot" />
                <span className="text-sm font-semibold text-success tracking-wide">LIVE</span>
              </div>
            )}
            {updatedLabel && (
              <span className="text-sm text-muted">{updatedLabel}</span>
            )}
          </div>

          {/* Clock */}
          <div
            className="text-4xl font-bold text-accent tracking-wider tv-text-glow-cyan tabular-nums"
            style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
          >
            {time}
          </div>
        </div>
      </div>

      {/* Bottom border glow */}
      <div className="h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent" />
    </header>
  );
}
