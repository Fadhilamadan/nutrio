"use client";

import type { ReactNode } from "react";

type ScreenHeaderProps = {
  eyebrow: string;
  title: string;
  action?: ReactNode;
};

export function ScreenHeader({ eyebrow, title, action }: ScreenHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4">
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.125px] text-[var(--primary)]">{eyebrow}</p>
        <h1 className="mt-1 text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">{title}</h1>
      </div>
      {action}
    </header>
  );
}
