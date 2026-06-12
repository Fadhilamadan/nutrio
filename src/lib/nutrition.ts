import { dateKey, displayMealDate } from "@/lib/date";
import type { MacroSummary, Meal } from "@/lib/types";

export function totalMeals(meals: Meal[]): MacroSummary {
  return meals.reduce(
    (totals, meal) => ({
      calories: totals.calories + meal.calories,
      protein: totals.protein + meal.protein,
      carbs: totals.carbs + meal.carbs,
      fat: totals.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
}

export function groupMealsByDate(meals: Meal[]) {
  return meals.reduce<Record<string, { label: string; meals: Meal[] }>>((groups, meal) => {
    const key = dateKey(meal.date);
    if (!key) return groups;
    const group = groups[key] ?? { label: displayMealDate(key), meals: [] };
    groups[key] = { ...group, meals: [...group.meals, meal] };
    return groups;
  }, {});
}
