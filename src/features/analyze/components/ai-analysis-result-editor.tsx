"use client";

import { type ChangeEvent, forwardRef, useImperativeHandle, useState } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { AnalysisResult } from "@/lib/types";

type AIAnalysisResultEditorProps = {
  result: AnalysisResult;
  originalResult: AnalysisResult;
  onChange: (result: AnalysisResult) => void;
};

export type AIAnalysisResultEditorHandle = {
  validate: () => boolean;
};

export const AIAnalysisResultEditor = forwardRef<AIAnalysisResultEditorHandle, AIAnalysisResultEditorProps>(
  function AIAnalysisResultEditor({ result, originalResult, onChange }, ref) {
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof AnalysisResult, string>>>({});

    const isDirty =
      result.name !== originalResult.name ||
      result.calories !== originalResult.calories ||
      result.protein !== originalResult.protein ||
      result.carbs !== originalResult.carbs ||
      result.fat !== originalResult.fat ||
      result.servingEstimate !== originalResult.servingEstimate ||
      result.notes !== originalResult.notes ||
      JSON.stringify(result.items) !== JSON.stringify(originalResult.items);

    useImperativeHandle(ref, () => ({
      validate() {
        const errors: Partial<Record<keyof AnalysisResult, string>> = {};
        if (!result.name.trim()) errors.name = "Meal name is required";
        if (!result.calories || result.calories <= 0) errors.calories = "Must be greater than 0";
        if (!result.protein || result.protein <= 0) errors.protein = "Must be greater than 0";
        if (!result.carbs || result.carbs <= 0) errors.carbs = "Must be greater than 0";
        if (!result.fat || result.fat <= 0) errors.fat = "Must be greater than 0";
        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
      },
    }));

    function updateNumber(field: keyof Pick<AnalysisResult, "calories" | "protein" | "carbs" | "fat">, value: string) {
      onChange({ ...result, [field]: Number(value) || 0 });
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function updateText(field: keyof Pick<AnalysisResult, "name" | "servingEstimate" | "notes">, value: string) {
      onChange({ ...result, [field]: value });
      setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    }

    function updateItems(event: ChangeEvent<HTMLTextAreaElement>) {
      onChange({
        ...result,
        items: event.target.value
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),
      });
    }

    return (
      <section className="surface-card rounded-xl p-5">
        <div className="flex items-center gap-2">
          <div className="flex-1">
            <h2 className="text-lg font-bold text-[var(--ink)]">Editable AI result</h2>
            <p className="text-sm text-[var(--ink-muted)]">Review before saving metadata to Notion.</p>
            <p className="mt-1 text-xs text-[var(--ink-muted)]">Results are AI estimates — always verify accuracy.</p>
          </div>
          {isDirty ? (
            <span className="inline-flex animate-pulse items-center gap-1 rounded-full bg-[var(--warning)]/15 px-2.5 py-0.5 text-xs font-medium text-[var(--warning)]">
              <span className="size-1.5 rounded-full bg-[var(--warning)]" />
              Unsaved
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--primary)]/10 px-2.5 py-0.5 text-xs font-medium text-[var(--primary)]">
              From AI
            </span>
          )}
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="meal-name">Meal name</Label>
          <Input
            id="meal-name"
            className={fieldErrors.name ? "border-[var(--danger)]" : undefined}
            value={result.name}
            onChange={(event) => updateText("name", event.target.value)}
          />
          {fieldErrors.name ? <p className="text-xs text-[var(--danger)]">{fieldErrors.name}</p> : null}
        </div>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="calories">Calories</Label>
            <Input
              id="calories"
              inputMode="numeric"
              className={fieldErrors.calories ? "border-[var(--danger)]" : undefined}
              value={result.calories}
              onChange={(event) => updateNumber("calories", event.target.value)}
            />
            {fieldErrors.calories ? <p className="text-xs text-[var(--danger)]">{fieldErrors.calories}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="protein">Protein</Label>
            <Input
              id="protein"
              inputMode="numeric"
              className={fieldErrors.protein ? "border-[var(--danger)]" : undefined}
              value={result.protein}
              onChange={(event) => updateNumber("protein", event.target.value)}
            />
            {fieldErrors.protein ? <p className="text-xs text-[var(--danger)]">{fieldErrors.protein}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="carbs">Carbs</Label>
            <Input
              id="carbs"
              inputMode="numeric"
              className={fieldErrors.carbs ? "border-[var(--danger)]" : undefined}
              value={result.carbs}
              onChange={(event) => updateNumber("carbs", event.target.value)}
            />
            {fieldErrors.carbs ? <p className="text-xs text-[var(--danger)]">{fieldErrors.carbs}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="fat">Fat</Label>
            <Input
              id="fat"
              inputMode="numeric"
              className={fieldErrors.fat ? "border-[var(--danger)]" : undefined}
              value={result.fat}
              onChange={(event) => updateNumber("fat", event.target.value)}
            />
            {fieldErrors.fat ? <p className="text-xs text-[var(--danger)]">{fieldErrors.fat}</p> : null}
          </div>
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="serving">Serving estimate</Label>
          <Textarea
            id="serving"
            rows={2}
            value={result.servingEstimate}
            onChange={(event) => updateText("servingEstimate", event.target.value)}
          />
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="items">Food items</Label>
          <Textarea id="items" rows={2} value={result.items.join(", ")} onChange={updateItems} />
        </div>
        <div className="mt-4 space-y-2">
          <Label htmlFor="notes">Notes</Label>
          <Textarea
            id="notes"
            rows={2}
            value={result.notes}
            onChange={(event) => updateText("notes", event.target.value)}
          />
        </div>
      </section>
    );
  },
);
