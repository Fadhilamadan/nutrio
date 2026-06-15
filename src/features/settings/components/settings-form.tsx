"use client";

import { useState } from "react";
import { Bell, CheckCircle, ChevronDown, Palette, Smartphone, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import type { AiProviderName } from "@/lib/ai";
import { AI_PROVIDER_LABELS, AI_PROVIDERS } from "@/lib/ai";
import type { Settings } from "@/lib/types";

type SettingsFormProps = {
  settings: Settings;
  defaultModels: Record<AiProviderName, string> | null;
  canInstallPwa: boolean;
  onInstallPwa: () => void;
  onRequestNotifications: () => void;
  onSave: (settings: Settings) => Promise<void> | void;
};

const providerTips: Record<AiProviderName, string> = {
  Gemini: "Best for beginners — 1,500 free requests daily, reliable, no credit card needed.",
  Groq: "Blazing fast responses with a generous 14,400 free requests per day.",
  OpenRouter: "One key unlocks many models including free options. Great for experimenting.",
  HuggingFace: "Open-source AI models with free tier access. Community-driven.",
  Mistral: "Privacy-focused European AI. 1 billion free tokens per month.",
};

function CollapsibleGroup({
  id,
  title,
  icon,
  isOpen,
  onToggle,
  children,
}: {
  id: string;
  title: string;
  icon: React.ReactNode;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="surface-card rounded-xl overflow-hidden">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between p-4 md:p-5 text-left cursor-pointer active:scale-[0.99] transition-transform duration-75"
      >
        <span className="flex items-center gap-2 font-semibold text-[var(--ink)]">
          {icon}
          {title}
        </span>
        <ChevronDown
          className="size-4 text-[var(--ink-muted)] transition-transform duration-200"
          style={{ rotate: isOpen ? "180deg" : "0deg" }}
        />
      </button>
      <div
        className="grid transition-[grid-template-rows] duration-200"
        style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
      >
        <div className="overflow-hidden">
          <div className="px-4 md:px-5 pb-4 md:pb-5 space-y-4">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function SettingsForm({
  settings,
  defaultModels,
  canInstallPwa,
  onInstallPwa,
  onRequestNotifications,
  onSave,
}: SettingsFormProps) {
  const [draftSettings, setDraftSettings] = useState(settings);
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [openGroups, setOpenGroups] = useState<Set<string>>(new Set(["ai", "appearance", "notifications", "app"]));
  const notificationPermission = typeof Notification === "undefined" ? "unsupported" : Notification.permission;
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const isStandalone = "standalone" in navigator && navigator.standalone;
  const pwaInstalled = settings.pwaInstalled || (isIOS && isStandalone);

  const isDirty =
    draftSettings.aiProvider !== settings.aiProvider ||
    draftSettings.aiModel !== settings.aiModel ||
    draftSettings.apiKey !== settings.apiKey ||
    draftSettings.theme !== settings.theme ||
    draftSettings.notifications !== settings.notifications;

  function toggleGroup(id: string) {
    setOpenGroups((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  async function saveSettings() {
    setSaveError("");
    setIsSaving(true);
    try {
      await onSave(draftSettings);
    } catch (error) {
      setSaveError(error instanceof Error ? error.message : "Failed to save settings.");
    } finally {
      setIsSaving(false);
    }
  }

  function changeProvider(provider: AiProviderName) {
    setDraftSettings((current) => ({
      ...current,
      aiProvider: provider,
      aiModel: defaultModels?.[provider] ?? current.aiModel,
      apiKey: "",
    }));
  }

  return (
    <form className="space-y-5">
      <div className="surface-card rounded-xl p-5">
        <div className="flex items-center gap-2">
          <h2 className="text-xl font-bold tracking-[-0.025em] text-[var(--ink)]">AI & app settings</h2>
          {isDirty ? (
            <span className="animate-pulse inline-flex items-center gap-1 rounded-full bg-[var(--warning)]/15 px-2.5 py-0.5 text-xs font-medium text-[var(--warning)]">
              <span className="size-1.5 rounded-full bg-[var(--warning)]" />
              Unsaved
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
          Configure your AI provider, theme, notifications, and app preferences. Your API key stays in your browser
          — we never upload it.
        </p>
      </div>

      <div className="space-y-4">
        <CollapsibleGroup
          id="ai"
          title="AI & Intelligence"
          icon={<Sparkles className="size-4" />}
          isOpen={openGroups.has("ai")}
          onToggle={() => toggleGroup("ai")}
        >
          <div className="bg-[var(--surface-soft)] rounded-xl p-4 text-sm leading-6">
            <p className="font-semibold text-[var(--ink)]">How AI works in Nutrio</p>
            <p className="mt-1 text-[var(--ink-muted)]">
              When you snap a food photo, Nutrio sends it to an AI provider to figure out what is on your plate. Think
              of it like choosing a GPS app — you pick the provider (Google, Groq, etc.) and bring your own key for
              access.
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="provider">AI Provider</Label>
            <Select value={draftSettings.aiProvider} onValueChange={changeProvider}>
              <SelectTrigger id="provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {AI_PROVIDERS.map((provider) => (
                  <SelectItem key={provider} value={provider}>
                    {AI_PROVIDER_LABELS[provider]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-[var(--ink-muted)]">{providerTips[draftSettings.aiProvider]}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="model">AI Model</Label>
            <Input
              id="model"
              value={draftSettings.aiModel}
              onChange={(event) => setDraftSettings((current) => ({ ...current, aiModel: event.target.value }))}
            />
            {draftSettings.aiModel === "" ? (
              <p className="text-xs text-[var(--warning)]">Enter a model name or switch to a default</p>
            ) : null}
          </div>
          <div className="space-y-2">
            <Label htmlFor="key">API Key</Label>
            <Input
              id="key"
              type="password"
              placeholder="Stored locally in browser"
              value={draftSettings.apiKey}
              onChange={(event) => setDraftSettings((current) => ({ ...current, apiKey: event.target.value }))}
            />
            {draftSettings.apiKey === "" ? (
              <p className="text-xs text-[var(--warning)]">Add an API key to use AI food analysis</p>
            ) : null}
          </div>
        </CollapsibleGroup>

        <CollapsibleGroup
          id="appearance"
          title="Appearance"
          icon={<Palette className="size-4" />}
          isOpen={openGroups.has("appearance")}
          onToggle={() => toggleGroup("appearance")}
        >
          <div className="space-y-2">
            <Label htmlFor="theme">Theme</Label>
            <Select
              value={draftSettings.theme}
              onValueChange={(value: Settings["theme"]) =>
                setDraftSettings((current) => ({ ...current, theme: value }))
              }
            >
              <SelectTrigger id="theme">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="System">System</SelectItem>
                <SelectItem value="Light">Light</SelectItem>
                <SelectItem value="Dark">Dark</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CollapsibleGroup>

        <CollapsibleGroup
          id="notifications"
          title="Notifications"
          icon={<Bell className="size-4" />}
          isOpen={openGroups.has("notifications")}
          onToggle={() => toggleGroup("notifications")}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-[var(--ink-muted)]">Daily reminders while Nutrio is open</p>
              <Switch
                aria-label="Enable daily macro reminders"
                checked={draftSettings.notifications}
                onCheckedChange={(checked) => setDraftSettings((current) => ({ ...current, notifications: checked }))}
              />
            </div>
            {isIOS ? (
              <p className="text-xs text-[var(--ink-muted)]">
                Not supported on iOS. Enable on Android or desktop for daily reminders.
              </p>
            ) : (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={onRequestNotifications}
                disabled={notificationPermission === "unsupported"}
              >
                <Bell className="size-4" />
                Permission: {notificationPermission}
              </Button>
            )}
          </div>
        </CollapsibleGroup>

        <CollapsibleGroup
          id="app"
          title="App"
          icon={<Smartphone className="size-4" />}
          isOpen={openGroups.has("app")}
          onToggle={() => toggleGroup("app")}
        >
          {isIOS ? (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-[var(--ink-muted)]">
                {pwaInstalled
                  ? "Installed from Home Screen"
                  : "Open in Safari → Share → Add to Home Screen"}
              </p>
              {pwaInstalled ? <CheckCircle className="size-5 shrink-0 text-[var(--success)]" /> : null}
            </div>
          ) : (
            <div className="flex items-center justify-between gap-4">
              <p className="text-sm text-[var(--ink-muted)]">Install Nutrio as an app for quick access</p>
              <Button type="button" variant="secondary" size="sm" onClick={onInstallPwa} disabled={!canInstallPwa}>
                {settings.pwaInstalled ? "Installed" : "Install"}
                <Smartphone className="size-4" />
              </Button>
            </div>
          )}
        </CollapsibleGroup>
      </div>

      {saveError ? <p className="text-sm text-[var(--danger)]">{saveError}</p> : null}
      <Button type="button" className="w-full active:scale-[0.98] transition-transform duration-75" onClick={saveSettings} disabled={isSaving}>
        {isSaving ? "Saving settings" : "Save settings"}
      </Button>
    </form>
  );
}
