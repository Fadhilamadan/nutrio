import type * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-full text-sm font-semibold transition active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color-mix(in_srgb,var(--primary)_30%,transparent)]",
  {
    variants: {
      variant: {
        default: "bg-[var(--primary)] text-white shadow-[var(--shadow-soft)] hover:bg-[var(--primary-active)]",
        secondary:
          "border border-[var(--hairline)] bg-[var(--surface)] text-[var(--ink-secondary)] shadow-[var(--shadow-soft)] hover:bg-[var(--surface-soft)]",
        ghost: "text-[var(--ink-muted)] hover:bg-[var(--surface)] hover:text-[var(--ink)]",
        destructive:
          "border border-[color-mix(in_srgb,var(--danger)_24%,var(--hairline))] bg-[var(--surface)] text-[var(--danger)] hover:bg-[color-mix(in_srgb,var(--danger)_8%,var(--surface))]",
      },
      size: {
        default: "h-11 px-5",
        sm: "h-9 px-4 text-xs",
        lg: "h-13 px-6 text-base",
        icon: "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  };

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";

  return <Comp className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
