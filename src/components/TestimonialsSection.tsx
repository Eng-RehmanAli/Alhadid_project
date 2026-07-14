import { IntroRise } from "@/components/motion/IntroRise";
import { MaskLine } from "@/components/motion/MaskLine";
import { Reveal } from "@/components/motion/Reveal";
import { Light3DBackground } from "@/components/Light3DBackground";
import {
  testimonials,
  testimonialsSection,
} from "@/data/engagement";

export function TestimonialsSection() {
  return (
    <section className="section-bleed-light light-3d-scene relative py-20 md:py-28">
      <Light3DBackground />
      <div className="relative z-[1] mx-auto max-w-6xl px-5 md:px-8">
        <IntroRise>
          <p className="text-sm font-semibold text-teal-deep">
            {testimonialsSection.eyebrow}
          </p>
        </IntroRise>
        <h2 className="mt-3 max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight md:text-4xl">
          <MaskLine>{testimonialsSection.title}</MaskLine>
        </h2>
        <IntroRise delayMs={120}>
          <p className="mt-4 max-w-xl text-[15px] leading-relaxed text-muted">
            {testimonialsSection.subheading}
          </p>
        </IntroRise>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {testimonials.map((item, i) => (
            <Reveal key={item.name} delayMs={i * 90} variant="scale">
              <blockquote className="hover-lift flex h-full flex-col rounded-3xl border border-line-dark bg-white/90 p-6 shadow-[0_12px_36px_rgba(14,106,111,0.06)] backdrop-blur-[2px]">
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-teal-deep">
                  {item.faculty}
                </p>
                <p className="mt-4 flex-1 text-[15px] leading-relaxed text-ink">
                  “{item.quote}”
                </p>
                <footer className="mt-6 border-t border-line-dark pt-4">
                  <p className="font-semibold text-ink">{item.name}</p>
                  <p className="mt-0.5 text-sm text-muted">
                    {item.role} · {item.outcome}
                  </p>
                </footer>
              </blockquote>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
