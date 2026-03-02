"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { DashboardData } from "@/lib/types";
import { useDashboardRefresh } from "@/hooks/useDashboardRefresh";
import { useWakeLock } from "@/hooks/useWakeLock";
import { useGlobalErrorHandler } from "@/hooks/useGlobalErrorHandler";
import Header from "./Header";
import TabNav from "./TabNav";
import KpiCards from "./KpiCards";
import ActivitiesTable from "./ActivitiesTable";
import AccomplishmentsGrid from "./AccomplishmentsGrid";
import CompliancesTable from "./CompliancesTable";
import DutyPNCOCard from "./DutyPNCOCard";

type Tab = "activities" | "accomplishments" | "compliances" | "duty_pnco";
const TABS: Tab[] = ["activities", "accomplishments", "compliances", "duty_pnco"];
const AUTO_CYCLE_INTERVAL = 30_000; // 30 seconds

interface DashboardProps {
  initialData: DashboardData;
}

export default function Dashboard({ initialData }: DashboardProps) {
  const { data, connectionLost, isStale } = useDashboardRefresh(initialData);
  const [activeTab, setActiveTab] = useState<Tab>("activities");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const cycleTimerRef = useRef<ReturnType<typeof setInterval>>(null);

  useWakeLock();
  useGlobalErrorHandler();

  const switchTab = useCallback((tab: Tab) => {
    if (tab === activeTab) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveTab(tab);
      setIsTransitioning(false);
    }, 200);
  }, [activeTab]);

  // Auto-cycle tabs for unattended TV display
  useEffect(() => {
    cycleTimerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab((prev) => {
          const idx = TABS.indexOf(prev);
          return TABS[(idx + 1) % TABS.length];
        });
        setIsTransitioning(false);
      }, 200);
    }, AUTO_CYCLE_INTERVAL);

    return () => {
      if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
    };
  }, []);

  // Reset auto-cycle timer on manual tab change
  const handleTabChange = useCallback((tab: Tab) => {
    if (cycleTimerRef.current) clearInterval(cycleTimerRef.current);
    switchTab(tab);
    cycleTimerRef.current = setInterval(() => {
      setIsTransitioning(true);
      setTimeout(() => {
        setActiveTab((prev) => {
          const idx = TABS.indexOf(prev);
          return TABS[(idx + 1) % TABS.length];
        });
        setIsTransitioning(false);
      }, 200);
    }, AUTO_CYCLE_INTERVAL);
  }, [switchTab]);

  return (
    <div className="relative flex h-screen w-screen flex-col bg-background text-foreground overflow-hidden">
      <Header
        lastUpdated={data.fetched_at}
        connectionLost={connectionLost}
        isStale={isStale}
      />
      <TabNav activeTab={activeTab} onTabChange={handleTabChange} />

      <main
        className={`flex-1 overflow-hidden transition-opacity duration-200 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {activeTab === "activities" && (
          <>
            <KpiCards kpis={data.kpis} tab="activities" />
            <ActivitiesTable activities={data.activities} />
          </>
        )}
        {activeTab === "accomplishments" && (
          <AccomplishmentsGrid accomplishments={data.accomplishments} />
        )}
        {activeTab === "compliances" && (
          <>
            <KpiCards kpis={data.kpis} tab="compliances" />
            <CompliancesTable compliances={data.compliances} />
          </>
        )}
        {activeTab === "duty_pnco" && (
          <DutyPNCOCard roster={data.duty_pnco} />
        )}
      </main>
    </div>
  );
}
