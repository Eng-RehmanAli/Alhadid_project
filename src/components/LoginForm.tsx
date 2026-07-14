"use client";

import Link from "next/link";
import { useActionState } from "react";
import { loginAction, type AuthState } from "@/lib/auth-actions";
import { PasswordField } from "@/components/PasswordField";

const initialState: AuthState = {};

export default function LoginForm({ next = "/" }: { next?: string }) {
  const [state, action, pending] = useActionState(loginAction, initialState);

  const field =
    "mt-2 w-full border-b border-white/20 bg-transparent px-0 py-3 text-white outline-none transition-colors placeholder:text-white/35 focus:border-white";

  return (
    <form action={action} className="space-y-6">
      <input type="hidden" name="next" value={next} />
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

      <PasswordField
        name="password"
        label="Password"
        placeholder="Your password"
        autoComplete="current-password"
      />

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
          {pending ? "Logging in…" : "Log In"}
        </button>
        <p className="text-sm text-white/55">
          New here?{" "}
          <Link href="/signup" className="font-semibold text-white hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </form>
  );
}
