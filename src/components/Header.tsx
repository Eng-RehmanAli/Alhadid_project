"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { logoutAction } from "@/lib/auth-actions";
import { site } from "@/data/site";

const nav = [
  { href: "/", label: "Home" },
  { href: "/courses", label: "Courses" },
  { href: "/faculties", label: "Faculties" },
  { href: "/fellowship", label: "Fellowship" },
  { href: "/books", label: "Books" },
  { href: "/articles", label: "Articles" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

type HeaderProps = {
  user: { name: string; email: string } | null;
};

function DashboardNameToggle({
  name,
  email,
  onAfterClick,
  className = "",
}: {
  name: string;
  email: string;
  onAfterClick?: () => void;
  className?: string;
}) {
  const [showDashboard, setShowDashboard] = useState(false);

  useEffect(() => {
    const reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      // Skip animation — land on the clear Dashboard label.
      setShowDashboard(true);
      return;
    }
    // Name first, then switch once to Dashboard and stay.
    const id = window.setTimeout(() => {
      setShowDashboard(true);
    }, 2000);
    return () => window.clearTimeout(id);
  }, []);

  const label = showDashboard ? "Dashboard" : name;

  return (
    <Link
      href="/dashboard"
      onClick={onAfterClick}
      className={`inline-flex min-h-9 min-w-[7.5rem] max-w-[11rem] items-center justify-center truncate text-sm font-semibold transition-colors hover:text-white ${
        showDashboard ? "text-lime" : "text-white/90"
      } ${className}`}
      title={`Go to dashboard · ${email}`}
      aria-label={`${name} — open Dashboard`}
    >
      <span key={label} className="animate-fade-in truncate">
        {label}
      </span>
    </Link>
  );
}

function AuthControls({
  user,
  className = "",
  withDot = false,
  onAfterClick,
}: {
  user: HeaderProps["user"];
  className?: string;
  withDot?: boolean;
  onAfterClick?: () => void;
}) {
  const pathname = usePathname();
  const baseClass = `login-btn inline-flex items-center gap-2 rounded-full border border-white/80 bg-ink px-4 py-2 text-sm font-semibold text-white ${className}`;

  if (user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <DashboardNameToggle
          name={user.name}
          email={user.email}
          onAfterClick={onAfterClick}
        />
        <form action={logoutAction}>
          <button type="submit" className={baseClass} onClick={onAfterClick}>
            {withDot ? (
              <span className="login-btn__dot grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime text-[0.65rem] text-ink">
                ●
              </span>
            ) : null}
            Log out
          </button>
        </form>
      </div>
    );
  }

  const onLoginPage = pathname.startsWith("/login");
  const href = onLoginPage ? "/signup" : "/login";
  const label = onLoginPage ? "Sign up" : "Log In";

  return (
    <Link
      href={href}
      onClick={onAfterClick}
      className={`${baseClass} ${onLoginPage ? "flex-row-reverse" : ""}`}
    >
      {withDot ? (
        <span className="login-btn__dot grid h-6 w-6 shrink-0 place-items-center rounded-full bg-lime text-[0.65rem] text-ink">
          ●
        </span>
      ) : null}
      {label}
    </Link>
  );
}

export function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <header
      className={`relative z-50 text-white transition-colors duration-300 ${
        open ? "border-b border-white/15 bg-teal-dark" : "bg-teal"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-3 sm:gap-4 sm:px-5 md:px-8 md:py-4">
        <Link
          href="/"
          className="flex min-w-0 shrink items-center gap-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-lime"
          onClick={() => setOpen(false)}
        >
          <Image
            src="/brand/al-hadid-logo.png"
            alt={`${site.name} Muslims Network`}
            width={150}
            height={50}
            className="h-9 w-auto max-w-[140px] rounded-lg object-contain sm:h-10 sm:max-w-none md:h-11"
            priority
          />
        </Link>

        <nav className="hidden items-center gap-4 text-sm font-medium text-white/80 xl:gap-6 xl:flex">
          {nav.map((item) => {
            const active =
              item.href === "/"
                ? pathname === "/"
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative transition-colors duration-200 hover:text-white ${
                  active ? "text-white" : ""
                }`}
              >
                {item.label}
                {active ? (
                  <span className="absolute -bottom-1 left-0 h-0.5 w-full rounded-full bg-lime" />
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="hidden items-center gap-3 xl:flex">
          <AuthControls user={user} withDot />
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/30 text-white xl:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="sr-only">{open ? "Close" : "Menu"}</span>
          <span className="relative block h-3.5 w-5">
            <span
              className={`absolute left-0 block h-px w-full bg-white transition-transform duration-200 ${
                open ? "top-1.5 rotate-45" : "top-0"
              }`}
            />
            <span
              className={`absolute left-0 top-1.5 block h-px w-full bg-white transition-opacity duration-200 ${
                open ? "opacity-0" : "opacity-100"
              }`}
            />
            <span
              className={`absolute left-0 block h-px w-full bg-white transition-transform duration-200 ${
                open ? "top-1.5 -rotate-45" : "top-3"
              }`}
            />
          </span>
        </button>
      </div>

      <div
        id="mobile-nav"
        className={`border-t border-white/15 bg-teal-dark xl:hidden ${
          open ? "block" : "hidden"
        }`}
      >
        <nav className="mx-auto flex max-h-[min(70dvh,28rem)] max-w-6xl flex-col gap-1 overflow-y-auto overscroll-contain px-4 py-4 sm:px-5">
          {[...nav, { href: "/founder", label: "Founder" }].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl px-3 py-3 text-base text-white/90 hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          {user ? (
            <Link
              href="/dashboard"
              className="rounded-xl px-3 py-3 text-base text-white/90 hover:bg-white/5"
              onClick={() => setOpen(false)}
            >
              Dashboard
            </Link>
          ) : null}
          <AuthControls
            user={user}
            withDot
            className="mt-2 w-full justify-center py-3"
            onAfterClick={() => setOpen(false)}
          />
        </nav>
      </div>
    </header>
  );
}
