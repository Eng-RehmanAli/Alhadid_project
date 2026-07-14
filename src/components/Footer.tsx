"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/Button";
import { site } from "@/data/site";
import { founder } from "@/data/founder";

const links = [
  { href: "/courses", label: "Courses" },
  { href: "/faculties", label: "Faculties" },
  { href: "/about", label: "About" },
  { href: "/founder", label: "Founder" },
  { href: "/books", label: "Books" },
  { href: "/articles", label: "Articles" },
  { href: "/contact", label: "Contact" },
];

const socialIcons: Record<string, ReactNode> = {
  Instagram: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  Facebook: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  ),
  YouTube: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M23.498 6.186a2.995 2.995 0 00-2.109-2.12C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.389.52A2.995 2.995 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a2.995 2.995 0 002.109 2.12c1.884.52 9.389.52 9.389.52s7.505 0 9.389-.52a2.995 2.995 0 002.109-2.12C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
  LinkedIn: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" />
    </svg>
  ),
  WhatsApp: (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="h-4 w-4">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.372-.01-.571-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  ),
};

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" className="h-4 w-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7.5l8.25 5.25L19.5 7.5M4.5 6h15a1.5 1.5 0 011.5 1.5v9a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 16.5v-9A1.5 1.5 0 014.5 6z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" className="h-4 w-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h1.5a1.5 1.5 0 001.5-1.5v-2.1a1.5 1.5 0 00-1.15-1.46l-2.85-.71a1.5 1.5 0 00-1.48.55l-.68.85a.75.75 0 01-.9.22 12.04 12.04 0 01-5.5-5.5.75.75 0 01.22-.9l.85-.68a1.5 1.5 0 00.55-1.48l-.71-2.85a1.5 1.5 0 00-1.46-1.15H3.75a1.5 1.5 0 00-1.5 1.5v1.5z" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden="true" className="h-4 w-4 shrink-0">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function ChevronIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" className="h-3.5 w-3.5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
    </svg>
  );
}

function FooterColumnHeading({ children }: { children: ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
        {children}
      </p>
      <span
        aria-hidden
        className="mt-3 block h-px w-8 bg-gradient-to-r from-lime to-lime/0"
      />
    </div>
  );
}

function FooterNavLink({
  href,
  label,
  index,
}: {
  href: string;
  label: string;
  index: number;
}) {
  return (
    <Link
      href={href}
      className="group relative flex items-center gap-2.5 overflow-hidden rounded-lg border border-transparent px-2.5 py-2.5 text-sm text-white/72 transition-all duration-200 hover:border-white/10 hover:bg-white/[0.06] hover:pl-3 hover:text-white"
    >
      <span
        aria-hidden
        className="absolute inset-y-0 left-0 w-0.5 origin-top scale-y-0 bg-lime transition-transform duration-200 group-hover:scale-y-100"
      />
      <span className="w-4 shrink-0 font-mono text-[10px] tabular-nums tracking-wider text-lime/45 transition-colors group-hover:text-lime">
        {String(index + 1).padStart(2, "0")}
      </span>
      <span className="min-w-0 flex-1 leading-snug">{label}</span>
      <span className="translate-x-1 text-lime/0 transition-all duration-200 group-hover:translate-x-0 group-hover:text-lime">
        <ChevronIcon />
      </span>
    </Link>
  );
}

export function Footer() {
  const pathname = usePathname();
  const hideCta =
    pathname.startsWith("/login") ||
    pathname.startsWith("/signup") ||
    pathname.startsWith("/courses");

  return (
    <footer className="mt-auto text-white">
      {/* Compact CTA band — hidden on auth pages */}
      {!hideCta ? (
        <div className="border-t border-white/10 bg-teal-deep">
          <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-6 px-5 py-10 md:flex-row md:items-center md:px-8 md:py-12">
            <div className="max-w-xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-lime">
                Start today
              </p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight text-white md:text-3xl">
                {site.ctaTitle.split("transformation")[0]}
                <span className="text-lime">transformation</span>
              </h2>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                Explore programs and begin your journey with Al Hadid.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button href="/courses">Explore courses</Button>
            </div>
          </div>
        </div>
      ) : null}

      {/* Main footer */}
      <div className="border-t border-white/10 bg-teal-dark">
        <div className="mx-auto grid max-w-6xl gap-12 px-5 py-14 sm:grid-cols-2 lg:grid-cols-[1.25fr_1.35fr_0.95fr_1.1fr] lg:gap-10 lg:px-8 lg:py-16">
          <div className="sm:col-span-2 lg:col-span-1">
            <Image
              src="/brand/al-hadid-logo.png"
              alt={`${site.name} Muslims Network`}
              width={200}
              height={68}
              className="h-14 w-auto rounded-lg"
            />
            <p className="mt-4 font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-white">
              {site.name}{" "}
              <span className="text-lime">{site.networkName}</span>
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/65">
              {site.tagline}. Bridging timeless wisdom with contemporary human
              development.
            </p>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <FooterColumnHeading>Explore</FooterColumnHeading>
            <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1">
              {links.map((link, i) => (
                <li key={link.href}>
                  <FooterNavLink
                    href={link.href}
                    label={link.label}
                    index={i}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterColumnHeading>Faculties</FooterColumnHeading>
            <ul className="mt-4 space-y-1">
              {site.faculties.map((faculty, i) => (
                <li key={faculty.slug}>
                  <FooterNavLink
                    href={`/faculties/${faculty.slug}`}
                    label={faculty.title}
                    index={i}
                  />
                </li>
              ))}
            </ul>
          </div>

          <div>
            <FooterColumnHeading>Contact</FooterColumnHeading>
            <ul className="mt-4 space-y-3.5 text-sm text-white/75">
              <li>
                <a
                  href={site.contact.emailHref}
                  className="inline-flex items-start gap-3 transition-colors hover:text-white"
                >
                  <span className="mt-0.5 text-lime/80">
                    <MailIcon />
                  </span>
                  {site.contact.email}
                </a>
              </li>
              <li>
                <a
                  href={site.contact.phoneHref}
                  className="inline-flex items-start gap-3 transition-colors hover:text-white"
                >
                  <span className="mt-0.5 text-lime/80">
                    <PhoneIcon />
                  </span>
                  {site.contact.phoneDisplay}
                </a>
              </li>
              <li className="inline-flex items-start gap-3 text-white/55">
                <span className="mt-0.5 text-lime/80">
                  <MapPinIcon />
                </span>
                <span>{site.contact.addressLines.join(", ")}</span>
              </li>
            </ul>

            <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-lime">
              Follow us
            </p>
            <ul className="mt-4 flex flex-wrap gap-2.5">
              {founder.social.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={item.label}
                    title={item.label}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/15 bg-white/5 text-white/85 transition-all duration-200 hover:-translate-y-0.5 hover:border-lime/50 hover:bg-lime/15 hover:text-lime"
                  >
                    {socialIcons[item.label]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 bg-black/10">
          <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-5 text-xs text-white/45 md:flex-row md:items-center md:justify-between md:px-8">
            <p>
              © {new Date().getFullYear()} {site.name} Muslims Network. All
              rights reserved.
            </p>
            <div className="flex gap-5">
              <Link
                href="/contact"
                className="transition-colors hover:text-white"
              >
                Privacy
              </Link>
              <Link
                href="/contact"
                className="transition-colors hover:text-white"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
