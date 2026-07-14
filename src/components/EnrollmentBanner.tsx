"use client";

import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/Button";
import { IntroRise } from "@/components/motion/IntroRise";
import { MaskLine } from "@/components/motion/MaskLine";
import { enrollment, getNextEnrollmentOpen } from "@/data/engagement";
import { track } from "@/lib/analytics";
import { whatsappGeneralUrl } from "@/lib/whatsapp";

type Parts = { days: number; hours: number; minutes: number; seconds: number };

function splitTime(ms: number): Parts {
  const total = Math.max(0, Math.floor(ms / 1000));
  return {
    days: Math.floor(total / 86400),
    hours: Math.floor((total % 86400) / 3600),
    minutes: Math.floor((total % 3600) / 60),
    seconds: total % 60,
  };
}

function pad(n: number) {
  return String(n).padStart(2, "0");
}

export function EnrollmentBanner() {
  const target = useMemo(() => getNextEnrollmentOpen(), []);
  const [parts, setParts] = useState<Parts>(() =>
    splitTime(target.getTime() - Date.now()),
  );
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const tick = () => setParts(splitTime(target.getTime() - Date.now()));
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [target]);

  const remindHref = whatsappGeneralUrl(enrollment.notifyMessage);
  const openLabel = target.toLocaleDateString("en-PK", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });

  return (
    <section className="section-bleed-light relative overflow-hidden bg-mist py-10 md:py-12">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_20%_0%,rgba(31,148,153,0.12),transparent_55%)]" />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-6 px-5 md:flex-row md:items-center md:justify-between md:px-8">
        <div className="min-w-0">
          <IntroRise>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-teal-deep">
              Next enrollment window
            </p>
          </IntroRise>
          <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight md:text-3xl">
            <MaskLine>Seats open {mounted ? openLabel : "soon"}</MaskLine>
          </h2>
          <p className="mt-2 max-w-md text-sm text-muted">
            {enrollment.cadenceLabel}. {enrollment.seatsNote}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 md:gap-6">
          <div
            className="flex gap-2 sm:gap-3"
            aria-live="polite"
            aria-label="Countdown to next enrollment"
          >
            {(
              [
                ["Days", parts.days],
                ["Hrs", parts.hours],
                ["Min", parts.minutes],
                ["Sec", parts.seconds],
              ] as const
            ).map(([label, value]) => (
              <div
                key={label}
                className="min-w-[3.25rem] rounded-2xl border border-line-dark bg-white/90 px-2.5 py-2 text-center shadow-[0_10px_24px_rgba(14,106,111,0.08)] sm:min-w-[3.75rem]"
              >
                <p className="font-[family-name:var(--font-display)] text-xl font-bold tabular-nums text-ink sm:text-2xl">
                  {mounted ? pad(value) : "––"}
                </p>
                <p className="mt-0.5 text-[0.65rem] font-semibold uppercase tracking-wider text-muted">
                  {label}
                </p>
              </div>
            ))}
          </div>

          <Button
            href={remindHref}
            variant="onLight"
            external
            onClick={() =>
              track("enrollment_remind_click", { location: "home_banner" })
            }
          >
            {enrollment.remindCta}
          </Button>
        </div>
      </div>
    </section>
  );
}
