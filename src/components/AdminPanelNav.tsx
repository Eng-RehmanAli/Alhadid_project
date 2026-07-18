"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type NavItem = { href: string; label: string };

type AdminPanelNavProps = {
  items: NavItem[];
  adminName?: string;
};

function NavIcon({ href }: { href: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.75,
    className: "h-3.5 w-3.5 shrink-0",
    "aria-hidden": true as const,
  };

  const paths: Record<string, ReactNode> = {
    "#overview": (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1.5" />
        <rect x="14" y="3" width="7" height="7" rx="1.5" />
        <rect x="3" y="14" width="7" height="7" rx="1.5" />
        <rect x="14" y="14" width="7" height="7" rx="1.5" />
      </>
    ),
    "#students": (
      <>
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="3.5" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a3.5 3.5 0 0 1 0 6.74" />
      </>
    ),
    "#enrollments": (
      <>
        <path d="M9 5H7a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2" />
        <rect x="9" y="3" width="6" height="4" rx="1" />
        <path d="M9 12h6M9 16h4" />
      </>
    ),
    "#courses": (
      <>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      </>
    ),
    "#lessons": (
      <>
        <path d="M4 6h16M4 12h16M4 18h10" />
        <circle cx="18" cy="18" r="2.5" />
      </>
    ),
    "#inbox": (
      <>
        <path d="M22 12h-6l-2 3h-4l-2-3H2" />
        <path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z" />
      </>
    ),
    "#activity": (
      <>
        <path d="M22 12h-4l-3 8L9 4l-3 8H2" />
      </>
    ),
  };

  return <svg {...common}>{paths[href] ?? paths["#overview"]}</svg>;
}

export function AdminPanelNav({ items, adminName }: AdminPanelNavProps) {
  const [active, setActive] = useState(items[0]?.href ?? "");
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const navRef = useRef<HTMLElement>(null);
  const btnRefs = useRef<Map<string, HTMLButtonElement>>(new Map());

  useEffect(() => {
    const ids = items.map((item) => item.href.replace("#", ""));
    const elements = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]?.target.id) {
          setActive(`#${visible[0].target.id}`);
        }
      },
      {
        rootMargin: "-18% 0px -62% 0px",
        threshold: [0.08, 0.25, 0.5],
      },
    );

    for (const el of elements) observer.observe(el);
    return () => observer.disconnect();
  }, [items]);

  useLayoutEffect(() => {
    const btn = btnRefs.current.get(active);
    const nav = navRef.current;
    if (!btn || !nav) return;

    const update = () => {
      const navBox = nav.getBoundingClientRect();
      const btnBox = btn.getBoundingClientRect();
      setIndicator({
        left: btnBox.left - navBox.left + nav.scrollLeft,
        width: btnBox.width,
      });
    };

    update();
    window.addEventListener("resize", update);
    nav.addEventListener("scroll", update, { passive: true });
    return () => {
      window.removeEventListener("resize", update);
      nav.removeEventListener("scroll", update);
    };
  }, [active, items]);

  function go(href: string) {
    const el = document.getElementById(href.replace("#", ""));
    if (!el) return;
    setActive(href);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const initials = adminName
    ? adminName
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("")
    : "";

  return (
    <div className="admin-panel-nav sticky top-[var(--site-header-height)] z-30 -mx-4 border-b border-white/10 bg-teal-dark/70 px-4 py-2.5 backdrop-blur-2xl sm:-mx-5 sm:px-5 md:-mx-8 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center gap-3">
        <nav
          ref={navRef}
          aria-label="Admin sections"
          className="admin-panel-nav__track relative flex min-w-0 flex-1 gap-0.5 overflow-x-auto rounded-2xl border border-white/12 bg-white/[0.07] p-1.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          <span
            aria-hidden
            className="admin-panel-nav__pill pointer-events-none absolute top-1.5 bottom-1.5 rounded-xl bg-white shadow-[0_4px_16px_rgba(0,0,0,0.12)]"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.width > 0 ? 1 : 0,
            }}
          />
          <span
            aria-hidden
            className="admin-panel-nav__pill-accent pointer-events-none absolute top-1.5 bottom-1.5 rounded-xl"
            style={{
              left: indicator.left,
              width: indicator.width,
              opacity: indicator.width > 0 ? 1 : 0,
            }}
          />

          {items.map((item) => {
            const isActive = active === item.href;
            return (
              <button
                key={item.href}
                ref={(node) => {
                  if (node) btnRefs.current.set(item.href, node);
                  else btnRefs.current.delete(item.href);
                }}
                type="button"
                onClick={() => go(item.href)}
                aria-current={isActive ? "true" : undefined}
                className={`relative z-10 inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold tracking-wide transition-colors duration-300 sm:px-3.5 sm:text-[13px] ${
                  isActive
                    ? "text-teal-dark"
                    : "text-white/70 hover:text-white"
                }`}
              >
                <span
                  className={`grid h-6 w-6 place-items-center rounded-lg transition-colors duration-300 ${
                    isActive
                      ? "bg-teal/10 text-teal-deep"
                      : "bg-white/5 text-white/80"
                  }`}
                >
                  <NavIcon href={item.href} />
                </span>
                <span className="whitespace-nowrap">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {adminName ? (
          <div
            className="admin-panel-nav__who hidden shrink-0 items-center gap-2.5 rounded-2xl border border-white/15 bg-teal-dark/55 px-3 py-2 shadow-[0_12px_40px_rgba(0,40,45,0.22),inset_0_1px_0_rgba(255,255,255,0.12)] backdrop-blur-2xl lg:flex"
            title={adminName}
          >
            <span className="admin-panel-nav__avatar relative grid h-8 w-8 place-items-center rounded-full bg-lime text-[0.7rem] font-bold tracking-wide text-teal-dark">
              {initials || "A"}
              <span
                aria-hidden
                className="admin-panel-nav__on-dot absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-teal-dark bg-lime"
              />
            </span>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="text-[0.6rem] font-semibold uppercase tracking-[0.18em] text-lime/90">
                  Admin
                </p>
                <span className="admin-panel-nav__on inline-flex items-center gap-1 rounded-full bg-lime/15 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase tracking-[0.14em] text-lime">
                  <span
                    aria-hidden
                    className="admin-panel-nav__on-pulse h-1.5 w-1.5 rounded-full bg-lime"
                  />
                  On
                </span>
              </div>
              <p className="max-w-[8.5rem] truncate text-xs font-semibold text-white">
                {adminName}
              </p>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
