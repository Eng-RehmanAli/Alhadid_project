import type { Metadata } from "next";
import { Button } from "@/components/Button";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/motion/Reveal";
import { founder } from "@/data/founder";
import { site } from "@/data/site";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with Al Hadid. Reach us by email, phone, or visit Al Hadid Centre in Sahiwal, Pakistan.",
};

const { contact } = site;

const detailItems = [
  {
    label: "Email",
    href: contact.emailHref,
    value: contact.email,
  },
  {
    label: "Phone",
    href: contact.phoneHref,
    value: contact.phoneDisplay,
  },
  {
    label: "WhatsApp",
    href: founder.whatsapp,
    value: contact.phoneDisplay,
  },
] as const;

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow={site.networkTagline}
        title="Get in touch"
        description={contact.intro}
        compact
      >
        <div className="flex flex-wrap gap-2.5">
          <Button href={founder.whatsapp} external>
            WhatsApp
          </Button>
          <Button href={contact.emailHref} variant="secondary">
            Email us
          </Button>
        </div>
      </PageHero>

      <section className="relative overflow-hidden border-t border-white/10 bg-teal-dark py-8 text-white md:py-10">
        <div className="pointer-events-none absolute -left-24 top-6 h-48 w-48 rounded-full bg-teal/25 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-lime/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-5xl gap-6 px-5 lg:grid-cols-[0.95fr_1.05fr] lg:gap-8 md:px-8">
          <Reveal>
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-lime">
                Reach us
              </p>
              <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-white md:text-2xl">
                Details
              </h2>
              <p className="mt-2 max-w-sm text-xs leading-relaxed text-white/65">
                Prefer a direct line? We usually reply within one business day.
              </p>

              <ul className="mt-4 divide-y divide-white/10 border-y border-white/10">
                {detailItems.map((item) => (
                  <li key={item.label}>
                    <a
                      href={item.href}
                      {...(item.href.startsWith("http")
                        ? { target: "_blank", rel: "noopener noreferrer" }
                        : {})}
                      className="group flex items-center justify-between gap-3 py-2.5 transition-colors duration-300 hover:bg-white/5"
                    >
                      <div className="min-w-0">
                        <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/45">
                          {item.label}
                        </p>
                        <p className="mt-0.5 truncate text-sm font-semibold text-white transition-colors duration-300 group-hover:text-lime">
                          {item.value}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-white/20 text-lime transition-all duration-300 group-hover:border-lime group-hover:bg-lime group-hover:text-ink"
                      >
                        <svg
                          viewBox="0 0 24 24"
                          className="h-3.5 w-3.5"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M5 12h14" />
                          <path d="M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </a>
                  </li>
                ))}
              </ul>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Address
                  </p>
                  <div className="mt-1.5 space-y-0.5 text-sm font-semibold text-white">
                    {contact.addressLines.map((line) => (
                      <p key={line}>{line}</p>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-white/45">
                    Hours
                  </p>
                  <ul className="mt-1.5 space-y-1 text-xs text-white/70">
                    {contact.hours.map((row) => (
                      <li
                        key={row.days}
                        className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-0.5"
                      >
                        <span>{row.days}</span>
                        <span className="font-semibold text-white">{row.time}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delayMs={80}>
            <div className="relative overflow-hidden rounded-2xl border border-white/15 bg-white/5 p-4 backdrop-blur-sm sm:p-5 md:p-6">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-lime to-transparent" />
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-lime">
                Inquiry
              </p>
              <h2 className="mt-1.5 font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight text-white md:text-2xl">
                Send a message
              </h2>
              <p className="mt-1.5 max-w-md text-xs leading-relaxed text-white/65">
                Courses, enrollment, or a conversation about the institute.
              </p>
              <div className="mt-4">
                <ContactForm emailHref={contact.emailHref} />
              </div>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
