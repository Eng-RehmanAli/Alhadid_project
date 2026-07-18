import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import SignupForm from "@/components/SignupForm";
import { site } from "@/data/site";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Create account",
  description: "Create an Al Hadid account.",
};

function safeNext(raw: string | undefined) {
  if (!raw) return "/";
  if (raw.startsWith("/") && !raw.startsWith("//") && !raw.includes("://")) {
    return raw;
  }
  return "/";
}

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const params = await searchParams;
  const nextRaw = safeNext(params.next);
  const next = nextRaw === "/" ? "/dashboard" : nextRaw;
  const fromCourses = next === "/courses" || next.startsWith("/courses/");

  return (
    <section className="relative isolate overflow-hidden grid-scene px-5 pb-20 pt-8 text-white md:px-8 md:pt-12">
      <div className="relative mx-auto max-w-lg">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lime">
          {site.networkTagline}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold text-white">
          Create account
        </h1>
        <p className="mt-3 text-sm text-white/65">
          {fromCourses
            ? "Create an account to browse courses. "
            : "Join Al Hadid. "}
          <Link
            href={`/login?next=${encodeURIComponent(next)}`}
            className="underline underline-offset-4 hover:text-white"
          >
            Already have an account? Log In
          </Link>
        </p>
        <div className="mt-10 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md md:p-8">
          <SignupForm next={next} />
        </div>
      </div>
    </section>
  );
}
