"use client";

import { useId, useMemo, useState, useTransition } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

type Period = "day" | "month" | "year";

const SAMPLE: Record<Period, { label: string; score: number }[]> = {
  day: [
    { label: "Mon", score: 42 },
    { label: "Tue", score: 58 },
    { label: "Wed", score: 51 },
    { label: "Thu", score: 67 },
    { label: "Fri", score: 74 },
    { label: "Sat", score: 62 },
    { label: "Sun", score: 81 },
  ],
  month: [
    { label: "Week 1", score: 48 },
    { label: "Week 2", score: 55 },
    { label: "Week 3", score: 61 },
    { label: "Week 4", score: 72 },
  ],
  year: [
    { label: "Jan", score: 38 },
    { label: "Feb", score: 44 },
    { label: "Mar", score: 52 },
    { label: "Apr", score: 49 },
    { label: "May", score: 58 },
    { label: "Jun", score: 64 },
    { label: "Jul", score: 71 },
    { label: "Aug", score: 68 },
    { label: "Sep", score: 75 },
    { label: "Oct", score: 79 },
    { label: "Nov", score: 82 },
    { label: "Dec", score: 88 },
  ],
};

const PERIODS: { id: Period; label: string }[] = [
  { id: "day", label: "Day" },
  { id: "month", label: "Month" },
  { id: "year", label: "Year" },
];

const PERIOD_TITLE: Record<Period, string> = {
  day: "Daily Performance",
  month: "Monthly Performance",
  year: "Yearly Performance",
};

type TooltipPayload = {
  value?: number | string;
  name?: string;
};

function ChartTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  const value = payload[0]?.value;
  return (
    <div className="rounded-lg border border-line-dark bg-white px-3 py-2 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">
        {label}
      </p>
      <p className="mt-1 font-display text-lg font-semibold text-heading tabular-nums">
        {value}
        <span className="ml-1 text-xs font-medium text-muted">score</span>
      </p>
    </div>
  );
}

export function StudentPerformanceCard() {
  const [period, setPeriod] = useState<Period>("day");
  const [isPending, startTransition] = useTransition();
  const gradientId = useId().replace(/:/g, "");

  const data = useMemo(() => SAMPLE[period], [period]);
  const avg = Math.round(
    data.reduce((sum, row) => sum + row.score, 0) / data.length,
  );

  function selectPeriod(next: Period) {
    if (next === period) return;
    startTransition(() => setPeriod(next));
  }

  return (
    <div className="rounded-2xl border border-line-dark bg-white p-5 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Performance
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-heading">
            {PERIOD_TITLE[period]}
          </h3>
          <p className="mt-1 text-sm text-muted">
            Avg score{" "}
            <span className="font-semibold tabular-nums text-ink">{avg}</span>
          </p>
        </div>

        <div
          className="inline-flex rounded-full border border-line-dark bg-mist p-1"
          role="group"
          aria-label="Performance period"
        >
          {PERIODS.map((item) => {
            const active = item.id === period;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => selectPeriod(item.id)}
                aria-pressed={active}
                className={`min-h-9 rounded-full px-3.5 text-sm font-semibold transition-colors duration-300 ${
                  active
                    ? "bg-teal text-white shadow-sm"
                    : "text-muted hover:text-ink"
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      </div>

      <div
        className={`mt-6 h-64 w-full transition-opacity duration-300 sm:h-72 ${
          isPending ? "opacity-60" : "opacity-100"
        }`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart
            key={period}
            data={data}
            margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--teal)" stopOpacity={0.28} />
                <stop offset="100%" stopColor="var(--teal)" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke="var(--line-dark)"
              strokeDasharray="4 6"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              tickLine={false}
              axisLine={{ stroke: "var(--line-dark)" }}
              dy={8}
            />
            <YAxis
              domain={[0, 100]}
              tick={{ fill: "var(--muted)", fontSize: 12 }}
              tickLine={false}
              axisLine={false}
              width={36}
            />
            <Tooltip
              content={<ChartTooltip />}
              cursor={{
                stroke: "var(--teal)",
                strokeWidth: 1,
                strokeDasharray: "4 4",
              }}
            />
            <Area
              type="monotone"
              dataKey="score"
              fill={`url(#${gradientId})`}
              stroke="none"
              isAnimationActive
              animationDuration={650}
              animationEasing="ease-out"
            />
            <Line
              type="monotone"
              dataKey="score"
              name="Performance"
              stroke="var(--teal)"
              strokeWidth={2.5}
              dot={{
                r: 4,
                fill: "var(--lime)",
                stroke: "var(--teal)",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "var(--teal)",
                stroke: "var(--lime)",
                strokeWidth: 2,
              }}
              isAnimationActive
              animationDuration={650}
              animationEasing="ease-out"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
