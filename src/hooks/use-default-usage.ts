"use client";

import { useCallback, useSyncExternalStore } from "react";

import type { DefaultUsage } from "@/lib/types";

const DEFAULT_SNAPSHOT_LIMIT = Number(process.env.NEXT_PUBLIC_DEFAULT_AI_SNAPSHOT_LIMIT ?? 5);

function defaultUsageKey(userId: string) {
  return `nutrio-default-usage:${userId}`;
}

function readUsage(userId: string): DefaultUsage | null {
  try {
    const raw = window.localStorage.getItem(defaultUsageKey(userId));
    if (raw) return JSON.parse(raw) as DefaultUsage;
  } catch {
    console.warn("localStorage unavailable (private browsing / quota exceeded)");
  }
  return null;
}

function writeUsage(userId: string, usage: DefaultUsage) {
  try {
    window.localStorage.setItem(defaultUsageKey(userId), JSON.stringify(usage));
  } catch {
    console.warn("localStorage unavailable (private browsing / quota exceeded)");
  }
}

// Module-level cache guarantees referential stability across renders.
// keyed by userId, invalidated whenever localStorage is written.
const cache = new Map<string, DefaultUsage | null>();

function getCached(userId: string): DefaultUsage | null {
  const cached = cache.get(userId);
  if (cached !== undefined) return cached;

  const stored = readUsage(userId);
  cache.set(userId, stored);
  return stored;
}

function setCached(userId: string, value: DefaultUsage | null) {
  cache.set(userId, value);
}

function deleteCached(userId: string) {
  cache.delete(userId);
}

function emitUsageChange() {
  window.dispatchEvent(new CustomEvent("nutrio-usage-change"));
}

export function useDefaultUsage(userId: string | null) {
  const subscribe = useCallback((callback: () => void) => {
    window.addEventListener("nutrio-usage-change", callback);
    return () => {
      window.removeEventListener("nutrio-usage-change", callback);
    };
  }, []);
  const getSnapshot = useCallback((): DefaultUsage | null => {
    if (!userId) return null;

    const usage = getCached(userId);
    if (usage) return usage;

    // First visit for this user — initialise and cache.
    const initial: DefaultUsage = { remaining: DEFAULT_SNAPSHOT_LIMIT, limit: DEFAULT_SNAPSHOT_LIMIT };
    writeUsage(userId, initial);
    setCached(userId, initial);
    return initial;
  }, [userId]);

  const usage = useSyncExternalStore(subscribe, getSnapshot, () => null);

  const decrementUsage = useCallback(() => {
    if (!userId) return;
    const current = getCached(userId);
    if (!current) return;
    const next = { ...current, remaining: Math.max(0, current.remaining - 1) };
    writeUsage(userId, next);
    setCached(userId, next);
    emitUsageChange();
  }, [userId]);

  const clearUsage = useCallback(() => {
    if (!userId) return;
    try {
      window.localStorage.removeItem(defaultUsageKey(userId));
    } catch {
      console.warn("localStorage unavailable (private browsing / quota exceeded)");
    }
    deleteCached(userId);
    emitUsageChange();
  }, [userId]);

  return { usage, decrementUsage, clearUsage };
}
