"use client";

import { motion } from "framer-motion";

import { SettingsForm } from "@/features/settings/components/settings-form";
import type { Settings } from "@/lib/types";

type SettingsScreenProps = {
  settings: Settings;
  canInstallPwa: boolean;
  onInstallPwa: () => void;
  onRequestNotifications: () => void;
  onSave: (settings: Settings) => Promise<void> | void;
};

export function SettingsScreen({
  settings,
  canInstallPwa,
  onInstallPwa,
  onRequestNotifications,
  onSave,
}: SettingsScreenProps) {
  const formKey = `${settings.aiModel}:${settings.notifications}:${settings.pwaInstalled}:${settings.theme}`;

  return (
    <motion.section
      className="space-y-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
    >
      <div className="surface-card rounded-xl p-5">
        <h2 className="text-xl font-bold tracking-[-0.025em] text-[var(--ink)]">AI, PWA, and privacy</h2>
        <p className="mt-2 text-sm leading-6 text-[var(--ink-muted)]">
          API keys stay in this browser, while Notion stores only settings metadata. Select your preferred AI provider
          below.
        </p>
      </div>
      <SettingsForm
        key={formKey}
        settings={settings}
        canInstallPwa={canInstallPwa}
        onInstallPwa={onInstallPwa}
        onRequestNotifications={onRequestNotifications}
        onSave={onSave}
      />
    </motion.section>
  );
}
