"use client";

import { useState, useTransition } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<string, string>>>({});

  function updateNumber(
    field: keyof Pick<Meal, "calories" | "protein" | "carbs" | "fat" | "confidence">,
    value: string,
  ) {
    setDraft((prev) => ({ ...prev, [field]: Number(value) || 0 }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function clearFieldError(field: string) {
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  const isDirty =
    draft.name !== meal.name ||
    draft.calories !== meal.calories ||
    draft.protein !== meal.protein ||
    draft.carbs !== meal.carbs ||
    draft.fat !== meal.fat ||
    draft.servingEstimate !== meal.servingEstimate ||
    draft.items.join(",") !== meal.items.join(",") ||
    draft.notes !== meal.notes;

  function saveEditingMeal() {
    setError("");

    const errors: Partial<Record<string, string>> = {};
    if (!draft.name.trim()) errors.name = "Meal name is required";
    if (draft.calories < 0) errors.calories = "Must not be negative";
    if (draft.protein < 0) errors.protein = "Must not be negative";
    if (draft.carbs < 0) errors.carbs = "Must not be negative";
    if (draft.fat < 0) errors.fat = "Must not be negative";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    startSaving(async () => {
      try {
        await onSave({ ...draft, editedByUser: true });
        toast.success("Meal updated");
        onCancel();
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Failed to save meal edit.";
        setError(msg);
        toast.error(msg);
      }
    });
  }

  return (
    <section className="surface-card space-y-4 rounded-xl p-5">
      <div>
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-bold text-[var(--ink)]">Edit meal</h2>
          {isDirty ? (
            <span className="animate-pulse inline-flex items-center gap-1 rounded-full bg-[var(--warning)]/15 px-2.5 py-0.5 text-xs font-medium text-[var(--warning)]">
              <span className="size-1.5 rounded-full bg-[var(--warning)]" />
              Unsaved
            </span>
          ) : null}
        </div>
        <p className="text-sm text-[var(--ink-muted)]">Updates are saved to your history.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-name">Meal name</Label>
        <Input
          id="edit-name"
          className={fieldErrors.name ? "border-[var(--danger)]" : undefined}
          value={draft.name}
          onChange={(event) => {
            setDraft((prev) => ({ ...prev, name: event.target.value }));
            clearFieldError("name");
          }}
        />
        {fieldErrors.name ? <p className="text-xs text-[var(--danger)]">{fieldErrors.name}</p> : null}
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="edit-calories">Calories</Label>
          <Input
            id="edit-calories"
            inputMode="numeric"
            className={fieldErrors.calories ? "border-[var(--danger)]" : undefined}
            value={draft.calories}
            onChange={(event) => updateNumber("calories", event.target.value)}
          />
          {fieldErrors.calories ? <p className="text-xs text-[var(--danger)]">{fieldErrors.calories}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-protein">Protein</Label>
          <Input
            id="edit-protein"
            inputMode="numeric"
            className={fieldErrors.protein ? "border-[var(--danger)]" : undefined}
            value={draft.protein}
            onChange={(event) => updateNumber("protein", event.target.value)}
          />
          {fieldErrors.protein ? <p className="text-xs text-[var(--danger)]">{fieldErrors.protein}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-carbs">Carbs</Label>
          <Input
            id="edit-carbs"
            inputMode="numeric"
            className={fieldErrors.carbs ? "border-[var(--danger)]" : undefined}
            value={draft.carbs}
            onChange={(event) => updateNumber("carbs", event.target.value)}
          />
          {fieldErrors.carbs ? <p className="text-xs text-[var(--danger)]">{fieldErrors.carbs}</p> : null}
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-fat">Fat</Label>
          <Input
            id="edit-fat"
            inputMode="numeric"
            className={fieldErrors.fat ? "border-[var(--danger)]" : undefined}
            value={draft.fat}
            onChange={(event) => updateNumber("fat", event.target.value)}
          />
          {fieldErrors.fat ? <p className="text-xs text-[var(--danger)]">{fieldErrors.fat}</p> : null}
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-serving">Serving estimate</Label>
        <Textarea
          id="edit-serving"
          rows={2}
          value={draft.servingEstimate}
          onChange={(event) => setDraft((prev) => ({ ...prev, servingEstimate: event.target.value }))}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="edit-items">Food items</Label>
        <Textarea
          id="edit-items"
          rows={2}
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
        <Textarea
          id="edit-notes"
          rows={2}
          value={draft.notes}
          onChange={(event) => setDraft((prev) => ({ ...prev, notes: event.target.value }))}
        />
      </div>
      {error ? <p className="text-sm text-[var(--danger)]">{error}</p> : null}
      <div className="flex gap-2">
        <Button type="button" onClick={saveEditingMeal} disabled={isSaving || !isDirty}>
          {isSaving ? "Saving edit" : "Save edit"}
        </Button>
        <Button type="button" variant="secondary" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </section>
  );
}
