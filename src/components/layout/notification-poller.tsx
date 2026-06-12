"use client";

import { useEffect, useRef } from "react";

import type { Meal, Targets } from "@/lib/types";

function buildNotificationBody(meals: Meal[], targets: Targets) {
  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + meal.calories,
      protein: acc.protein + meal.protein,
      carbs: acc.carbs + meal.carbs,
      fat: acc.fat + meal.fat,
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );
  const remaining = {
    protein: Math.max(0, targets.protein - totals.protein),
    carbs: Math.max(0, targets.carbs - totals.carbs),
    fat: Math.max(0, targets.fat - totals.fat),
  };
  const parts: string[] = [];
  if (remaining.protein > 0) parts.push(`${remaining.protein}g protein`);
  if (remaining.carbs > 0) parts.push(`${remaining.carbs}g carbs`);
  if (remaining.fat > 0) parts.push(`${remaining.fat}g fat`);
  if (parts.length === 0) return "All macros met today! Great work.";
  return `You still need ${parts.join(", ")} today.`;
}

type NotificationPollerProps = {
  notificationsEnabled: boolean;
  reminderTime: string | undefined;
  meals: Meal[];
  targets: Targets | null;
};

export function NotificationPoller({ notificationsEnabled, reminderTime, meals, targets }: NotificationPollerProps) {
  const lastNotifiedRef = useRef("");

  useEffect(() => {
    if (
      !notificationsEnabled ||
      !reminderTime ||
      typeof Notification === "undefined" ||
      Notification.permission !== "granted"
    )
      return;

    const [hours, minutes] = reminderTime.split(":").map(Number);

    const interval = window.setInterval(() => {
      const now = new Date();
      const todayKey = now.toISOString().slice(0, 10);
      if (now.getHours() === hours && now.getMinutes() === minutes && lastNotifiedRef.current !== todayKey) {
        lastNotifiedRef.current = todayKey;
        const body = targets ? buildNotificationBody(meals, targets) : "Did you log your meals today?";
        new Notification("Nutrio reminder", { body });
      }
    }, 60_000);

    return () => window.clearInterval(interval);
  }, [notificationsEnabled, reminderTime, meals, targets]);

  return null;
}
