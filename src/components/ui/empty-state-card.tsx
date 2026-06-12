import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import { Camera } from "lucide-react";

type EmptyStateCardProps = {
  title: string;
  description: string;
  icon?: LucideIcon;
  footer?: ReactNode;
};

export function EmptyStateCard({ title, description, icon: Icon = Camera, footer }: EmptyStateCardProps) {
  return (
    <article className="surface-card rounded-xl p-5 text-center">
      <div className="mx-auto grid size-14 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--primary)_10%,var(--surface))] text-[var(--primary)]">
        <Icon className="size-6" />
      </div>
      <h3 className="mt-4 text-base font-bold tracking-[-0.0125em] text-[var(--ink)]">{title}</h3>
      <p className="mx-auto mt-2 max-w-[18rem] text-sm leading-6 text-[var(--ink-muted)]">{description}</p>
      {footer ? <div className="mt-4 text-xs leading-5 text-[var(--ink-muted)]">{footer}</div> : null}
    </article>
  );
}
