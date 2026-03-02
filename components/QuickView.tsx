"use client";

import { useState, useEffect, useRef } from "react";
import type { DashboardData } from "@/lib/types";
import { toViewableImageUrl } from "@/lib/image";
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

  // Weekly accomplishments — last 7 days
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weekThreshold = oneWeekAgo.toISOString().split("T")[0];
  const weeklyAccomplishments = data.accomplishments.filter(
    (a) => a.accomplishment_date >= weekThreshold
  );

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

          {/* Weekly Accomplishments Slideshow */}
          <div className="flex-1 min-h-0 animate-fade-in-up" style={{ animationDelay: "200ms" }}>
            <span
              className="text-sm font-bold tracking-[0.15em] text-muted/70 uppercase mb-2 block"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Weekly Accomplishments
            </span>
            {weeklyAccomplishments.length > 0 ? (
              <AccomplishmentSlideshow accomplishments={weeklyAccomplishments} />
            ) : (
              <div className="tv-card rounded-xl border-border flex items-center justify-center h-full">
                <span className="text-lg text-muted/40">No accomplishments this week</span>
              </div>
            )}
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

          {/* Coming Soon */}
          <div className="flex-1 min-h-0 flex flex-col animate-fade-in-up" style={{ animationDelay: "300ms" }}>
            <span
              className="text-sm font-bold tracking-[0.15em] text-muted/70 uppercase mb-2 block shrink-0"
              style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
            >
              Coming Soon
            </span>
            <div className="flex-1 min-h-0 tv-card rounded-xl border-border/30 flex items-center justify-center">
              <span className="text-base text-muted/30 tracking-wider uppercase">Reserved for future use</span>
            </div>
          </div>
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

function AccomplishmentSlideshow({ accomplishments }: { accomplishments: { accomplishment_name: string; description: string; action_photo_url: string; accomplishment_date: string }[] }) {
  const [current, setCurrent] = useState(0);
  const [imgError, setImgError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval>>(null);

  useEffect(() => {
    if (accomplishments.length <= 1) return;
    timerRef.current = setInterval(() => {
      setCurrent((prev) => (prev + 1) % accomplishments.length);
      setImgError(false);
    }, 6000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [accomplishments.length]);

  const item = accomplishments[current];
  const imageUrl = toViewableImageUrl(item.action_photo_url);

  return (
    <div className="tv-card rounded-xl border-border overflow-hidden flex h-full min-h-0">
      {/* Image */}
      <div className="relative w-2/5 bg-surface overflow-hidden shrink-0">
        {imageUrl && !imgError ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={imageUrl}
            alt={item.accomplishment_name}
            className="absolute inset-0 w-full h-full object-cover"
            onError={() => setImgError(true)}
            referrerPolicy="no-referrer"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted/30">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1 p-4 flex-1 min-w-0">
        <h3
          className="text-lg font-bold text-foreground leading-tight truncate"
          style={{ fontFamily: "var(--font-oswald), var(--font-display)" }}
        >
          {item.accomplishment_name}
        </h3>
        <p className="line-clamp-3 text-sm text-muted leading-relaxed flex-1">
          {item.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <span className="text-xs text-accent/60 font-medium tracking-wide tabular-nums">
            {formatDate(item.accomplishment_date)}
          </span>
          {accomplishments.length > 1 && (
            <span className="text-xs text-muted/40 tabular-nums">
              {current + 1} / {accomplishments.length}
            </span>
          )}
        </div>
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
