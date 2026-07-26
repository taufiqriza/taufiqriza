"use client";

import { signIn, useSession } from "next-auth/react";
import { FormEvent, useEffect, useState } from "react";

import { useRouter } from "@/i18n/navigation";

export default function AdminLoginPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user?.isAdmin) {
      router.replace("/admin");
    }
  }, [status, session, router]);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("admin-credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid credentials or email not in ADMIN_EMAILS");
      return;
    }
    router.replace("/admin");
    router.refresh();
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center bg-[#0a0a0b] px-4 text-neutral-100">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-1/4 h-72 w-72 -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]" />
      </div>

      <div className="relative w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-lg font-black text-black">
            A
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">Admin access</h1>
          <p className="mt-2 text-sm text-neutral-500">
            Sign in to manage portfolio content
          </p>
        </div>

        <form
          onSubmit={onSubmit}
          className="rounded-2xl border border-white/[0.08] bg-white/[0.03] p-6 shadow-2xl backdrop-blur"
        >
          {error && (
            <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-3 py-2 text-sm text-red-300">
              {error}
            </div>
          )}

          <label className="mb-4 block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              placeholder="admin@example.com"
            />
          </label>

          <label className="mb-6 block space-y-1.5">
            <span className="text-xs font-medium uppercase tracking-wider text-neutral-500">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/[0.08] bg-black/40 px-3 py-2.5 text-sm outline-none focus:border-primary/40 focus:ring-2 focus:ring-primary/10"
              placeholder="••••••••"
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-black transition hover:bg-primary-400 disabled:opacity-50"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          </form>

        <p className="mt-6 text-center text-[11px] text-neutral-600">
          Email must be listed in <code className="text-neutral-400">ADMIN_EMAILS</code>
        </p>
      </div>
    </div>
  );
}
