import type { DutyPNCO } from "@/lib/types";
import { formatDateWithDay } from "@/lib/format";

interface DutyPNCOCardProps {
  roster: DutyPNCO[];
  shiftTime?: string;
}

/**
 * Determine the effective duty date based on shift time.
 * If current time is before the shift hour, the previous day's PNCO is still on duty.
 */
function getEffectiveDutyDate(shiftTime: string): string {
  const now = new Date();
  const [shiftH, shiftM] = shiftTime.split(":").map(Number);
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const shiftMinutes = (shiftH || 8) * 60 + (shiftM || 0);

  const effective = new Date(now);
  if (currentMinutes < shiftMinutes) {
    effective.setDate(effective.getDate() - 1);
  }

  const y = effective.getFullYear();
  const m = String(effective.getMonth() + 1).padStart(2, "0");
  const d = String(effective.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function DutyPNCOCard({ roster, shiftTime = "08:00" }: DutyPNCOCardProps) {
  const effectiveDate = getEffectiveDutyDate(shiftTime);

  const currentIdx = roster.findIndex((r) => r.date >= effectiveDate);
  const onDutyEntry = currentIdx >= 0 ? roster[currentIdx] : null;

  // Previous: entry before current
  const previousEntry = currentIdx > 0 ? roster[currentIdx - 1] : null;

  // Upcoming: entries after current (top 5)
  const upcoming = currentIdx >= 0
    ? roster.slice(currentIdx + 1, currentIdx + 6)
    : [];

  return (
    <div className="px-10 py-3 animate-fade-in flex flex-col gap-3" style={{ animationDelay: "200ms" }}>
      {/* Top row: Previous | On Duty Today | Next Up */}
      <div className="grid grid-cols-3 gap-4">
        {/* Previous Duty PNCO */}
        <div className="tv-card rounded-xl border-border/40 px-5 py-3 animate-fade-in-up opacity-60">
          <div className="flex flex-col items-center text-center gap-1.5">
            <span
              className="text-sm font-bold tracking-[0.15em] text-muted/70 uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Previous Duty PNCO
            </span>
            {previousEntry ? (
              <>
                <span
                  className="text-2xl font-bold text-foreground/70 leading-tight"
                  style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
                >
                  {previousEntry.pnco_name}
                </span>
                <span className="text-base font-mono tabular-nums text-muted tracking-wider">
                  {previousEntry.contact_number}
                </span>
                <span className="text-xs tabular-nums text-muted/60">
                  {formatDateWithDay(previousEntry.date)}
                </span>
              </>
            ) : (
              <span className="text-base text-muted/50">No previous entry</span>
            )}
          </div>
        </div>

        {/* Current Duty PNCO - prominent */}
        <div className="tv-card rounded-xl border-accent/30 px-5 py-3 tv-glow-cyan animate-fade-in-up" style={{ animationDelay: "80ms" }}>
          <div className="flex flex-col items-center text-center gap-1.5">
            <span
              className="text-sm font-bold tracking-[0.15em] text-accent/70 uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Duty PNCO Today
            </span>
            {onDutyEntry ? (
              <>
                <span
                  className="text-3xl font-bold text-accent tv-glow-cyan leading-tight"
                  style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
                >
                  {onDutyEntry.pnco_name}
                </span>
                <span className="text-lg font-mono tabular-nums text-foreground/80 tracking-wider">
                  {onDutyEntry.contact_number}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-xs font-bold text-accent tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                  ON DUTY
                </span>
              </>
            ) : (
              <span className="text-base text-muted/50">No duty assigned today</span>
            )}
          </div>
        </div>

        {/* Next Duty PNCO */}
        <div className="tv-card rounded-xl border-border/40 px-5 py-3 animate-fade-in-up opacity-60" style={{ animationDelay: "160ms" }}>
          <div className="flex flex-col items-center text-center gap-1.5">
            <span
              className="text-sm font-bold tracking-[0.15em] text-muted/70 uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Next Duty PNCO
            </span>
            {upcoming[0] ? (
              <>
                <span
                  className="text-2xl font-bold text-foreground/70 leading-tight"
                  style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
                >
                  {upcoming[0].pnco_name}
                </span>
                <span className="text-base font-mono tabular-nums text-muted tracking-wider">
                  {upcoming[0].contact_number}
                </span>
                <span className="text-xs tabular-nums text-muted/60">
                  {formatDateWithDay(upcoming[0].date)}
                </span>
              </>
            ) : (
              <span className="text-base text-muted/50">No upcoming entry</span>
            )}
          </div>
        </div>
      </div>

      {/* Bottom: Upcoming roster list */}
      {upcoming.length > 1 && (
        <div className="tv-card rounded-xl border-border px-6 py-4 animate-fade-in-up" style={{ animationDelay: "240ms" }}>
          <span
            className="text-sm font-bold tracking-[0.15em] text-muted/70 uppercase mb-3 block"
            style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
          >
            Upcoming Duty Roster
          </span>

          <div className="flex flex-col gap-2">
            {upcoming.slice(1).map((entry, i) => (
              <div
                key={entry.date}
                className="flex items-center gap-6 rounded-lg bg-surface/50 border border-border/40 px-5 py-2.5 animate-fade-in-up"
                style={{ animationDelay: `${320 + i * 80}ms` }}
              >
                <span className="text-base tabular-nums text-accent/80 font-medium min-w-[130px]">
                  {formatDateWithDay(entry.date)}
                </span>
                <span
                  className="text-xl font-bold text-foreground flex-1"
                  style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
                >
                  {entry.pnco_name}
                </span>
                <span className="text-base font-mono tabular-nums text-muted tracking-wider">
                  {entry.contact_number}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
