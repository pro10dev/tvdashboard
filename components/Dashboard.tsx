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
import QuickView from "./QuickView";
import ICTInventoryView from "./ICTInventoryView";

type Tab = "quick_view" | "ict_inventory" | "activities" | "accomplishments" | "compliances" | "duty_pnco";
const TABS: Tab[] = ["quick_view", "ict_inventory", "activities", "accomplishments", "compliances", "duty_pnco"];
interface DashboardProps {
  initialData: DashboardData;
  tabRotateMinutes?: number;
  refreshMinutes?: number;
  dutyShiftTime?: string;
}

export default function Dashboard({ initialData, tabRotateMinutes = 0.5, refreshMinutes = 5, dutyShiftTime = "08:00" }: DashboardProps) {
  const AUTO_CYCLE_INTERVAL = tabRotateMinutes * 60 * 1000;
  const { data, connectionLost, isStale } = useDashboardRefresh(initialData, refreshMinutes);
  const [activeTab, setActiveTab] = useState<Tab>("quick_view");
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
  }, [AUTO_CYCLE_INTERVAL]);

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
  }, [switchTab, AUTO_CYCLE_INTERVAL]);

  return (
    <div className="relative flex h-screen w-screen flex-col bg-background text-foreground overflow-hidden">
      <Header
        lastUpdated={data.fetched_at}
        connectionLost={connectionLost}
        isStale={isStale}
      />
      <TabNav activeTab={activeTab} onTabChange={handleTabChange} />

      <main
        className={`flex-1 overflow-auto transition-opacity duration-200 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        }`}
      >
        {activeTab === "quick_view" && (
          <QuickView data={data} />
        )}
        {activeTab === "ict_inventory" && (
          <ICTInventoryView itInventory={data.it_inventory} ctInventory={data.ct_inventory} />
        )}
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
          <DutyPNCOCard roster={data.duty_pnco} shiftTime={dutyShiftTime} />
        )}
      </main>
    </div>
  );
}
