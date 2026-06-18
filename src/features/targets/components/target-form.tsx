"use client";

import { useState, useTransition } from "react";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ageSchema, bodyFatSchema, heightSchema, weightSchema } from "@/lib/schemas";
import type { Targets } from "@/lib/types";

type TargetFormProps = {
  targets: Targets | null;
  onSave: (targets: Targets) => Promise<void> | void;
};

type Sex = "male" | "female";
type Activity = "sedentary" | "light" | "moderate" | "active" | "very-active";
type Goal = "lose" | "maintain" | "gain";

const emptyTargets: Targets = { calories: 0, protein: 0, carbs: 0, fat: 0 };

const activityDetails: Record<Activity, { label: string; description: string }> = {
  sedentary: { label: "Sedentary", description: "Desk job, little to no exercise" },
  light: { label: "Light", description: "Light exercise 1–3 days/week" },
  moderate: { label: "Moderate", description: "Moderate exercise 3–5 days/week" },
  active: { label: "Active", description: "Hard exercise 6–7 days/week" },
  "very-active": { label: "Very active", description: "Intense daily exercise or physical job" },
};

const goalDetails: Record<Goal, { label: string; description: string }> = {
  lose: { label: "Lose weight", description: "15% calorie deficit" },
  maintain: { label: "Maintain", description: "Calorie maintenance" },
  gain: { label: "Gain muscle", description: "10% calorie surplus" },
};

const activityMultipliers: Record<Activity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  "very-active": 1.9,
};

const goalAdjustments: Record<Goal, number> = {
  lose: 0.85,
  maintain: 1,
  gain: 1.1,
};

