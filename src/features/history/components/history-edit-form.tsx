"use client";

import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Meal } from "@/lib/types";

type HistoryEditFormProps = {
  meal: Meal;
  onSave: (meal: Meal) => Promise<void>;
  onCancel: () => void;
};

export function HistoryEditForm({ meal, onSave, onCancel }: HistoryEditFormProps) {
  const [draft, setDraft] = useState(meal);
  const [error, setError] = useState("");
  const [isSaving, startSaving] = useTransition();

  function updateNumber(
    field: keyof Pick<Meal, "calories" | "protein" | "carbs" | "fat" | "confidence">,
    value: string,
  ) {
    setDraft((prev) => ({ ...prev, [field]: Number(value) || 0 }));
  }

  function saveEditingMeal() {
    setError("");
    startSaving(async () => {
      try {
        await onSave({ ...draft, editedByUser: true });
        onCancel();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to save meal edit.");
      }
    });
  }

  return (
    <section className="surface-card space-y-4 rounded-xl p-5">
      <div>
        <h2 className="text-lg font-bold text-[var(--ink)]">Edit meal</h2>
        <p className="text-sm text-[var(--ink-muted)]">Updates are saved back to Notion.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-name">Meal name</Label>
        <Input
          id="edit-name"
          value={draft.name}
          onChange={(event) => setDraft((prev) => ({ ...prev, name: event.target.value }))}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="edit-calories">Calories</Label>
          <Input
            id="edit-calories"
            inputMode="numeric"
            value={draft.calories}
            onChange={(event) => updateNumber("calories", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-protein">Protein</Label>
          <Input
            id="edit-protein"
            inputMode="numeric"
            value={draft.protein}
            onChange={(event) => updateNumber("protein", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-carbs">Carbs</Label>
          <Input
            id="edit-carbs"
            inputMode="numeric"
            value={draft.carbs}
            onChange={(event) => updateNumber("carbs", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-fat">Fat</Label>
          <Input
            id="edit-fat"
            inputMode="numeric"
            value={draft.fat}
            onChange={(event) => updateNumber("fat", event.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-serving">Serving estimate</Label>
        <Input
          id="edit-serving"
          value={draft.servingEstimate}
          onChange={(event) => setDraft((prev) => ({ ...prev, servingEstimate: event.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-items">Food items</Label>
        <Input
          id="edit-items"
          value={draft.items.join(", ")}
          onChange={(event) =>
            setDraft((prev) => ({
              ...prev,
              items: event.target.value
                .split(",")
                .map((item) => item.trim())
                .filter(Boolean),
            }))
          }
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-notes">Notes</Label>
        <Input
          id="edit-notes"
          value={draft.notes}
          onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
        />
      </div>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="button" onClick={saveEditingMeal} disabled={isSaving}>
          {isSaving ? "Saving edit" : "Save edit"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </section>
  );
}
