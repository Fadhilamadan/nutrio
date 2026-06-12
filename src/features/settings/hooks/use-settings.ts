"use client";

import { useEffect, useState } from "react";

import type { AiProviderName } from "@/lib/ai";
import { getSettings, saveSettings as saveSettingsApi } from "@/lib/api";
import type { Settings, User } from "@/lib/types";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

function localStorageKey(userId: string, provider: AiProviderName) {
  return `nutrio-api-key:${userId}:${provider}`;
}

export function useSettings(activeUser: User | null) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [settingsError, setSettingsError] = useState("");
  const [isLoadingSettings, setIsLoadingSettings] = useState(true);
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (!activeUser) return;
    let active = true;

    getSettings()
      .then((notionSettings) => {
        if (!active) return;
        setSettingsError("");
        const provider = notionSettings.aiProvider;
        let storedApiKey = "";
        try {
          storedApiKey = window.localStorage.getItem(localStorageKey(activeUser.id, provider)) ?? "";
        } catch {
          console.warn("localStorage unavailable (private browsing / quota exceeded)");
        }
        setSettings({ ...notionSettings, apiKey: storedApiKey });
      })
      .catch((error: Error) => {
        if (active) setSettingsError(error.message);
      })
      .finally(() => {
        if (active) setIsLoadingSettings(false);
      });

    return () => {
      active = false;
    };
  }, [activeUser]);

  useEffect(() => {
    if (!settings) return;
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const isDark = settings.theme === "Dark" || (settings.theme === "System" && prefersDark);
    document.documentElement.dataset.theme = isDark ? "dark" : "light";
  }, [settings]);

  useEffect(() => {
    function handleBeforeInstallPrompt(event: Event) {
      event.preventDefault();
      setInstallPrompt(event as BeforeInstallPromptEvent);
    }

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
  }, []);
  async function saveSettings(nextSettings: Settings) {
    if (!activeUser) return;
    try {
      const savedSettings = await saveSettingsApi(nextSettings);
      try {
        window.localStorage.setItem(localStorageKey(activeUser.id, nextSettings.aiProvider), nextSettings.apiKey);
      } catch {
        console.warn("localStorage unavailable (private browsing / quota exceeded)");
      }
      setSettingsError("");
      setSettings({ ...savedSettings, apiKey: nextSettings.apiKey });
    } catch (error) {
      setSettingsError(error instanceof Error ? error.message : "Failed to save settings.");
      throw error;
    }
  }

  async function installPwa() {
    if (!installPrompt || !settings) return;
    await installPrompt.prompt();
    const choice = await installPrompt.userChoice;
    setInstallPrompt(null);
    if (choice.outcome === "accepted") await saveSettings({ ...settings, pwaInstalled: true });
  }

  async function requestNotifications() {
    if (!settings || typeof Notification === "undefined") return;
    const permission = await Notification.requestPermission();
    await saveSettings({ ...settings, notifications: permission === "granted" });
  }

  return {
    settings,
    settingsError,
    isLoadingSettings,
    installPrompt,
    saveSettings,
    installPwa,
    requestNotifications,
  };
}
