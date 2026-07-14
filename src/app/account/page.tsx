import Link from "next/link";
import { requireUser, logoutAction } from "@/lib/auth-actions";

export const metadata = {
  title: "Account",
};

export default async function AccountPage() {
  const user = await requireUser();

  return (
    <div className="bg-teal text-white">
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-5 md:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-lime">
          Account
        </p>
        <h1 className="mt-3 font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Welcome, {user.name}
        </h1>
        <p className="mt-3 max-w-xl text-white/70">
          Signed in as {user.email}. Access tokens expire in 15 minutes and are
          renewed with a secure refresh token stored as an httpOnly cookie.
        </p>

        <div className="mt-10 flex flex-wrap gap-4">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center justify-center rounded-full border border-white/40 px-5 py-2.5 text-sm font-semibold text-white hover:bg-white/5"
          >
            Back home
          </Link>
          <form action={logoutAction}>
            <button
              type="submit"
              className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-ink hover:bg-lime-soft"
            >
              Log out
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
