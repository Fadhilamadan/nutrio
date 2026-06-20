import { Settings as SettingsIcon, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { percentage } from "@/lib/utils";

type DefaultTokenBannerProps = {
  remaining: number;
  limit: number;
  variant?: "card" | "banner";
  onGoToSettings?: () => void;
};

export function DefaultTokenBanner({ remaining, limit, variant = "card", onGoToSettings }: DefaultTokenBannerProps) {
  const isExhausted = remaining <= 0;
  const progress = percentage(limit - remaining, limit);

  if (variant === "banner") {
    return (
      <div className="surface-card rounded-xl p-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 shrink-0 text-[var(--warning)]" />
          <p className="min-w-0 text-sm text-[var(--ink-secondary)]">
            {isExhausted ? (
              <>
                Free trial used up —{" "}
                <button
                  type="button"
                  onClick={onGoToSettings}
                  className="font-medium text-[var(--primary)] underline underline-offset-2"
                >
                  set up your own key
                </button>
              </>
            ) : (
              <>
                Free trial:{" "}
                <span className="font-semibold text-[var(--ink)]">
                  {remaining}/{limit}
                </span>{" "}
                snapshot{remaining !== 1 ? "s" : ""} left
              </>
            )}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="surface-card rounded-xl p-5">
      <div className="flex gap-4">
        <div className="mt-0.5 grid size-10 shrink-0 place-items-center rounded-xl bg-[color-mix(in_srgb,var(--warning)_12%,var(--surface))] text-[var(--warning)]">
          <Sparkles className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          {isExhausted ? (
            <>
              <h3 className="text-base font-bold tracking-[-0.0125em] text-[var(--ink)]">Free trial used up</h3>
              <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">
                You&apos;ve used all {limit} free snapshots. Set up your own AI provider key to keep analyzing food.
              </p>
              <Button variant="secondary" size="sm" className="mt-3" onClick={onGoToSettings}>
                <SettingsIcon className="size-4" />
                Go to Settings
              </Button>
            </>
          ) : (
            <>
              <h3 className="text-base font-bold tracking-[-0.0125em] text-[var(--ink)]">
                Free trial — {remaining} of {limit} snapshots remaining
              </h3>
              <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">
                You&apos;re using a shared AI token to try Nutrio. Add your own API key in Settings for unlimited
                analysis.
              </p>
              <div className="mt-3">
                <div className="h-1.5 w-full rounded-full bg-[var(--surface-soft)]">
                  <div
                    className="h-full rounded-full bg-[var(--warning)] transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="mt-1 text-xs text-[var(--ink-faint)]">{progress}% used</p>
              </div>
              <button
                type="button"
                onClick={onGoToSettings}
                className="mt-3 text-xs font-medium text-[var(--primary)] underline underline-offset-2"
              >
                Set up your own API key &rarr;
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
