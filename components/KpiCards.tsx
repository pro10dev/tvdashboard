import type { KPIs } from "@/lib/types";

interface KpiCardsProps {
  kpis: KPIs;
  tab?: "activities" | "compliances";
}

type CardConfig = { key: keyof KPIs; label: string; color: string; glowClass: string; borderColor: string };

const ACTIVITY_CARDS: CardConfig[] = [
  {
    key: "total_activities",
    label: "Total Activities",
    color: "text-accent",
    glowClass: "tv-glow-cyan",
    borderColor: "border-accent/30",
  },
  {
    key: "upcoming_count",
    label: "Upcoming",
    color: "text-warning",
    glowClass: "tv-glow-warning",
    borderColor: "border-warning/30",
  },
  {
    key: "completed_count",
    label: "Completed",
    color: "text-success",
    glowClass: "tv-glow-success",
    borderColor: "border-success/30",
  },
  {
    key: "total_accomplishments",
    label: "Accomplishments",
    color: "text-gold",
    glowClass: "tv-glow-gold",
    borderColor: "border-gold/30",
  },
];

const COMPLIANCE_CARDS: CardConfig[] = [
  {
    key: "total_compliances",
    label: "Total Compliances",
    color: "text-accent",
    glowClass: "tv-glow-cyan",
    borderColor: "border-accent/30",
  },
  {
    key: "upcoming_compliances",
    label: "Upcoming",
    color: "text-warning",
    glowClass: "tv-glow-warning",
    borderColor: "border-warning/30",
  },
  {
    key: "complied_count",
    label: "Complied",
    color: "text-success",
    glowClass: "tv-glow-success",
    borderColor: "border-success/30",
  },
  {
    key: "not_complied_count",
    label: "Not Complied",
    color: "text-danger",
    glowClass: "tv-glow-danger",
    borderColor: "border-danger/30",
  },
];

export default function KpiCards({ kpis, tab = "activities" }: KpiCardsProps) {
  const cards = tab === "compliances" ? COMPLIANCE_CARDS : ACTIVITY_CARDS;

  return (
    <div className="flex gap-4 px-10 py-3">
      {cards.map((card, i) => (
        <div
          key={card.key}
          className={`
            tv-card flex items-center gap-3 rounded-lg ${card.borderColor} px-6 py-3
            ${card.glowClass} animate-fade-in-up
          `}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          <span
            className={`text-4xl font-bold ${card.color} tabular-nums leading-none`}
            style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
          >
            {kpis[card.key]}
          </span>
          <span className="text-base text-muted font-medium tracking-wide uppercase">
            {card.label}
          </span>
        </div>
      ))}
    </div>
  );
}