export function TargetForm({ targets, onSave }: TargetFormProps) {
  const [draftTargets, setDraftTargets] = useState(targets ?? emptyTargets);
  const [saveError, setSaveError] = useState("");
  const [isSaving, startSave] = useTransition();
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof Targets, string>>>({});
  const [calculatorErrors, setCalculatorErrors] = useState<Partial<Record<string, string>>>({});
  const [showCalculator, setShowCalculator] = useState(!targets);
  const [age, setAge] = useState(31);
  const [sex, setSex] = useState<Sex>("male");
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(60);
  const [activity, setActivity] = useState<Activity>("moderate");
  const [goal, setGoal] = useState<Goal>("gain");
  const [bodyFat, setBodyFat] = useState("");

  function updateNumber(field: keyof Targets, value: string) {
    setDraftTargets((currentTargets) => ({ ...currentTargets, [field]: value === "" ? 0 : Number(value) }));
    setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  function calculateTargets() {
    const errors: Partial<Record<string, string>> = {};
    const ageResult = ageSchema.safeParse(age);
    if (!ageResult.success) errors.age = ageResult.error.issues[0].message;
    const heightResult = heightSchema.safeParse(height);
    if (!heightResult.success) errors.height = heightResult.error.issues[0].message;
    const weightResult = weightSchema.safeParse(weight);
    if (!weightResult.success) errors.weight = weightResult.error.issues[0].message;
    if (bodyFat !== "") {
      const bfResult = bodyFatSchema.safeParse(bodyFat);
      if (!bfResult.success) errors.bodyFat = bfResult.error.issues[0].message;
    }
    setCalculatorErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const bmr =
      sex === "male" ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;
    const calories = Math.round((bmr * activityMultipliers[activity] * goalAdjustments[goal]) / 10) * 10;
    const bf = bodyFat === "" ? undefined : Number(bodyFat);
    const leanMass = bf && !isNaN(bf) && bf > 0 ? weight * (1 - bf / 100) : weight;
    const protein = Math.round(leanMass * 2.0);
    const fat = Math.round((calories * 0.35) / 9);
    const carbs = Math.max(Math.round((calories - protein * 4 - fat * 9) / 4), 0);

    setDraftTargets(() => ({
      calories,
      protein,
      carbs,
      fat,
    }));
    setFieldErrors({});
    setShowCalculator(false);
  }

  function saveTargets() {
    setSaveError("");

    const errors: Partial<Record<keyof Targets, string>> = {};
    if (draftTargets.calories < 0) errors.calories = "Must not be negative";
    if (draftTargets.protein < 0) errors.protein = "Must not be negative";
    if (draftTargets.carbs < 0) errors.carbs = "Must not be negative";
    if (draftTargets.fat < 0) errors.fat = "Must not be negative";

    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    startSave(async () => {
      try {
        await onSave(draftTargets);
        toast.success("Targets saved");
      } catch (error) {
        const msg = error instanceof Error ? error.message : "Failed to save targets.";
        setSaveError(msg);
        toast.error(msg);
      }
    });
  }

  const isDirty = targets
    ? draftTargets.calories !== targets.calories ||
      draftTargets.protein !== targets.protein ||
      draftTargets.carbs !== targets.carbs ||
      draftTargets.fat !== targets.fat
    : draftTargets.calories > 0 || draftTargets.protein > 0 || draftTargets.carbs > 0 || draftTargets.fat > 0;

  return (
    <form className="space-y-5">
      <section className="surface-card rounded-xl p-5">
        <button
          type="button"
          className="flex w-full items-start gap-3 text-left"
          onClick={() => setShowCalculator((current) => !current)}
        >
          <div className="grid size-10 shrink-0 place-items-center rounded-full bg-[color-mix(in_srgb,var(--primary)_12%,var(--surface))] text-[var(--primary)]">
            <Calculator className="size-5" />
          </div>
          <div className="flex-1">
            <h2 className="text-lg font-bold tracking-[-0.025em] text-[var(--ink)]">Calculate a starting target</h2>
            <p className="mt-1 text-sm leading-6 text-[var(--ink-muted)]">
              Martin Berkhan&apos;s formula. Body fat (optional) for precision. Session-only.
            </p>
          </div>
          {showCalculator ? (
            <ChevronUp className="mt-1 size-5 text-[var(--ink-muted)]" />
          ) : (
            <ChevronDown className="mt-1 size-5 text-[var(--ink-muted)]" />
          )}
        </button>
        <div
          className="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
          style={{ gridTemplateRows: showCalculator ? "1fr" : "0fr" }}
        >
          <div className="min-h-0 overflow-hidden">
            <div className="mt-5 grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="tdee-age">Age</Label>
                <Input
                  id="tdee-age"
                  inputMode="numeric"
                  className={calculatorErrors.age ? "border-[var(--danger)]" : undefined}
                  value={age}
                  onChange={(event) => {
                    setAge(Number(event.target.value) || 0);
                    setCalculatorErrors((prev) => ({ ...prev, age: undefined }));
                  }}
                />
                {calculatorErrors.age ? <p className="text-xs text-[var(--danger)]">{calculatorErrors.age}</p> : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tdee-sex">Sex</Label>
                <Select value={sex} onValueChange={(value: Sex) => setSex(value)}>
                  <SelectTrigger id="tdee-sex">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tdee-height">Height, cm</Label>
                <Input
                  id="tdee-height"
                  inputMode="numeric"
                  className={calculatorErrors.height ? "border-[var(--danger)]" : undefined}
                  value={height}
                  onChange={(event) => {
                    setHeight(Number(event.target.value) || 0);
                    setCalculatorErrors((prev) => ({ ...prev, height: undefined }));
                  }}
                />
                {calculatorErrors.height ? (
                  <p className="text-xs text-[var(--danger)]">{calculatorErrors.height}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tdee-weight">Weight, kg</Label>
                <Input
                  id="tdee-weight"
                  inputMode="decimal"
                  className={calculatorErrors.weight ? "border-[var(--danger)]" : undefined}
                  value={weight}
                  onChange={(event) => {
                    setWeight(Number(event.target.value) || 0);
                    setCalculatorErrors((prev) => ({ ...prev, weight: undefined }));
                  }}
                />
                {calculatorErrors.weight ? (
                  <p className="text-xs text-[var(--danger)]">{calculatorErrors.weight}</p>
                ) : null}
              </div>
              <div className="col-span-2 space-y-2">
                <Label htmlFor="tdee-bodyfat">
                  Body fat % <span className="text-[var(--ink-muted)]">(optional)</span>
                </Label>
                <Input
                  id="tdee-bodyfat"
                  inputMode="decimal"
                  className={calculatorErrors.bodyFat ? "border-[var(--danger)]" : undefined}
                  value={bodyFat}
                  onChange={(event) => {
                    setBodyFat(event.target.value);
                    setCalculatorErrors((prev) => ({ ...prev, bodyFat: undefined }));
                  }}
                  placeholder="e.g. 15"
                />
                {calculatorErrors.bodyFat ? (
                  <p className="text-xs text-[var(--danger)]">{calculatorErrors.bodyFat}</p>
                ) : null}
              </div>
              <div className="space-y-2">
                <Label htmlFor="tdee-activity">Activity</Label>
                <Select value={activity} onValueChange={(value: Activity) => setActivity(value)}>
                  <SelectTrigger id="tdee-activity">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(activityDetails) as [Activity, (typeof activityDetails)[Activity]][]).map(
                      ([key, detail]) => (
                        <SelectItem key={key} value={key}>
                          {detail.label}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
                <p className="text-xs text-[var(--ink-muted)]">{activityDetails[activity].description}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tdee-goal">Goal</Label>
                <Select value={goal} onValueChange={(value: Goal) => setGoal(value)}>
                  <SelectTrigger id="tdee-goal">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.entries(goalDetails) as [Goal, (typeof goalDetails)[Goal]][]).map(([key, detail]) => (
                      <SelectItem key={key} value={key}>
                        {detail.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-[var(--ink-muted)]">{goalDetails[goal].description}</p>
              </div>
            </div>
            <Button type="button" className="mt-5 w-full" onClick={calculateTargets}>
              Calculate target
            </Button>
            <p className="mt-3 text-center text-xs text-[var(--ink-muted)]">30% protein · 35% fat · 35% carbs</p>
          </div>
        </div>
      </section>
      <section className="surface-card space-y-4 rounded-xl p-5">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-[var(--ink)]">Your targets</h2>
            {isDirty ? (
              <span className="animate-pulse inline-flex items-center gap-1 rounded-full bg-[var(--warning)]/15 px-2.5 py-0.5 text-xs font-medium text-[var(--warning)]">
                <span className="size-1.5 rounded-full bg-[var(--warning)]" />
                Unsaved
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">
            These are your daily nutrition targets. Adjust any value and save.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="target-calories">Calories</Label>
            <Input
              id="target-calories"
              inputMode="numeric"
              className={fieldErrors.calories ? "border-[var(--danger)]" : undefined}
              value={String(draftTargets.calories)}
              onChange={(event) => updateNumber("calories", event.target.value)}
            />
            {fieldErrors.calories ? <p className="text-xs text-[var(--danger)]">{fieldErrors.calories}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-protein">Protein</Label>
            <Input
              id="target-protein"
              inputMode="numeric"
              className={fieldErrors.protein ? "border-[var(--danger)]" : undefined}
              value={String(draftTargets.protein)}
              onChange={(event) => updateNumber("protein", event.target.value)}
            />
            {fieldErrors.protein ? <p className="text-xs text-[var(--danger)]">{fieldErrors.protein}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-carbs">Carbs</Label>
            <Input
              id="target-carbs"
              inputMode="numeric"
              className={fieldErrors.carbs ? "border-[var(--danger)]" : undefined}
              value={String(draftTargets.carbs)}
              onChange={(event) => updateNumber("carbs", event.target.value)}
            />
            {fieldErrors.carbs ? <p className="text-xs text-[var(--danger)]">{fieldErrors.carbs}</p> : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-fat">Fat</Label>
            <Input
              id="target-fat"
              inputMode="numeric"
              className={fieldErrors.fat ? "border-[var(--danger)]" : undefined}
              value={String(draftTargets.fat)}
              onChange={(event) => updateNumber("fat", event.target.value)}
            />
            {fieldErrors.fat ? <p className="text-xs text-[var(--danger)]">{fieldErrors.fat}</p> : null}
          </div>
        </div>
        {saveError ? <p className="text-sm text-[var(--danger)]">{saveError}</p> : null}
        <Button type="button" className="w-full" onClick={saveTargets} disabled={isSaving || !isDirty}>
          {isSaving ? "Saving targets" : "Save targets"}
        </Button>
      </section>
    </form>
  );
}
