import type { Metadata } from "next";
import Image from "next/image";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { founder } from "@/data/founder";

export const metadata: Metadata = {
  title: "Founder",
  description: founder.summary,
};

export default function FounderPage() {
  return (
    <>
      <PageHero
        eyebrow={founder.role}
        title={founder.name}
        description={founder.summary}
        image={founder.heroImage}
      >
        <div className="flex flex-wrap gap-3">
          <Button href={founder.whatsapp} external>
            WhatsApp
          </Button>
          <Button href={founder.contactEmail} variant="secondary">
            Email
          </Button>
        </div>
      </PageHero>

      <section className="bg-mist py-16 text-ink md:py-24">
        <div className="mx-auto max-w-6xl px-5 md:px-8">
          <div className="grid gap-12 lg:grid-cols-[1.2fr_0.8fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-muted">
                Biography
              </p>
              <div className="mt-6 space-y-5 text-base leading-relaxed text-muted">
                {founder.biography.map((para) => (
                  <p key={para}>{para}</p>
                ))}
              </div>

              <p className="mt-10 text-base leading-relaxed text-muted">
                {founder.certificationsLead}
              </p>
              <ul className="mt-6 space-y-3">
                {founder.certifications.map((item) => (
                  <li
                    key={item.institution}
                    className="border-t border-line-dark pt-3"
                  >
                    <p className="font-semibold text-ink">{item.institution}</p>
                    <p className="text-sm text-muted">{item.focus}</p>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm leading-relaxed text-muted">
                {founder.certificationsClose}
              </p>
            </div>

            <div>
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2rem] border border-line-dark">
                <Image
                  src={founder.heroImage}
                  alt={founder.name}
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 400px"
                />
              </div>
              <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                {founder.credentials.map((item) => (
                  <div key={item.label} className="border border-line-dark p-4">
                    <p className="font-[family-name:var(--font-display)] text-xl font-semibold sm:text-2xl">
                      {item.value}
                    </p>
                    <p className="mt-1 break-words text-xs uppercase tracking-[0.16em] text-muted">
                      {item.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-20">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-semibold">
              Vision pillars
            </h2>
            <p className="mt-4 max-w-2xl text-muted">{founder.pillarsIntro}</p>
            <div className="mt-10 grid gap-4 md:grid-cols-2">
              {founder.pillars.map((pillar) => (
                <div key={pillar.title} className="border border-line-dark p-6">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted">
                    {pillar.number}
                  </p>
                  <h3 className="mt-3 text-xl font-semibold">{pillar.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {pillar.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16">
            <h2 className="text-xl font-semibold">Academies</h2>
            <ul className="mt-4 space-y-3">
              {founder.academies.map((item) => (
                <li key={item.title} className="border-t border-line-dark pt-3">
                  <p className="font-semibold">{item.title}</p>
                  <p className="text-sm text-muted">{item.detail}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
}
