"use client";

import { motion } from "framer-motion";

import { Progress } from "@/components/ui/progress";
import { percentage } from "@/lib/utils";

type MacroCardProps = {
  label: string;
  value: number;
  target: number;
  unit?: string;
  accent: "protein" | "carbs" | "fat" | "calories";
};

const accentColors: Record<MacroCardProps["accent"], string> = {
  protein: "var(--success)",
  carbs: "var(--accent-sky)",
  fat: "var(--warning)",
  calories: "var(--accent-purple)",
};

export function MacroCard({ label, value, target, unit = "g", accent }: MacroCardProps) {
  const progress = percentage(value, target);

  return (
    <motion.div
      layout
      className="surface-card rounded-xl p-4"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="mb-3 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-[var(--ink)]">{label}</p>
          <p className="text-xs text-[var(--ink-muted)]">
            {Math.max(target - value, 0)}
            {unit} remaining
          </p>
        </div>
        <div className="size-3 rounded-full" style={{ backgroundColor: accentColors[accent] }} />
      </div>
      <Progress value={progress} />
      <div className="mt-3 flex items-end justify-between">
        <p className="text-2xl font-bold tracking-[-0.035em] text-[var(--ink)]">
          {value}
          <span className="text-sm text-[var(--ink-muted)]">{unit}</span>
        </p>
        <p className="text-xs text-[var(--ink-muted)]">
          / {target}
          {unit}
        </p>
      </div>
    </motion.div>
  );
}
