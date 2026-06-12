"use client";

import { useEffect, useState } from "react";

import { getMeals } from "@/lib/api";
import type { Meal, User } from "@/lib/types";

function todayDateParam() {
  return new Date().toISOString().slice(0, 10);
}

export function useTodayMeals(activeUser: User | null) {
  const [todayMeals, setTodayMeals] = useState<Meal[]>([]);
  const [todayError, setTodayError] = useState("");
  const [isLoadingToday, setIsLoadingToday] = useState(true);

  useEffect(() => {
    if (!activeUser) return;
    let active = true;

    getMeals({ date: todayDateParam(), limit: 100 })
      .then((page) => {
        if (!active) return;
        setTodayError("");
        setTodayMeals(page.items);
      })
      .catch((error: Error) => {
        if (active) setTodayError(error.message);
      })
      .finally(() => {
        if (active) setIsLoadingToday(false);
      });

    return () => {
      active = false;
    };
  }, [activeUser]);

  function prependTodayMeal(meal: Meal) {
    setTodayMeals((current) => [meal, ...current]);
  }

  function updateTodayMeal(meal: Meal) {
    setTodayMeals((current) => current.map((item) => (item.id === meal.id ? meal : item)));
  }

  function removeTodayMeal(id: string) {
    setTodayMeals((current) => current.filter((item) => item.id !== id));
  }

  return {
    todayMeals,
    todayError,
    isLoadingToday,
    prependTodayMeal,
    updateTodayMeal,
    removeTodayMeal,
  };
}
