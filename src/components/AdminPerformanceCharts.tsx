"use client";

import { useEffect, useState } from "react";

type CourseBar = {
  title: string;
  active: number;
  completed: number;
  revoked: number;
  total: number;
};

type RingProps = {
  value: number;
  label: string;
  hint: string;
  accent?: "teal" | "lime" | "deep";
};

function clampPercent(n: number) {
  if (!Number.isFinite(n) || n < 0) return 0;
  if (n > 100) return 100;
  return Math.round(n);
}

function ProgressRing({ value, label, hint, accent = "teal" }: RingProps) {
  const [shown, setShown] = useState(0);
  const size = 132;
  const stroke = 10;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (shown / 100) * circumference;

  const strokeColor =
    accent === "lime"
      ? "var(--lime)"
      : accent === "deep"
        ? "var(--teal-deep)"
        : "var(--teal)";

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(value);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 900);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(value * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value]);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--mist)"
            strokeWidth={stroke}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={strokeColor}
            strokeWidth={stroke}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-[stroke-dashoffset] duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-2xl font-semibold text-heading">
            {shown}%
          </span>
        </div>
      </div>
      <p className="mt-3 text-sm font-semibold text-ink">{label}</p>
      <p className="mt-0.5 text-xs text-muted">{hint}</p>
    </div>
  );
}

function StatusDonut({
  active,
  completed,
  revoked,
}: {
  active: number;
  completed: number;
  revoked: number;
}) {
  const total = active + completed + revoked;
  const size = 168;
  const stroke = 18;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;

  const segments = [
    { key: "active", value: active, color: "var(--teal)" },
    { key: "completed", value: completed, color: "var(--lime)" },
    { key: "revoked", value: revoked, color: "#f87171" },
  ].filter((s) => s.value > 0);

  let cursor = 0;

  return (
    <div className="flex flex-col items-center gap-5 sm:flex-row sm:items-center sm:gap-8">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90" aria-hidden>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="var(--mist)"
            strokeWidth={stroke}
          />
          {total === 0 ? null : (
            segments.map((seg) => {
              const length = (seg.value / total) * circumference;
              const dashoffset = -cursor;
              cursor += length;
              return (
                <circle
                  key={seg.key}
                  cx={size / 2}
                  cy={size / 2}
                  r={radius}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={stroke}
                  strokeDasharray={`${length} ${circumference - length}`}
                  strokeDashoffset={dashoffset}
                  strokeLinecap="butt"
                />
              );
            })
          )}
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-display text-3xl font-semibold text-heading">
            {total}
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
            Enrollments
          </span>
        </div>
      </div>
      <ul className="space-y-2.5 text-sm">
        <li className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-full bg-teal" />
          <span className="text-muted">Active</span>
          <span className="ml-auto font-semibold text-ink tabular-nums">
            {active}
          </span>
        </li>
        <li className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-full bg-lime" />
          <span className="text-muted">Completed</span>
          <span className="ml-auto font-semibold text-ink tabular-nums">
            {completed}
          </span>
        </li>
        <li className="flex items-center gap-2.5">
          <span className="size-2.5 rounded-full bg-red-400" />
          <span className="text-muted">Revoked</span>
          <span className="ml-auto font-semibold text-ink tabular-nums">
            {revoked}
          </span>
        </li>
      </ul>
    </div>
  );
}

function CourseBars({ courses }: { courses: CourseBar[] }) {
  const max = Math.max(...courses.map((c) => c.total), 1);

  return (
    <div className="space-y-4">
      {courses.map((course) => {
        const activePct = (course.active / max) * 100;
        const completedPct = (course.completed / max) * 100;
        const revokedPct = (course.revoked / max) * 100;
        return (
          <div key={course.title}>
            <div className="mb-1.5 flex items-baseline justify-between gap-3">
              <p className="truncate text-sm font-medium text-ink">
                {course.title}
              </p>
              <p className="shrink-0 text-xs font-semibold tabular-nums text-muted">
                {course.total}
              </p>
            </div>
            <div className="flex h-3 overflow-hidden rounded-full bg-mist">
              <span
                className="h-full bg-teal transition-all duration-700"
                style={{ width: `${activePct}%` }}
                title={`Active ${course.active}`}
              />
              <span
                className="h-full bg-lime transition-all duration-700"
                style={{ width: `${completedPct}%` }}
                title={`Completed ${course.completed}`}
              />
              <span
                className="h-full bg-red-400 transition-all duration-700"
                style={{ width: `${revokedPct}%` }}
                title={`Revoked ${course.revoked}`}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function AdminPerformanceCharts({
  students,
  activeEnrollments,
  courseCounts,
  avgProgress,
}: {
  students: number;
  activeEnrollments: number;
  courseCounts: CourseBar[];
  avgProgress: number;
}) {
  const totals = courseCounts.reduce(
    (acc, row) => {
      acc.active += row.active;
      acc.completed += row.completed;
      acc.revoked += row.revoked;
      acc.total += row.total;
      return acc;
    },
    { active: 0, completed: 0, revoked: 0, total: 0 },
  );

  const completionRate = clampPercent(
    totals.total === 0 ? 0 : (totals.completed / totals.total) * 100,
  );
  const activeRate = clampPercent(
    totals.total === 0 ? 0 : (totals.active / totals.total) * 100,
  );
  const studentEngagement = clampPercent(
    students === 0 ? 0 : (activeEnrollments / students) * 100,
  );
  const progressRate = clampPercent(avgProgress);

  const topCourses = [...courseCounts]
    .sort((a, b) => b.total - a.total)
    .slice(0, 6);

  return (
    <div className="mt-8 space-y-6">
      <div>
        <h3 className="font-display text-xl font-semibold text-heading">
          Performance
        </h3>
        <p className="mt-1 text-sm text-muted">
          Live circles and charts from your enrollments and course progress.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-line-dark bg-white p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Key rates
          </p>
          <div className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
            <ProgressRing
              value={completionRate}
              label="Completion"
              hint="Finished enrollments"
              accent="lime"
            />
            <ProgressRing
              value={activeRate}
              label="Active"
              hint="Still in progress"
              accent="teal"
            />
            <ProgressRing
              value={studentEngagement}
              label="Engagement"
              hint="Students with active course"
              accent="deep"
            />
            <ProgressRing
              value={progressRate}
              label="Avg progress"
              hint="Open enrollments"
              accent="teal"
            />
          </div>
        </div>

        <div className="rounded-2xl border border-line-dark bg-white p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Enrollment mix
          </p>
          <div className="mt-6 flex justify-center sm:justify-start">
            <StatusDonut
              active={totals.active}
              completed={totals.completed}
              revoked={totals.revoked}
            />
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-line-dark bg-white p-5 sm:p-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
              Course performance
            </p>
            <p className="mt-1 text-sm text-muted">
              Stacked bars: active, completed, revoked
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-muted">
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-teal" /> Active
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-lime" /> Completed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-red-400" /> Revoked
            </span>
          </div>
        </div>
        <div className="mt-5">
          {topCourses.length === 0 ? (
            <p className="text-sm text-muted">No course data yet.</p>
          ) : (
            <CourseBars courses={topCourses} />
          )}
        </div>
      </div>
    </div>
  );
}
