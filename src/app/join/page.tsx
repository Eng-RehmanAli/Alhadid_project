import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { site } from "@/data/site";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Sign in required",
  description: "Please log in or create an account to continue.",
};

function safeNext(raw: string | undefined) {
  if (!raw) return "/";
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("://")) {
    return raw;
  }
  return "/";
}

export default async function JoinPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  const params = await searchParams;
  const next = safeNext(params.next);

  if (session) redirect(next);

  return (
    <section className="relative isolate overflow-hidden grid-scene px-5 pb-20 pt-8 text-white md:px-8 md:pt-12">
      <div className="relative mx-auto max-w-md text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lime">
          {site.networkTagline}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold text-white">
          Please log in or sign up
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-white/70">
          Create an account to unlock course benefits and exclusive offers. Once
          you&apos;re signed in, you can browse programs and apply when
          registration opens.
        </p>
        <ul className="mt-6 space-y-2 text-left text-sm text-white/65">
          <li className="flex gap-2">
            <span className="text-lime" aria-hidden>
              •
            </span>
            Member-only course updates and early offers
          </li>
          <li className="flex gap-2">
            <span className="text-lime" aria-hidden>
              •
            </span>
            Apply directly when a seat opens
          </li>
          <li className="flex gap-2">
            <span className="text-lime" aria-hidden>
              •
            </span>
            Track programs that fit your goals
          </li>
        </ul>

        <div className="mt-10 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link
            href={`/login?next=${encodeURIComponent(next)}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-6 py-3 text-sm font-semibold text-ink transition-transform hover:scale-[1.03]"
          >
            Log In
          </Link>
          <Link
            href={`/signup?next=${encodeURIComponent(next)}`}
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/50 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
          >
            Sign up
          </Link>
        </div>

        <p className="mt-8 text-sm text-white/50">
          <Link href="/" className="underline underline-offset-4 hover:text-white">
            Back home
          </Link>
        </p>
      </div>
    </section>
  );
}
