"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

import { getCurrentUser } from "@/lib/api";
import type { User } from "@/lib/types";

export function useUser() {
  const { status } = useSession();
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    if (status !== "authenticated") return;
    let active = true;

    getCurrentUser()
      .then((user) => {
        if (!active) return;
        setAuthError("");
        setActiveUser(user);
      })
      .catch((error: Error) => {
        if (active) setAuthError(error.message);
      });

    return () => {
      active = false;
    };
  }, [status]);

  return { activeUser, authError, status };
}
