"use client";

import { useState } from "react";
import { Bell, KeyRound, Smartphone } from "lucide-react";

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
  canInstallPwa: boolean;
  onInstallPwa: () => void;
  onRequestNotifications: () => void;
  onSave: (settings: Settings) => Promise<void> | void;
};

const providerTips: Record<AiProviderName, string> = {
  Gemini: "Gemini 2.5 Flash: 1,500 req/day free, no credit card required.",
  Groq: "Groq: 14,400 req/day free tier. Llama 4 / Pixtral vision models.",
  OpenRouter: "Access many free models via openrouter/free. Single API key for multiple providers.",
  HuggingFace: "Free Inference API, rate-limited, no credit card required.",
  Mistral: "Pixtral vision model. 1B tokens/month free, 5 RPM rate limit.",
};

export function SettingsForm({
  settings,
  canInstallPwa,
  onInstallPwa,
  onRequestNotifications,
  onSave,
}: SettingsFormProps) {
  const [draftSettings, setDraftSettings] = useState(settings);
  const [saveError, setSaveError] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const notificationPermission = typeof Notification === "undefined" ? "unsupported" : Notification.permission;

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
    setDraftSettings((current) => ({ ...current, aiProvider: provider, apiKey: "" }));
  }

  return (
    <form className="surface-card space-y-5 rounded-xl p-5">
      <div className="surface-soft rounded-xl p-4 text-sm leading-6">
        <p className="font-semibold text-[var(--ink)]">AI Provider &mdash; bring your own key</p>
        <p className="mt-1 text-[var(--ink-muted)]">
          Nutrio does not bundle API costs. Choose a provider and enter your own API key. Keys are stored in your
          browser only.
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
      </div>
      <div className="surface-soft rounded-xl p-4 text-sm">
        <KeyRound className="mb-2 size-4 text-[var(--primary)]" />
        Raw API keys are not saved to Notion. Only a HasAPIKey flag belongs in metadata.
      </div>
      <div className="space-y-2">
        <Label htmlFor="theme">Theme</Label>
        <Select
          value={draftSettings.theme}
          onValueChange={(value: Settings["theme"]) => setDraftSettings((current) => ({ ...current, theme: value }))}
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
      <div className="surface-soft space-y-3 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-[var(--ink)]">Notifications</p>
            <p className="text-sm text-[var(--ink-muted)]">Daily reminders while Nutrio is open</p>
          </div>
          <Switch
            aria-label="Enable daily macro reminders"
            checked={draftSettings.notifications}
            onCheckedChange={(checked) => setDraftSettings((current) => ({ ...current, notifications: checked }))}
          />
        </div>
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
      </div>
      <div className="surface-soft flex items-center justify-between rounded-xl p-4">
        <div>
          <p className="font-semibold text-[var(--ink)]">PWA Installation</p>
          <p className="text-sm text-[var(--ink-muted)]">Install prompt is shown when supported by the browser.</p>
        </div>
        <Button type="button" variant="secondary" size="sm" onClick={onInstallPwa} disabled={!canInstallPwa}>
          {settings.pwaInstalled ? "Installed" : "Install"}
          <Smartphone className="size-4" />
        </Button>
      </div>
      {saveError ? <p className="text-sm text-[var(--danger)]">{saveError}</p> : null}
      <Button type="button" className="w-full" onClick={saveSettings} disabled={isSaving}>
        {isSaving ? "Saving settings" : "Save settings"}
      </Button>
    </form>
  );
}
