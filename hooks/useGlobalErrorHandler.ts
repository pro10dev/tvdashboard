"use client";

import { useEffect } from "react";

export function useGlobalErrorHandler() {
  useEffect(() => {
    function handleError(event: ErrorEvent) {
      console.error("[Dashboard Error]", event.message);
      event.preventDefault();
    }

    function handleRejection(event: PromiseRejectionEvent) {
      console.error("[Dashboard Unhandled Rejection]", event.reason);
      event.preventDefault();
    }

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, []);
}
