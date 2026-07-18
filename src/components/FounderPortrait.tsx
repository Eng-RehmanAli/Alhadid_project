"use client";

import Image from "next/image";
import { MediaReveal } from "@/components/motion/MediaReveal";
import { StatPop } from "@/components/motion/StatPop";
import { TiltCard } from "@/components/motion/TiltCard";
import { founder } from "@/data/founder";

function BubbleCard({
  title,
  subtitle,
  maxTilt = 10,
  className = "",
  delayMs = 0,
  align = "left",
  from = "left",
  floatClass = "founder-float-a",
}: {
  title: string;
  subtitle: string;
  maxTilt?: number;
  className?: string;
  delayMs?: number;
  align?: "left" | "right";
  from?: "left" | "right";
  floatClass?: string;
}) {
  const textAlign = align === "right" ? "text-right" : "text-left";

  return (
    <StatPop
      delayMs={delayMs}
      className={`stat-pop--from-${from} ${className}`}
    >
      <div className={floatClass}>
        <TiltCard
          className="rounded-xl p-2 sm:rounded-2xl sm:p-2.5"
          maxTilt={maxTilt}
        >
          <p
            className={`font-[family-name:var(--font-display)] text-[0.7rem] font-bold leading-tight text-white sm:text-[0.8rem] ${textAlign}`}
          >
            {title}
          </p>
          <p
            className={`mt-0.5 text-[0.5rem] font-semibold uppercase leading-snug tracking-wide text-white/70 sm:text-[0.55rem] ${textAlign}`}
          >
            {subtitle}
          </p>
        </TiltCard>
      </div>
    </StatPop>
  );
}

export function FounderPortrait() {
  const [hod, founderRole, bems, globalCerts] = founder.excellenceBubbles;

  return (
    <div className="relative mx-auto w-full max-w-md perspective-[1200px] lg:max-w-lg">
      <div className="pointer-events-none absolute inset-[6%] hidden rounded-full opacity-35 orbit-ring founder-orbit sm:block" />

      <div className="relative mx-auto aspect-[3/4] w-[72%] max-w-[340px] sm:w-[78%] sm:max-w-[380px]">
        <MediaReveal delayMs={80} className="absolute inset-0">
          <div className="founder-frame h-full w-full">
            <div className="founder-frame__glow relative h-full w-full overflow-hidden rounded-[1.75rem] border border-white/25 sm:rounded-[2.25rem]">
              <Image
                src={founder.heroImage}
                alt={founder.name}
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 72vw, 380px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-teal-dark/40 via-transparent to-transparent" />
            </div>
          </div>
        </MediaReveal>

        <BubbleCard
          title={hod.title}
          subtitle={hod.subtitle}
          delayMs={520}
          from="left"
          floatClass="founder-float-a"
          className="absolute -left-[18%] top-[8%] z-10 w-[38%] sm:-left-[16%] sm:w-[34%]"
        />
        <BubbleCard
          title={founderRole.title}
          subtitle={founderRole.subtitle}
          delayMs={680}
          from="right"
          align="right"
          maxTilt={12}
          floatClass="founder-float-b"
          className="absolute -right-[18%] top-[14%] z-10 w-[38%] sm:-right-[16%] sm:w-[34%]"
        />
        <BubbleCard
          title={bems.title}
          subtitle={bems.subtitle}
          delayMs={840}
          from="left"
          maxTilt={8}
          floatClass="founder-float-c"
          className="absolute -left-[18%] top-[55%] z-10 w-[38%] sm:-left-[16%] sm:w-[34%]"
        />
        <BubbleCard
          title={globalCerts.title}
          subtitle={globalCerts.subtitle}
          delayMs={980}
          from="right"
          align="right"
          maxTilt={12}
          floatClass="founder-float-d"
          className="absolute -right-[18%] top-[60%] z-10 w-[38%] sm:-right-[16%] sm:w-[34%]"
        />
      </div>

      {/* Clear 2×2 credentials — one school per cell, no wrapping soup */}
      <StatPop delayMs={1100} className="mt-6 sm:mt-7">
        <p className="mb-3 text-center text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-lime/85">
          Global certifications
        </p>
        <div className="grid grid-cols-2 gap-2">
          {founder.certDetails.map((cert, i) => (
            <StatPop key={cert.school} delayMs={1180 + i * 80}>
              <div className="rounded-xl border border-white/20 bg-teal-dark/70 px-3 py-2.5 text-center backdrop-blur-sm">
                <p className="text-sm font-bold text-white">{cert.school}</p>
                <p className="mt-0.5 text-[0.6rem] font-medium leading-snug text-white/65">
                  {cert.focus}
                </p>
              </div>
            </StatPop>
          ))}
        </div>
      </StatPop>
    </div>
  );
}
