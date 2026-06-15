"use client";

import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { MacroCard } from "@/features/dashboard/components/macro-card";
import { MacroProgressRing } from "@/features/dashboard/components/macro-progress-ring";
import { MealCard } from "@/features/history/components/meal-card";
import { totalMeals } from "@/lib/nutrition";
import type { Meal, Targets, User } from "@/lib/types";

type TodayDashboardProps = {
  user: User;
  meals: Meal[];
  targets: Targets | null;
  onConfigureTargets: () => void;
};

export function TodayDashboard({ user, meals, targets, onConfigureTargets }: TodayDashboardProps) {
  const todayMeals = meals.filter((meal) => meal.userId === user.id);
  const totals = totalMeals(todayMeals);
  const hasTargets = Boolean(targets);

  return (
    <motion.section
      className="space-y-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
    >
      <div className="surface-card soft-shadow rounded-xl p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm text-[var(--ink-muted)]">Today for</p>
            <h1 className="text-2xl font-bold tracking-[-0.025em] text-[var(--ink)]">{user.name}</h1>
          </div>
          <p className="shrink-0 rounded-full bg-[var(--surface)] px-3 py-1 text-xs font-semibold text-[var(--primary)] ring-1 ring-[var(--hairline)]">
            {todayMeals.length} meals
          </p>
        </div>
        {hasTargets && targets ? (
          <>
            <div className="flex justify-center">
              <MacroProgressRing value={totals.calories} target={targets.calories} label="Calories" />
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center text-xs text-[var(--ink-muted)]">
              <div className="rounded-xl bg-[var(--surface-soft)] p-3">
                <p className="text-lg font-bold text-[var(--ink)]">{Math.max(targets.calories - totals.calories, 0)}</p>
                kcal left
              </div>
              <div className="rounded-xl bg-[var(--surface-soft)] p-3">
                <p className="text-lg font-bold text-[var(--ink)]">{Math.max(targets.protein - totals.protein, 0)}g</p>
                protein left
              </div>
              <div className="rounded-xl bg-[var(--surface-soft)] p-3">
                <p className="text-lg font-bold text-[var(--ink)]">{targets.reminderTime}</p>
                reminder
              </div>
            </div>
          </>
        ) : (
          <div className="surface-soft rounded-xl p-4">
            <p className="font-semibold text-[var(--ink)]">Set targets before reading progress</p>
            <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
              You can log meals now, but calories and macros need a saved target before progress is meaningful.
            </p>
            <Button type="button" size="sm" className="mt-4" onClick={onConfigureTargets}>
              Calculate targets
            </Button>
          </div>
        )}
      </div>
      {targets ? (
        <div className="grid grid-cols-2 gap-3">
          <MacroCard label="Protein" value={totals.protein} target={targets.protein} accent="protein" />
          <MacroCard label="Carbs" value={totals.carbs} target={targets.carbs} accent="carbs" />
          <MacroCard label="Fat" value={totals.fat} target={targets.fat} accent="fat" />
          <MacroCard label="Calories" value={totals.calories} target={targets.calories} unit="" accent="calories" />
        </div>
      ) : null}
      <section className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-[var(--ink)]">Recent meals</h2>
          <p className="text-xs text-[var(--ink-muted)]">Metadata only</p>
        </div>
        {todayMeals.length > 0 ? (
          todayMeals.map((meal) => <MealCard key={meal.id} meal={meal} />)
        ) : (
          <EmptyStateCard
            title="No meals logged today"
            description="Your progress starts at zero until you scan or upload a plate. Tap the blue camera button when you are ready."
            footer="Food images are analyzed once and discarded."
          />
        )}
      </section>
    </motion.section>
  );
}
