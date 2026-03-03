"use client";

import type { DashboardData } from "@/lib/types";
import { formatDate } from "@/lib/format";

interface QuickViewProps {
  data: DashboardData;
}

function isNotComplied(remarks: string): boolean {
  const upper = remarks.toUpperCase().trim();
  return upper !== "COMPLIED" && upper !== "DISSEMINATED";
}

export default function QuickView({ data }: QuickViewProps) {
  const todayPnco = data.duty_pnco.find((r) => r.is_today);

  const upcomingActivities = data.activities.filter((a) => a.status === "Upcoming");
  const nearestActivity = upcomingActivities.length > 0 ? upcomingActivities[0] : undefined;

  const urgentCompliances = data.compliances.filter((c) => isNotComplied(c.remarks));

  // ICT inventory per-item totals
  const itItems: { label: string; total: number }[] = [
    { label: "Desktop", total: data.it_inventory.reduce((s, i) => s + i.desktop, 0) },
    { label: "Laptop", total: data.it_inventory.reduce((s, i) => s + i.laptop, 0) },
    { label: "Servers", total: data.it_inventory.reduce((s, i) => s + i.servers, 0) },
    { label: "CCTVs", total: data.it_inventory.reduce((s, i) => s + i.cctvs, 0) },
    { label: "BWC (Live)", total: data.it_inventory.reduce((s, i) => s + i.body_worn_cameras_live, 0) },
    { label: "BWC (Rec)", total: data.it_inventory.reduce((s, i) => s + i.body_worn_cameras_recording, 0) },
    { label: "Drones", total: data.it_inventory.reduce((s, i) => s + i.drones, 0) },
  ];
  const esItems: { label: string; total: number }[] = [
    { label: "Cybereason", total: data.it_inventory.reduce((s, i) => s + i.cybereason, 0) },
    { label: "Sophos", total: data.it_inventory.reduce((s, i) => s + i.sophos, 0) },
  ];
  const ctItems: { label: string; total: number }[] = [
    { label: "Tactical", total: data.ct_inventory.reduce((s, i) => s + i.tactical, 0) },
    { label: "Hytera HH", total: data.ct_inventory.reduce((s, i) => s + i.hytera_handheld, 0) },
    { label: "Hytera Base", total: data.ct_inventory.reduce((s, i) => s + i.hytera_base_radio, 0) },
    { label: "Hytera Mobile", total: data.ct_inventory.reduce((s, i) => s + i.hytera_mobile_radio, 0) },
    { label: "PoC OnePrime", total: data.ct_inventory.reduce((s, i) => s + i.poc_oneprime, 0) },
    { label: "PoC Yategood", total: data.ct_inventory.reduce((s, i) => s + i.poc_yategood, 0) },
    { label: "Smartphones", total: data.ct_inventory.reduce((s, i) => s + i.smartphones, 0) },
  ];

  return (
    <div className="flex-1 flex flex-col gap-3 px-10 py-4 overflow-hidden animate-fade-in">
      {/* Duty PNCO Banner */}
      <div className="tv-card rounded-xl border-accent/30 px-6 py-3 tv-glow-cyan animate-fade-in-up flex items-center gap-4">
        <span
          className="text-base font-bold tracking-[0.15em] text-accent/70 uppercase shrink-0"
          style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
        >
          Duty PNCO of the Day:
        </span>
        {todayPnco ? (
          <div className="flex items-center gap-4">
            <span
              className="text-2xl font-bold text-accent"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              {todayPnco.pnco_name}
            </span>
            <span className="text-lg font-mono tabular-nums text-foreground/70 tracking-wider">
              {todayPnco.contact_number}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-md bg-accent/20 border border-accent/40 px-2.5 py-0.5 text-xs font-bold text-accent tracking-wider">
              <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
              ON DUTY
            </span>
          </div>
        ) : (
          <span className="text-lg text-muted/50">No duty assigned today</span>
        )}
      </div>

      {/* Main 2-column layout */}
      <div className="flex-1 grid grid-cols-2 gap-4 min-h-0">
        {/* Left Column */}
        <div className="flex flex-col gap-3 min-h-0">
          {/* Upcoming Activity */}
          <ActivityCard
            label="Upcoming Activity"
            activity={nearestActivity}
            index={0}
            accentColor="accent"
          />

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          {/* ICT Inventory Summary */}
          <div className="flex-1 min-h-0 animate-fade-in-up flex flex-col" style={{ animationDelay: "200ms" }}>
            <span
              className="text-sm font-bold tracking-[0.15em] text-muted/70 uppercase mb-2 block"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              ICT Inventory
            </span>
            <div className="flex-1 grid grid-cols-3 gap-3 min-h-0">
              <InventoryGroupCard title="IT Equipment" items={itItems} color="blue" delay={250} />
              <InventoryGroupCard title="Endpoint Security" items={esItems} color="purple" delay={310} />
              <InventoryGroupCard title="CT Equipment" items={ctItems} color="emerald" delay={370} />
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-3 min-h-0 overflow-hidden">
          {/* Urgent Compliances */}
          <div className="shrink-0 animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            <span
              className="text-sm font-bold tracking-[0.15em] text-danger/70 uppercase mb-2 block"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Urgent Compliances
            </span>
            {urgentCompliances.length > 0 ? (
              <div className="flex flex-col gap-2">
                {urgentCompliances.slice(0, 5).map((c, i) => (
                  <div
                    key={c.id}
                    className="tv-card rounded-lg border-danger/20 px-4 py-2.5 flex items-center gap-4 animate-fade-in-up"
                    style={{ animationDelay: `${200 + i * 60}ms` }}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-danger animate-pulse shrink-0" />
                    <span className="text-base font-semibold text-foreground flex-1">
                      {c.subject}
                    </span>
                    <CategoryBadge category={c.category} />
                    {c.target_date && (
                      <span className="text-sm font-semibold tabular-nums text-foreground/90 shrink-0">
                        {formatDate(c.target_date)}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="tv-card rounded-xl border-success/20 flex items-center justify-center py-8">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 rounded-full bg-success" />
                  <span className="text-lg font-semibold text-success">All compliances up to date</span>
                </div>
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent shrink-0" />
        </div>
      </div>
    </div>
  );
}

function ActivityCard({
  label,
  activity,
  index,
  accentColor,
}: {
  label: string;
  activity?: { activity_name: string; activity_date: string; activity_time: string; attendees: string };
  index: number;
  accentColor: string;
}) {
  return (
    <div
      className={`tv-card rounded-xl border-${accentColor}/20 px-5 py-3 animate-fade-in-up`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <span
        className={`text-sm font-bold tracking-[0.15em] text-${accentColor}/70 uppercase block mb-1`}
        style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
      >
        {label}
      </span>
      {activity ? (
        <div className="flex flex-col gap-1">
          <span
            className="text-xl font-bold text-foreground"
            style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
          >
            {activity.activity_name}
          </span>
          <div className="flex items-center gap-3">
            <span className="text-base font-semibold tabular-nums text-foreground/90">
              {formatDate(activity.activity_date)}
            </span>
            <span className="text-base font-semibold tabular-nums text-foreground/90">
              {activity.activity_time}
            </span>
          </div>
        </div>
      ) : (
        <span className="text-lg text-muted/40">None scheduled</span>
      )}
    </div>
  );
}

const inventoryColorMap = {
  blue: { card: "border-blue-500/30 bg-blue-500/[0.05]", title: "text-blue-300", label: "text-blue-300/60", value: "text-blue-300" },
  purple: { card: "border-purple-500/30 bg-purple-500/[0.05]", title: "text-purple-300", label: "text-purple-300/60", value: "text-purple-300" },
  emerald: { card: "border-emerald-500/30 bg-emerald-500/[0.05]", title: "text-emerald-300", label: "text-emerald-300/60", value: "text-emerald-300" },
} as const;

function InventoryGroupCard({ title, items, color, delay }: { title: string; items: { label: string; total: number }[]; color: keyof typeof inventoryColorMap; delay: number }) {
  const c = inventoryColorMap[color];
  return (
    <div
      className={`tv-card rounded-xl ${c.card} flex flex-col px-4 py-3 animate-fade-in-up`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <span
        className={`text-xs font-bold tracking-[0.12em] ${c.title} uppercase mb-2`}
        style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
      >
        {title}
      </span>
      <div className="flex flex-col gap-0.5 flex-1 justify-center">
        {items.map((item) => (
          <div key={item.label} className="flex items-center justify-between">
            <span className={`text-xs ${c.label}`}>{item.label}</span>
            <span
              className={`text-sm font-bold tabular-nums ${c.value}`}
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              {item.total}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryBadge({ category }: { category: string }) {
  const upper = category.toUpperCase().trim();
  const style =
    upper === "RUSH"
      ? "bg-danger/10 border border-danger/30 text-danger"
      : upper === "PRIORITY"
        ? "bg-accent/10 border border-accent/30 text-accent"
        : "bg-muted/10 border border-muted/30 text-muted";

  return (
    <span className={`text-sm font-bold tracking-wider px-2.5 py-0.5 rounded-full shrink-0 ${style}`}>
      {category}
    </span>
  );
}
