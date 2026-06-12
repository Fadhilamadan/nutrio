type LoadingCardProps = {
  title: string;
  message: string;
  rows?: number;
};

export function LoadingCard({ title, message, rows = 3 }: LoadingCardProps) {
  return (
    <section className="surface-card soft-shadow overflow-hidden rounded-xl p-5">
      <div className="flex items-start gap-3">
        <div className="relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--primary)_12%,var(--surface))]">
          <div className="loading-shimmer absolute inset-0" />
          <div className="size-2 rounded-full bg-[var(--primary)]" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[var(--ink)]">{title}</p>
          <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">{message}</p>
        </div>
      </div>
      <div className="mt-5 space-y-2">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="relative h-3 overflow-hidden rounded-full bg-[var(--surface-soft)]">
            <div className="loading-shimmer absolute inset-0" />
          </div>
        ))}
      </div>
    </section>
  );
}
