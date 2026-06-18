"use client";

import { motion } from "framer-motion";

import { SettingsForm } from "@/features/settings/components/settings-form";
import type { AiProviderName } from "@/lib/ai";
import type { Settings } from "@/lib/types";

type SettingsScreenProps = {
  settings: Settings;
  defaultModels: Record<AiProviderName, string> | null;
  canInstallPwa: boolean;
  onInstallPwa: () => void;
  onSave: (settings: Settings) => Promise<void> | void;
};

export function SettingsScreen({ settings, defaultModels, canInstallPwa, onInstallPwa, onSave }: SettingsScreenProps) {
  const formKey = `${settings.aiModel}:${settings.pwaInstalled}:${settings.theme}`;

  return (
    <motion.section
      className="space-y-5"
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
    >
      <SettingsForm
        key={formKey}
        settings={settings}
        defaultModels={defaultModels}
        canInstallPwa={canInstallPwa}
        onInstallPwa={onInstallPwa}
        onSave={onSave}
      />
    </motion.section>
  );
}
