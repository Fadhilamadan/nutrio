"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { displayMealTime } from "@/lib/date";
import type { Meal } from "@/lib/types";

type MealCardProps = {
  meal: Meal;
  onEdit?: (meal: Meal) => void;
  onDelete?: (id: string) => Promise<void> | void;
};

export function MealCard({ meal, onEdit, onDelete }: MealCardProps) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleteError, setDeleteError] = useState("");
  const [isDeleting, startDelete] = useTransition();

  function deleteMeal() {
    if (!onDelete) return;
    setDeleteError("");
    startDelete(async () => {
      try {
        await onDelete(meal.id);
        setConfirmDelete(false);
      } catch (error) {
        setDeleteError(error instanceof Error ? error.message : "Failed to archive meal.");
      }
    });
  }

  return (
    <article className="surface-card rounded-xl p-4">
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-semibold text-[var(--ink)]">{meal.name}</h3>
        <div className="shrink-0 text-right">
          <p className="text-base font-bold text-[var(--ink)]">
            {meal.calories}
            <span className="text-xs font-normal text-[var(--ink-muted)]"> kcal</span>
          </p>
          <p className="text-xs text-[var(--ink-muted)]">{displayMealTime(meal.date)}</p>
        </div>
      </div>
      {meal.servingEstimate ? <p className="mt-1 text-xs text-[var(--ink-muted)]">{meal.servingEstimate}</p> : null}
      <div className="mt-3 flex flex-wrap gap-2 text-xs text-[var(--ink-muted)]">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-[var(--ink-muted)]">
          <span className="size-1.5 rounded-full bg-[var(--success)]" />P {meal.protein}g
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-[var(--ink-muted)]">
          <span className="size-1.5 rounded-full bg-[var(--accent-sky)]" />C {meal.carbs}g
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--surface-soft)] px-2.5 py-1 text-[var(--ink-muted)]">
          <span className="size-1.5 rounded-full bg-[var(--warning)]" />F {meal.fat}g
        </span>
        <span className="rounded-full bg-[var(--surface-soft)] px-2.5 py-1">
          {Math.round(meal.confidence * 100)}% AI
        </span>
      </div>
      {meal.items.length > 0 ? (
        <p className="mt-2 text-xs leading-5 text-[var(--ink-muted)]">{meal.items.join(" · ")}</p>
      ) : null}
      {confirmDelete ? (
        <div className="surface-soft mt-4 rounded-xl p-3">
          <p className="text-sm font-semibold text-[var(--ink)]">Archive this meal?</p>
          <p className="mt-1 text-xs leading-5 text-[var(--ink-muted)]">
            It will be archived in Notion, not permanently deleted.
          </p>
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="destructive" onClick={deleteMeal} disabled={isDeleting}>
              {isDeleting ? "Archiving" : "Archive meal"}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setConfirmDelete(false)}>
              Cancel
            </Button>
          </div>
          {deleteError ? <p className="mt-2 text-xs leading-5 text-[var(--danger)]">{deleteError}</p> : null}
        </div>
      ) : null}
      {onEdit || onDelete ? (
        <div className="mt-4 flex gap-2">
          {onEdit ? (
            <Button size="sm" variant="secondary" onClick={() => onEdit(meal)}>
              <Pencil className="size-3.5" />
              Edit
            </Button>
          ) : null}
          {onDelete ? (
            <Button size="sm" variant="destructive" onClick={() => setConfirmDelete(true)}>
              <Trash2 className="size-3.5" />
              Archive
            </Button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}
