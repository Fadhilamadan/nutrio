"use client";

import { motion } from "framer-motion";

import { percentage } from "@/lib/utils";

type MacroProgressRingProps = {
  value: number;
  target: number;
  label: string;
  unit?: string;
  size?: number;
};

export function MacroProgressRing({ value, target, label, unit = "", size = 184 }: MacroProgressRingProps) {
  const progress = percentage(value, target);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative grid place-items-center" style={{ width: size, height: size }}>
      <svg
        className="-rotate-90"
        width={size}
        height={size}
        viewBox="0 0 184 184"
        role="img"
        aria-label={`${label} ${progress}%`}
      >
        <circle cx="92" cy="92" r={radius} fill="none" stroke="var(--hairline)" strokeWidth="16" />
        <motion.circle
          cx="92"
          cy="92"
          r={radius}
          fill="none"
          stroke="url(#macro-gradient)"
          strokeLinecap="round"
          strokeWidth="16"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        <defs>
          <linearGradient id="macro-gradient" x1="0" x2="1" y1="0" y2="1">
            <stop stopColor="var(--primary)" />
            <stop offset="1" stopColor="var(--accent-sky)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-bold tracking-[-0.04em] text-[var(--ink)]">{Math.round(value)}</p>
        <p className="text-xs uppercase tracking-[0.125px] text-[var(--ink-muted)]">
          {unit ? `${unit} ${label}` : label}
        </p>
        <p className="mt-1 text-sm text-[var(--primary)]">{progress}% of goal</p>
      </div>
    </div>
  );
}
