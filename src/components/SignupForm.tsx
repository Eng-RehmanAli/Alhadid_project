"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signupAction, type AuthState } from "@/lib/auth-actions";
import { PasswordField } from "@/components/PasswordField";

const initialState: AuthState = {};

export default function SignupForm({ next = "/" }: { next?: string }) {
  const [state, action, pending] = useActionState(signupAction, initialState);

  const field =
    "mt-2 w-full border-b border-white/20 bg-transparent px-0 py-3 text-white outline-none transition-colors placeholder:text-white/35 focus:border-white";

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="next" value={next} />
      <label className="block">
        <span className="text-sm font-semibold tracking-wide text-white/90">
          Full name
        </span>
        <input
          type="text"
          name="name"
          required
          autoComplete="name"
          placeholder="Your full name"
          className={field}
        />
      </label>

      <label className="block">
        <span className="text-sm font-semibold tracking-wide text-white/90">Email</span>
        <input
          type="email"
          name="email"
          required
          autoComplete="email"
          placeholder="your.email@example.com"
          className={field}
        />
      </label>

      <div className="grid gap-6 sm:grid-cols-2">
        <PasswordField
          name="password"
          label="Password"
          placeholder="At least 8 characters"
          autoComplete="new-password"
          minLength={8}
        />
        <PasswordField
          name="confirmPassword"
          label="Confirm password"
          placeholder="Repeat password"
          autoComplete="new-password"
          minLength={8}
        />
      </div>

      {state.error ? (
        <p role="alert" className="border-l-2 border-white/70 pl-3 text-sm text-white/85">
          {state.error}
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <button
          type="submit"
          disabled={pending}
          className="inline-flex min-h-11 items-center justify-center rounded-full bg-lime px-6 py-3 text-sm font-semibold tracking-wide text-ink transition-transform hover:scale-[1.03] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {pending ? "Creating account…" : "Create account"}
        </button>
        <p className="text-sm text-white/55">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-white hover:underline">
            Log In
          </Link>
        </p>
      </div>
    </form>
  );
}
