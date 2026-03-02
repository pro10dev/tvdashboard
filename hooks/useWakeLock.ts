"use client";

import { useEffect, useRef } from "react";

export function useWakeLock() {
  const wakeLockRef = useRef<WakeLockSentinel | null>(null);

  useEffect(() => {
    async function requestLock() {
      try {
        if ("wakeLock" in navigator) {
          wakeLockRef.current = await navigator.wakeLock.request("screen");
        }
      } catch {
        // Wake Lock not supported or denied — fail silently
      }
    }

    function handleVisibility() {
      if (!document.hidden) {
        requestLock();
      }
    }

    requestLock();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      wakeLockRef.current?.release();
    };
  }, []);
}
