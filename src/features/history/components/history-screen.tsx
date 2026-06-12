"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { History } from "lucide-react";

import { Button } from "@/components/ui/button";
import { EmptyStateCard } from "@/components/ui/empty-state-card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HistoryEditForm } from "@/features/history/components/history-edit-form";
import { MealCard } from "@/features/history/components/meal-card";
import { groupMealsByDate, totalMeals } from "@/lib/nutrition";
import type { Meal, User } from "@/lib/types";

type HistoryScreenProps = {
  user: User;
  meals: Meal[];
  query: string;
  hasMore: boolean;
  isLoadingMore: boolean;
  onQueryChange: (query: string) => Promise<void> | void;
  onLoadMore: () => Promise<void> | void;
  onEditMeal: (meal: Meal) => Promise<void> | void;
  onDeleteMeal: (id: string) => Promise<void> | void;
};

export function HistoryScreen({
  user,
  meals,
  query,
  hasMore,
  isLoadingMore,
  onQueryChange,
  onLoadMore,
  onEditMeal,
  onDeleteMeal,
}: HistoryScreenProps) {
  const [editingMealId, setEditingMealId] = useState<string | null>(null);
  const normalizedQuery = query.trim().toLowerCase();
  const userMeals = meals.filter((meal) => meal.userId === user.id);
  const groups = groupMealsByDate(userMeals);
  const entries = Object.entries(groups);

  const editingMeal = editingMealId ? (meals.find((m) => m.id === editingMealId) ?? null) : null;

  async function handleSaveEdit(meal: Meal) {
    await onEditMeal(meal);
    setEditingMealId(null);
  }

  return (
    <motion.section
      className="space-y-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
    >
      <div className="surface-card space-y-3 rounded-xl p-4">
        <div className="flex items-end justify-between gap-3">
          <div>
            <Label htmlFor="history-search">Search history</Label>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">
              {normalizedQuery ? `Showing ${userMeals.length} matching meals` : `Showing ${userMeals.length} meals`}
            </p>
          </div>
          {query ? (
            <Button type="button" size="sm" variant="ghost" onClick={() => void onQueryChange("")}>
              Clear
            </Button>
          ) : null}
        </div>
        <Input
          id="history-search"
          placeholder="Search meals, items, notes, or dates"
          value={query}
          onChange={(event) => void onQueryChange(event.target.value)}
        />
      </div>
      {entries.length > 0 ? (
        <>
          {entries.map(([date, group]) => {
            const totals = totalMeals(group.meals);
            return (
              <section key={date} className="space-y-3">
                <div className="flex items-end justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-[var(--ink)]">{group.label}</h2>
                    <p className="text-sm text-[var(--ink-muted)]">{group.meals.length} meals logged</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-[var(--ink)]">{totals.calories} kcal</p>
                    <p className="text-xs text-[var(--ink-muted)]">
                      P {totals.protein} · C {totals.carbs} · F {totals.fat}
                    </p>
                  </div>
                </div>
                {group.meals.map((meal) => (
                  <div key={meal.id} className="space-y-3">
                    <MealCard meal={meal} onEdit={() => setEditingMealId(meal.id)} onDelete={onDeleteMeal} />
                    {editingMeal?.id === meal.id ? (
                      <HistoryEditForm meal={meal} onSave={handleSaveEdit} onCancel={() => setEditingMealId(null)} />
                    ) : null}
                  </div>
                ))}
              </section>
            );
          })}
          {hasMore ? (
            <Button
              type="button"
              variant="secondary"
              className="w-full"
              onClick={() => void onLoadMore()}
              disabled={isLoadingMore}
            >
              {isLoadingMore ? "Loading meals" : "Load more meals"}
            </Button>
          ) : null}
        </>
      ) : (
        <EmptyStateCard
          icon={History}
          title={normalizedQuery ? "No matching meals" : "No meal history yet"}
          description={
            normalizedQuery
              ? `No saved meal matches "${query.trim()}". Clear the search or try another food item, note, or date.`
              : "Saved meals will appear here grouped by date, with daily calories and macro totals."
          }
          footer="Nutrio stores nutrition metadata only, never permanent food photos."
        />
      )}
    </motion.section>
  );
}
