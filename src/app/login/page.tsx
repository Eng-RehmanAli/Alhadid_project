import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import LoginForm from "@/components/LoginForm";
import { site } from "@/data/site";
import { getSession } from "@/lib/session";

export const metadata: Metadata = {
  title: "Log In",
  description: "Log in to your Al Hadid account.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>;
}) {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const params = await searchParams;
  const nextRaw = params.next ?? "/dashboard";
  const next =
    nextRaw.startsWith("/") && !nextRaw.startsWith("//") && !nextRaw.includes("://")
      ? nextRaw === "/"
        ? "/dashboard"
        : nextRaw
      : "/dashboard";

  return (
    <section className="relative isolate overflow-hidden grid-scene px-5 pb-20 pt-8 text-white md:px-8 md:pt-12">
      <div className="relative mx-auto max-w-md">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-lime">
          {site.networkTagline}
        </p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl font-bold text-white">
          Log In
        </h1>
        <p className="mt-3 text-sm text-white/65">
          Access your Al Hadid account.{" "}
          <Link href="/" className="underline underline-offset-4 hover:text-white">
            Back home
          </Link>
        </p>
        <div className="mt-10 rounded-3xl border border-white/20 bg-white/10 p-6 backdrop-blur-md md:p-8">
          <LoginForm next={next} />
        </div>
      </div>
    </section>
  );
}
