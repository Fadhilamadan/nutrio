"use client";

import { useEffect } from "react";
import { SessionProvider } from "next-auth/react";

type AppSessionProviderProps = {
  children: React.ReactNode;
};

export function AppSessionProvider({ children }: AppSessionProviderProps) {
  useEffect(() => {
    if (!("serviceWorker" in navigator)) return;
    void navigator.serviceWorker.register("/sw.js").catch(() => undefined);
  }, []);

  return <SessionProvider>{children}</SessionProvider>;
}
