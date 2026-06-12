"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, ChevronDown, ChevronUp } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Targets } from "@/lib/types";

type TargetFormProps = {
  targets: Targets | null;
  onSave: (targets: Targets) => Promise<void> | void;
};

type Sex = "male" | "female";
type Activity = "sedentary" | "light" | "moderate" | "active" | "very-active";
type Goal = "lose" | "maintain" | "gain";

const emptyTargets: Targets = { calories: 0, protein: 0, carbs: 0, fat: 0, reminderTime: "19:30" };

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
  const [showCalculator, setShowCalculator] = useState(!targets);
  const [age, setAge] = useState(30);
  const [sex, setSex] = useState<Sex>("male");
  const [height, setHeight] = useState(170);
  const [weight, setWeight] = useState(70);
  const [activity, setActivity] = useState<Activity>("moderate");
  const [goal, setGoal] = useState<Goal>("maintain");

  function updateNumber(field: keyof Omit<Targets, "reminderTime">, value: string) {
    setDraftTargets((currentTargets) => ({ ...currentTargets, [field]: Number(value) || 0 }));
  }

  function calculateTargets() {
    const bmr =
      sex === "male" ? 10 * weight + 6.25 * height - 5 * age + 5 : 10 * weight + 6.25 * height - 5 * age - 161;
    const calories = Math.round((bmr * activityMultipliers[activity] * goalAdjustments[goal]) / 10) * 10;
    const protein = Math.round(weight * 1.6);
    const fat = Math.round((calories * 0.25) / 9);
    const carbs = Math.max(Math.round((calories - protein * 4 - fat * 9) / 4), 0);

    setDraftTargets((currentTargets) => ({
      calories,
      protein,
      carbs,
      fat,
      reminderTime: currentTargets.reminderTime || "19:30",
    }));
  }

  function saveTargets() {
    setSaveError("");
    startSave(async () => {
      try {
        await onSave(draftTargets);
      } catch (error) {
        setSaveError(error instanceof Error ? error.message : "Failed to save targets.");
      }
    });
  }

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
              Age, sex, height, weight, activity, and goal stay in this browser session only.
            </p>
          </div>
          {showCalculator ? (
            <ChevronUp className="mt-1 size-5 text-[var(--ink-muted)]" />
          ) : (
            <ChevronDown className="mt-1 size-5 text-[var(--ink-muted)]" />
          )}
        </button>
        <AnimatePresence initial={false}>
          {showCalculator ? (
            <motion.div
              key="calculator"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-5 grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="tdee-age">Age</Label>
                  <Input
                    id="tdee-age"
                    inputMode="numeric"
                    value={age}
                    onChange={(event) => setAge(Number(event.target.value) || 0)}
                  />
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
                    value={height}
                    onChange={(event) => setHeight(Number(event.target.value) || 0)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tdee-weight">Weight, kg</Label>
                  <Input
                    id="tdee-weight"
                    inputMode="decimal"
                    value={weight}
                    onChange={(event) => setWeight(Number(event.target.value) || 0)}
                  />
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
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>
      <section className="surface-card space-y-4 rounded-xl p-5">
        <div>
          <h2 className="text-lg font-bold text-[var(--ink)]">Final targets</h2>
          <p className="mt-1 text-sm text-[var(--ink-muted)]">Review or edit these values before saving to Notion.</p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="target-calories">Calories</Label>
            <Input
              id="target-calories"
              inputMode="numeric"
              value={draftTargets.calories || ""}
              onChange={(event) => updateNumber("calories", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-protein">Protein</Label>
            <Input
              id="target-protein"
              inputMode="numeric"
              value={draftTargets.protein || ""}
              onChange={(event) => updateNumber("protein", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-carbs">Carbs</Label>
            <Input
              id="target-carbs"
              inputMode="numeric"
              value={draftTargets.carbs || ""}
              onChange={(event) => updateNumber("carbs", event.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="target-fat">Fat</Label>
            <Input
              id="target-fat"
              inputMode="numeric"
              value={draftTargets.fat || ""}
              onChange={(event) => updateNumber("fat", event.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reminder">Reminder time</Label>
          <Input
            id="reminder"
            type="time"
            value={draftTargets.reminderTime}
            onChange={(event) =>
              setDraftTargets((currentTargets) => ({ ...currentTargets, reminderTime: event.target.value }))
            }
          />
        </div>
        {saveError ? <p className="text-sm text-[var(--danger)]">{saveError}</p> : null}
        <Button type="button" className="w-full" onClick={saveTargets} disabled={isSaving}>
          {isSaving ? "Saving targets" : "Save targets"}
        </Button>
      </section>
    </form>
  );
}
