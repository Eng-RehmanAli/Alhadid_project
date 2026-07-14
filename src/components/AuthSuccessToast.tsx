"use client";

import { Suspense, useEffect, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const MESSAGES = {
  login: "Login successful. Welcome back!",
  signup: "Account created successfully. Welcome to Al Hadid!",
} as const;

function AuthSuccessToastInner() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const auth = searchParams.get("auth");
  const message =
    auth === "login" || auth === "signup" ? MESSAGES[auth] : null;

  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }

    setVisible(true);
    const hide = window.setTimeout(() => setVisible(false), 3000);
    const clean = window.setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete("auth");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    }, 3100);

    return () => {
      window.clearTimeout(hide);
      window.clearTimeout(clean);
    };
  }, [message, pathname, router, searchParams]);

  if (!visible || !message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 top-20 z-[100] flex justify-center px-4"
    >
      <div className="auth-toast rounded-2xl border border-lime/40 bg-ink px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-black/30">
        <span className="mr-2 text-lime" aria-hidden>
          ✓
        </span>
        {message}
      </div>
    </div>
  );
}

export function AuthSuccessToast() {
  return (
    <Suspense fallback={null}>
      <AuthSuccessToastInner />
    </Suspense>
  );
}
