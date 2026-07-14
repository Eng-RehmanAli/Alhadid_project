"use client";

import { useEffect, useRef } from "react";
import { ACCESS_MAX_AGE_SECONDS } from "@/lib/session-constants";

/**
 * Silently refreshes the access token while a refresh cookie is present.
 * Runs on mount and roughly halfway through the access-token lifetime.
 */
export function AuthTokenRefresh() {
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function refresh() {
      try {
        await fetch("/api/auth/refresh", {
          method: "POST",
          credentials: "same-origin",
        });
      } catch {
        // Network errors are non-fatal; next tick / next navigation can retry.
      }
    }

    void refresh();

    const intervalMs = Math.max(
      60_000,
      Math.floor((ACCESS_MAX_AGE_SECONDS * 1000) / 2),
    );
    timerRef.current = setInterval(() => {
      if (!cancelled) void refresh();
    }, intervalMs);

    return () => {
      cancelled = true;
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return null;
}
