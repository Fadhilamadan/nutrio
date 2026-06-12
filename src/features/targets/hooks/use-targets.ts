"use client";

import { useEffect, useState } from "react";

import { getTargets, saveTargets as saveTargetsApi } from "@/lib/api";
import type { Targets, User } from "@/lib/types";

export function useTargets(activeUser: User | null) {
  const [targets, setTargets] = useState<Targets | null>(null);
  const [targetsError, setTargetsError] = useState("");
  const [isLoadingTargets, setIsLoadingTargets] = useState(true);

  useEffect(() => {
    if (!activeUser) return;
    let active = true;

    getTargets()
      .then((notionTargets) => {
        if (!active) return;
        setTargetsError("");
        setTargets(notionTargets);
      })
      .catch((error: Error) => {
        if (active) setTargetsError(error.message);
      })
      .finally(() => {
        if (active) setIsLoadingTargets(false);
      });

    return () => {
      active = false;
    };
  }, [activeUser]);

  async function saveTargets(nextTargets: Targets) {
    if (!activeUser) return;
    try {
      const savedTargets = await saveTargetsApi(nextTargets);
      setTargetsError("");
      setTargets(savedTargets);
    } catch (error) {
      setTargetsError(error instanceof Error ? error.message : "Failed to save targets.");
      throw error;
    }
  }

  return { targets, targetsError, isLoadingTargets, saveTargets };
}
