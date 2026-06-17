"use client";

import { USER_COLORS } from "@/lib/constants";
import type { User } from "@/lib/types";
import { cn } from "@/lib/utils";

type UserProfileCardProps = {
  user: User;
};

const userColorClasses: Record<string, string | undefined> = Object.fromEntries(
  USER_COLORS.map((color) => [color, color]),
);
userColorClasses.default = "from-slate-200 to-slate-300";

export function UserProfileCard({ user }: UserProfileCardProps) {
  const parts = user.name.split(" ");
  const initials =
    parts.length > 1
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();

  return (
    <article className="surface-card rounded-xl p-5">
      <div className="flex items-center gap-4">
        <div
          className={cn(
            "grid size-16 place-items-center rounded-xl bg-gradient-to-br text-xl font-black text-black",
            userColorClasses[user.color] ?? userColorClasses.default,
          )}
        >
          {initials}
        </div>
        <div>
          <h2 className="text-lg font-bold text-[var(--ink)]">{user.name}</h2>
          <p className="text-sm text-[var(--ink-muted)]">{user.email}</p>
          <p className="mt-2 inline-flex rounded-full bg-[color-mix(in_srgb,var(--primary)_10%,var(--surface))] px-3 py-1 text-xs text-[var(--primary)]">
            {user.role}
          </p>
        </div>
      </div>
    </article>
  );
}
