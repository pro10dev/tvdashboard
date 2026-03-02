import type { DutyPNCO } from "@/lib/types";

interface DutyPNCOCardProps {
  roster: DutyPNCO[];
}

export default function DutyPNCOCard({ roster }: DutyPNCOCardProps) {
  const todayEntry = roster.find((r) => r.is_today);
  const upcoming = roster.filter((r) => !r.is_today && r.date >= (todayEntry?.date ?? new Date().toISOString().split("T")[0])).slice(0, 3);

  return (
    <div className="px-10 py-5 animate-fade-in" style={{ animationDelay: "200ms" }}>
      <div className="grid grid-cols-3 gap-6">
        {/* Today's Duty PNCO - prominent card */}
        <div className="col-span-1 tv-card rounded-xl border-accent/30 p-8 tv-glow-cyan animate-fade-in-up">
          <div className="flex flex-col items-center text-center gap-4">
            <span className="text-base font-bold tracking-[0.15em] text-accent/70 uppercase"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Duty PNCO Today
            </span>

            {todayEntry ? (
              <>
                <span
                  className="text-4xl font-bold text-accent tv-glow-cyan leading-tight"
                  style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
                >
                  {todayEntry.pnco_name}
                </span>
                <span className="text-2xl font-mono tabular-nums text-foreground/80 tracking-wider">
                  {todayEntry.contact_number}
                </span>
                <span className="inline-flex items-center gap-2 rounded-md bg-accent/20 border border-accent/40 px-3 py-1 text-sm font-bold text-accent tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  ON DUTY
                </span>
              </>
            ) : (
              <span className="text-xl text-muted/50">No duty assigned today</span>
            )}
          </div>
        </div>

        {/* Upcoming roster */}
        <div className="col-span-2 tv-card rounded-xl border-border p-8 animate-fade-in-up" style={{ animationDelay: "100ms" }}>
          <span
            className="text-base font-bold tracking-[0.15em] text-muted/70 uppercase mb-5 block"
            style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
          >
            Upcoming Duty Roster
          </span>

          {upcoming.length > 0 ? (
            <div className="flex flex-col gap-4">
              {upcoming.map((entry, i) => (
                <div
                  key={entry.date}
                  className="flex items-center gap-6 rounded-lg bg-surface/50 border border-border/40 px-6 py-4 animate-fade-in-up"
                  style={{ animationDelay: `${200 + i * 80}ms` }}
                >
                  <span className="text-xl tabular-nums text-accent/80 font-medium min-w-[130px]">
                    {entry.date}
                  </span>
                  <span
                    className="text-2xl font-bold text-foreground flex-1"
                    style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
                  >
                    {entry.pnco_name}
                  </span>
                  <span className="text-lg font-mono tabular-nums text-muted tracking-wider">
                    {entry.contact_number}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <span className="text-xl text-muted/50">No upcoming entries</span>
          )}
        </div>
      </div>
    </div>
  );
}
