import type * as React from "react";

import { cn } from "@/lib/utils";

type ProgressProps = React.HTMLAttributes<HTMLDivElement> & {
  value: number;
};

export function Progress({ className, value, ...props }: ProgressProps) {
  const progress = Math.min(Math.max(value, 0), 100);

  return (
    <div
      className={cn("h-2 overflow-hidden rounded-full bg-[var(--hairline)]", className)}
      role="progressbar"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={progress}
      {...props}
    >
      <div
        className="h-full rounded-full bg-[var(--primary)] transition-all duration-500"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
