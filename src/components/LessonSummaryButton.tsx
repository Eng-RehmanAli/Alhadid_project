"use client";

import { useEffect, useRef, useState } from "react";
import { getLessonSummaryStatusAction } from "@/lib/summary-actions";
import type { SummaryStatus } from "@/models/Lesson";

export function LessonSummaryButton({
  lessonId,
  initialStatus,
  initialGeneratedAt,
}: {
  lessonId: string;
  initialStatus: SummaryStatus;
  initialGeneratedAt?: string | null;
}) {
  const [status, setStatus] = useState<SummaryStatus>(initialStatus);
  const [error, setError] = useState<string>("");
  const [generatedAt, setGeneratedAt] = useState<string | null>(
    initialGeneratedAt ?? null,
  );
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  function stopPolling() {
    if (pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
  }

  useEffect(() => {
    if (status !== "processing") return;

    pollRef.current = setInterval(async () => {
      try {
        const result = await getLessonSummaryStatusAction(lessonId);
        setStatus(result.status);
        if (result.status === "ready") {
          setGeneratedAt(result.generatedAt ?? null);
          setError("");
          stopPolling();
        } else if (result.status === "failed") {
          setError(result.error ?? "Summary generation failed.");
          stopPolling();
        }
      } catch {
        // Keep polling; a transient error should not stop the loop.
      }
    }, 4000);

    return stopPolling;
  }, [status, lessonId]);

  async function generate() {
    setError("");
    setStatus("processing");
    try {
      const response = await fetch(
        `/api/admin/lessons/${lessonId}/summary`,
        { method: "POST" },
      );
      const data = (await response.json().catch(() => ({}))) as {
        status?: SummaryStatus;
        error?: string;
        generatedAt?: string;
      };

      if (!response.ok) {
        setStatus("failed");
        setError(data.error ?? "Summary generation failed.");
        return;
      }

      if (data.status) setStatus(data.status);
      if (data.status === "ready") {
        setGeneratedAt(data.generatedAt ?? null);
      }
    } catch {
      setStatus("failed");
      setError("Could not reach the server. Try again.");
    }
  }

  const processing = status === "processing";

  return (
    <div className="space-y-1">
      <button
        type="button"
        onClick={generate}
        disabled={processing}
        className="rounded-full border border-teal/40 px-3 py-1.5 text-xs font-semibold text-teal-deep hover:bg-teal/10 disabled:opacity-60"
      >
        {processing
          ? "Processing…"
          : status === "ready"
            ? "Regenerate summary"
            : "Generate summary"}
      </button>
      {status === "ready" ? (
        <p className="text-xs text-teal-deep">
          Summary ready
          {generatedAt
            ? ` · ${new Date(generatedAt).toLocaleDateString()}`
            : ""}
        </p>
      ) : null}
      {status === "processing" ? (
        <p className="text-xs text-muted">Transcribing with Gemini…</p>
      ) : null}
      {status === "failed" && error ? (
        <p className="text-xs text-red-700">{error}</p>
      ) : null}
    </div>
  );
}
