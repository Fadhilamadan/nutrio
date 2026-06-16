"use client";

import { useEffect } from "react";
import { SessionProvider, useSession } from "next-auth/react";

import { clearNutrioApiKeys } from "@/lib/utils";

function SessionWatcher({ children }: { children: React.ReactNode }) {
  const { status } = useSession();

  useEffect(() => {
    if (status !== "unauthenticated") return;
    clearNutrioApiKeys();
  }, [status]);

  return <>{children}</>;
}

type AppSessionProviderProps = {
  children: React.ReactNode;
};

export function AppSessionProvider({ children }: AppSessionProviderProps) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  return (
    <SessionProvider refetchInterval={15 * 60} refetchOnWindowFocus={true}>
      <SessionWatcher>{children}</SessionWatcher>
    </SessionProvider>
  );
}
