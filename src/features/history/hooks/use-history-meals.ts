"use client";

import { useEffect, useState, useTransition } from "react";

import { getMeals } from "@/lib/api";
import type { Meal, User } from "@/lib/types";

const HISTORY_PAGE_SIZE = 50;

function mergeMeals(current: Meal[], nextMeals: Meal[]) {
  const mealMap = new Map(current.map((meal) => [meal.id, meal]));
  nextMeals.forEach((meal) => mealMap.set(meal.id, meal));
  return Array.from(mealMap.values());
}

export function useHistoryMeals(activeUser: User | null) {
  const [historyMeals, setHistoryMeals] = useState<Meal[]>([]);
  const [historyQuery, setHistoryQuery] = useState("");
  const [historyNextCursor, setHistoryNextCursor] = useState<string | null>(null);
  const [historyHasMore, setHistoryHasMore] = useState(false);
  const [isLoadingMoreHistory, startLoadMore] = useTransition();
  const [historyError, setHistoryError] = useState("");
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    if (!activeUser) return;
    let active = true;

    getMeals({ limit: HISTORY_PAGE_SIZE })
      .then((page) => {
        if (!active) return;
        setHistoryError("");
        setHistoryMeals(page.items);
        setHistoryNextCursor(page.nextCursor);
        setHistoryHasMore(page.hasMore);
      })
      .catch((error: Error) => {
        if (active) setHistoryError(error.message);
      })
      .finally(() => {
        if (active) setIsLoadingHistory(false);
      });

    return () => {
      active = false;
    };
  }, [activeUser]);

  function refreshHistory(query: string) {
    setHistoryQuery(query);
    startLoadMore(async () => {
      try {
        const page = await getMeals({ limit: HISTORY_PAGE_SIZE, query: query.trim() || undefined });
        setHistoryError("");
        setHistoryMeals(page.items);
        setHistoryNextCursor(page.nextCursor);
        setHistoryHasMore(page.hasMore);
      } catch (error) {
        setHistoryError(error instanceof Error ? error.message : "Failed to load meal history.");
      }
    });
  }

  function loadMoreHistory() {
    if (!historyHasMore || !historyNextCursor || isLoadingMoreHistory) return;
    startLoadMore(async () => {
      try {
        const page = await getMeals({
          limit: HISTORY_PAGE_SIZE,
          cursor: historyNextCursor,
          query: historyQuery.trim() || undefined,
        });
        setHistoryError("");
        setHistoryMeals((current) => mergeMeals(current, page.items));
        setHistoryNextCursor(page.nextCursor);
        setHistoryHasMore(page.hasMore);
      } catch (error) {
        setHistoryError(error instanceof Error ? error.message : "Failed to load more meal history.");
      }
    });
  }

  function prependHistoryMeal(meal: Meal) {
    setHistoryMeals((current) => [meal, ...current]);
  }

  function updateHistoryMeal(meal: Meal) {
    setHistoryMeals((current) => current.map((item) => (item.id === meal.id ? meal : item)));
  }

  function removeHistoryMeal(id: string) {
    setHistoryMeals((current) => current.filter((item) => item.id !== id));
  }

  return {
    historyMeals,
    historyQuery,
    historyHasMore,
    isLoadingMoreHistory,
    historyError,
    isLoadingHistory,
    refreshHistory,
    loadMoreHistory,
    prependHistoryMeal,
    updateHistoryMeal,
    removeHistoryMeal,
  };
}
