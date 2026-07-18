"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { StudentPerformanceCard } from "@/components/StudentPerformanceCard";

export type StudentDashboardStats = {
  totalCourses: number;
  completedCourses: number;
  hoursLearned: number;
  certificatesEarned: number;
  overallPercent: number;
  continueHref: string;
};

type StatCard = {
  label: string;
  value: string;
  trend: string;
  trendUp: boolean;
  icon: "courses" | "check" | "clock" | "award";
};

type ActivityItem = {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: "teal" | "lime" | "deep" | "muted";
};

const SAMPLE_ACTIVITY: ActivityItem[] = [
  {
    id: "1",
    title: "Completed lesson",
    detail: "Foundations of Fiqh · Lesson 4",
    time: "2 hours ago",
    tone: "teal",
  },
  {
    id: "2",
    title: "Enrolled in course",
    detail: "Arabic Grammar Intensive",
    time: "Yesterday",
    tone: "deep",
  },
  {
    id: "3",
    title: "Quiz passed",
    detail: "Hadith Methodology · Score 92%",
    time: "3 days ago",
    tone: "lime",
  },
  {
    id: "4",
    title: "Certificate earned",
    detail: "Introduction to Usul al-Fiqh",
    time: "1 week ago",
    tone: "teal",
  },
];

function StatIcon({ type }: { type: StatCard["icon"] }) {
  const common = "size-5";
  if (type === "courses") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "check") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M8.5 12.5 11 15l4.5-5"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  if (type === "clock") {
    return (
      <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.75" />
        <path
          d="M12 7v5l3 2"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
  return (
    <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 3l2.2 4.45L19 8.2l-3.5 3.4.83 4.85L12 14.3 7.67 16.45 8.5 11.6 5 8.2l4.8-.75L12 3z"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function CompletionRing({ percent }: { percent: number }) {
  const [shown, setShown] = useState(0);
  const size = 168;
  const stroke = 12;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));
  const offset = circumference - (shown / 100) * circumference;

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      setShown(clamped);
      return;
    }
    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / 1000);
      const eased = 1 - Math.pow(1 - t, 3);
      setShown(Math.round(clamped * eased));
      if (t < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [clamped]);

  return (
    <div className="rounded-2xl border border-line-dark bg-white p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
        Course Completion
      </p>
      <h3 className="mt-1 font-display text-xl font-semibold text-heading">
        Overall Progress
      </h3>

      <div className="mt-6 flex flex-col items-center">
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
              stroke="var(--teal)"
              strokeWidth={stroke}
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              className="transition-[stroke-dashoffset] duration-300"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="font-display text-4xl font-semibold tabular-nums text-heading">
              {shown}%
            </span>
            <span className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-muted">
              Complete
            </span>
          </div>
        </div>
        <p className="mt-4 max-w-xs text-center text-sm text-muted">
          Across all enrolled programs. Keep going to unlock certificates.
        </p>
      </div>
    </div>
  );
}

function toneDot(tone: ActivityItem["tone"]) {
  if (tone === "lime") return "bg-lime";
  if (tone === "deep") return "bg-teal-deep";
  if (tone === "muted") return "bg-muted";
  return "bg-teal";
}

export function StudentDashboardOverview({
  stats,
}: {
  stats: StudentDashboardStats;
}) {
  const cards: StatCard[] = [
    {
      label: "Total Courses",
      value: String(stats.totalCourses),
      trend: "+12%",
      trendUp: true,
      icon: "courses",
    },
    {
      label: "Completed Courses",
      value: String(stats.completedCourses),
      trend: "+8%",
      trendUp: true,
      icon: "check",
    },
    {
      label: "Hours Learned",
      value: String(stats.hoursLearned),
      trend: "+15%",
      trendUp: true,
      icon: "clock",
    },
    {
      label: "Certificates Earned",
      value: String(stats.certificatesEarned),
      trend: "+5%",
      trendUp: true,
      icon: "award",
    },
  ];

  const actions = [
    { href: stats.continueHref, label: "Continue Learning", primary: true },
    { href: "/courses", label: "Browse Courses", primary: false },
    { href: "/account", label: "View Certificates", primary: false },
    { href: "/account", label: "Edit Profile", primary: false },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.label}
            className="rounded-2xl border border-line-dark bg-white p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <span className="inline-flex size-10 items-center justify-center rounded-xl bg-mist text-teal-deep">
                <StatIcon type={card.icon} />
              </span>
              <span
                className={`text-xs font-semibold tabular-nums ${
                  card.trendUp ? "text-teal-deep" : "text-red-500"
                }`}
              >
                {card.trend}
              </span>
            </div>
            <p className="mt-4 font-display text-3xl font-semibold tabular-nums text-heading">
              {card.value}
            </p>
            <p className="mt-1 text-sm text-muted">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <StudentPerformanceCard />
        <CompletionRing percent={stats.overallPercent} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-line-dark bg-white p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Recent Activity
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-heading">
            Latest actions
          </h3>
          <ul className="mt-5 divide-y divide-line-dark">
            {SAMPLE_ACTIVITY.map((item) => (
              <li key={item.id} className="flex gap-3 py-3.5 first:pt-0 last:pb-0">
                <span
                  className={`mt-1.5 size-2.5 shrink-0 rounded-full ${toneDot(item.tone)}`}
                  aria-hidden
                />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 truncate text-sm text-muted">
                    {item.detail}
                  </p>
                </div>
                <p className="shrink-0 text-xs text-muted">{item.time}</p>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-2xl border border-line-dark bg-white p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
            Quick Actions
          </p>
          <h3 className="mt-1 font-display text-xl font-semibold text-heading">
            Jump back in
          </h3>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={`inline-flex min-h-11 items-center justify-center rounded-full px-5 py-2.5 text-center text-sm font-semibold transition-colors ${
                  action.primary
                    ? "bg-teal text-white hover:bg-teal-deep"
                    : "border border-line-dark bg-mist text-ink hover:bg-white"
                }`}
              >
                {action.label}
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
