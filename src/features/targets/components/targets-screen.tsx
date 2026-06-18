"use client";

import { motion } from "framer-motion";

import { TargetForm } from "@/features/targets/components/target-form";
import type { Targets } from "@/lib/types";

type TargetsScreenProps = {
  targets: Targets | null;
  onSave: (targets: Targets) => Promise<void> | void;
};

export function TargetsScreen({ targets, onSave }: TargetsScreenProps) {
  const formKey = targets
    ? `${targets.calories}:${targets.protein}:${targets.carbs}:${targets.fat}:${targets.reminderTime}`
    : "empty-targets";

  return (
    <motion.section
      className="space-y-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
    >
      <div className="surface-card rounded-xl p-5">
        <h2 className="text-xl font-bold tracking-[-0.025em] text-[var(--ink)]">Daily targets</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
          Use the TDEE calculator to estimate starting values, then adjust and save your targets.
        </p>
      </div>
      <TargetForm key={formKey} targets={targets} onSave={onSave} />
    </motion.section>
  );
}
