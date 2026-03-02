"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import type { DashboardData } from "@/lib/types";

const REFRESH_INTERVAL = 300_000; // 5 minutes
const STALE_THRESHOLD = 600_000; // 10 minutes

interface RefreshState {
  data: DashboardData;
  connectionLost: boolean;
  isStale: boolean;
}

export function useDashboardRefresh(initialData: DashboardData): RefreshState {
  const [data, setData] = useState<DashboardData>(initialData);
  const [connectionLost, setConnectionLost] = useState(false);
  const [isStale, setIsStale] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const newData: DashboardData = await res.json();
      setData(newData);
      setConnectionLost(false);
      setIsStale(false);
    } catch {
      setConnectionLost(true);
    }
  }, []);

  const startInterval = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(fetchData, REFRESH_INTERVAL);
  }, [fetchData]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Auto-refresh interval
  useEffect(() => {
    startInterval();
    return stopInterval;
  }, [startInterval, stopInterval]);

  // Page Visibility API
  useEffect(() => {
    function handleVisibility() {
      if (document.hidden) {
        stopInterval();
      } else {
        fetchData();
        startInterval();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [fetchData, startInterval, stopInterval]);

  // Stale data check
  useEffect(() => {
    const id = setInterval(() => {
      const age = Date.now() - new Date(data.fetched_at).getTime();
      setIsStale(age > STALE_THRESHOLD);
    }, 30_000);
    return () => clearInterval(id);
  }, [data.fetched_at]);

  return { data, connectionLost, isStale };
}
