"use client";

import { signIn } from "next-auth/react";
import { ShieldCheck, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function LoginScreen() {
  return (
    <main className="relative flex min-h-dvh w-full flex-col overflow-hidden bg-[var(--background)] px-5 py-8 text-[var(--foreground)]">
      <div
        aria-hidden
        className="absolute -left-20 top-10 size-56 rounded-full bg-[color-mix(in_srgb,var(--primary)_8%,transparent)] blur-3xl"
      />
      <div
        aria-hidden
        className="absolute -right-16 top-52 size-52 rounded-full bg-[color-mix(in_srgb,var(--ink-muted)_7%,transparent)] blur-3xl"
      />
      <section className="surface-card soft-shadow relative mt-auto rounded-xl p-6">
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-[var(--hairline)] bg-[var(--surface)] px-3 py-2 text-xs font-semibold text-[var(--primary)]">
          <Sparkles className="size-4" />
          Nutrio
        </div>
        <h1 className="text-4xl font-black tracking-[-0.05em]">AI macros for every plate.</h1>
        <p className="mt-3 text-sm leading-6 text-[var(--ink-muted)]">
          Sign in with Google, snap food, review AI nutrition, and save only metadata to Notion.
        </p>
        <div className="mt-7 space-y-3">
          <Button className="w-full" size="lg" onClick={() => signIn("google")}>
            <ShieldCheck className="size-4" />
            Continue with Google
          </Button>
        </div>
      </section>
    </main>
  );
}
