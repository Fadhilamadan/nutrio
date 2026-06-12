"use client";

import type { ChangeEvent } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { AnalysisResult } from "@/lib/types";

type AIAnalysisResultEditorProps = {
  result: AnalysisResult;
  onChange: (result: AnalysisResult) => void;
};

export function AIAnalysisResultEditor({ result, onChange }: AIAnalysisResultEditorProps) {
  function updateNumber(field: keyof Pick<AnalysisResult, "calories" | "protein" | "carbs" | "fat">, value: string) {
    onChange({ ...result, [field]: Number(value) || 0 });
  }

  function updateText(field: keyof Pick<AnalysisResult, "name" | "servingEstimate" | "notes">, value: string) {
    onChange({ ...result, [field]: value });
  }

  function updateItems(event: ChangeEvent<HTMLInputElement>) {
    onChange({
      ...result,
      items: event.target.value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    });
  }

  return (
    <section className="surface-card space-y-4 rounded-xl p-5">
      <div>
        <h2 className="text-lg font-bold text-[var(--ink)]">Editable AI result</h2>
        <p className="text-sm text-[var(--ink-muted)]">Review before saving metadata to Notion.</p>
      </div>
      <div className="space-y-2">
        <Label htmlFor="meal-name">Meal name</Label>
        <Input id="meal-name" value={result.name} onChange={(event) => updateText("name", event.target.value)} />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-2">
          <Label htmlFor="calories">Calories</Label>
          <Input
            id="calories"
            inputMode="numeric"
            value={result.calories}
            onChange={(event) => updateNumber("calories", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="protein">Protein</Label>
          <Input
            id="protein"
            inputMode="numeric"
            value={result.protein}
            onChange={(event) => updateNumber("protein", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="carbs">Carbs</Label>
          <Input
            id="carbs"
            inputMode="numeric"
            value={result.carbs}
            onChange={(event) => updateNumber("carbs", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fat">Fat</Label>
          <Input
            id="fat"
            inputMode="numeric"
            value={result.fat}
            onChange={(event) => updateNumber("fat", event.target.value)}
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="serving">Serving estimate</Label>
        <Input
          id="serving"
          value={result.servingEstimate}
          onChange={(event) => updateText("servingEstimate", event.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="items">Food items</Label>
        <Input id="items" value={result.items.join(", ")} onChange={updateItems} />
      </div>
      <div className="space-y-2">
        <Label htmlFor="notes">Notes</Label>
        <Input id="notes" value={result.notes} onChange={(event) => updateText("notes", event.target.value)} />
      </div>
    </section>
  );
}
