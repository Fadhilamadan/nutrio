import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

type ConnectionErrorCardProps = {
  title?: string;
  message: string;
  detail?: string;
  onRetry?: () => void;
};

export function ErrorCard({ title = "Something went wrong", message, detail, onRetry }: ConnectionErrorCardProps) {
  return (
    <section className="rounded-xl border border-[color-mix(in_srgb,var(--danger)_24%,var(--hairline))] bg-[color-mix(in_srgb,var(--danger)_8%,var(--surface))] p-5 text-[var(--danger)]">
      <div className="flex items-start gap-3">
        <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--danger)_12%,var(--surface))] text-[var(--danger)]">
          <AlertTriangle className="size-5" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold">{title}</h2>
          <p className="text-sm leading-6 text-[var(--ink-secondary)]">{message}</p>
          {detail ? <p className="text-xs leading-5 text-[var(--ink-muted)]">{detail}</p> : null}
          {onRetry ? (
            <Button variant="secondary" size="sm" onClick={onRetry}>
              Retry
            </Button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
