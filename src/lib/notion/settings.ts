import type { AiProviderName } from "@/lib/ai";
import { AI_PROVIDERS } from "@/lib/ai";
import { getNotionDataSourceId, notion, notionDatabaseIds } from "@/lib/notion/client";
import type { NotionPage } from "@/lib/notion/properties";
import {
  checkbox,
  isPage,
  richText,
  select,
  selectProperty,
  textProperty,
  titleProperty,
} from "@/lib/notion/properties";
import type { Settings } from "@/lib/types";

type SettingsRecord = Settings & { id: string; userId: string };

const themes: Settings["theme"][] = ["System", "Light", "Dark"];
const fallbackSettings: Settings = {
  aiProvider: "OpenRouter",
  aiModel: process.env.OPENROUTER_DEFAULT_MODEL ?? "openrouter/free",
  apiKey: "",
  notifications: true,
  pwaInstalled: false,
  theme: "System",
};

function toProvider(value: string): AiProviderName {
  if (AI_PROVIDERS.includes(value as AiProviderName)) {
    return value as AiProviderName;
  }
  return "OpenRouter";
}

function toTheme(value: string): Settings["theme"] {
  return themes.find((theme) => theme === value) ?? "System";
}

function toSettings(page: NotionPage): SettingsRecord {
  const properties = page.properties;

  return {
    id: page.id,
    userId: richText(properties, "UserID"),
    aiProvider: toProvider(select(properties, "AIProvider")),
    aiModel: richText(properties, "AIModel") || fallbackSettings.aiModel,
    apiKey: "",
    notifications: checkbox(properties, "NotificationEnabled"),
    pwaInstalled: checkbox(properties, "PWAInstalled"),
    theme: toTheme(select(properties, "Theme")),
  };
}

function settingsProperties(userId: string, settings: Settings) {
  return {
    Name: titleProperty(`${userId} Settings`),
    UserID: textProperty(userId),
    AIProvider: selectProperty(settings.aiProvider),
    AIModel: textProperty(settings.aiModel),
    HasAPIKey: { checkbox: Boolean(settings.apiKey) },
    NotificationEnabled: { checkbox: settings.notifications },
    PWAInstalled: { checkbox: settings.pwaInstalled },
    Theme: selectProperty(settings.theme),
  };
}

export async function getSettings(userId: string): Promise<SettingsRecord | null> {
  const dataSourceId = await getNotionDataSourceId(notionDatabaseIds.settings);
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: { property: "UserID", rich_text: { equals: userId } },
    page_size: 1,
  });

  const page = response.results.find(isPage);
  return page ? toSettings(page) : null;
}

export async function upsertSettings(userId: string, settings: Settings): Promise<SettingsRecord> {
  const [existing, dataSourceId] = await Promise.all([
    getSettings(userId),
    getNotionDataSourceId(notionDatabaseIds.settings),
  ]);
  const properties = settingsProperties(userId, settings);
  const response = existing
    ? await notion.pages.update({ page_id: existing.id, properties })
    : await notion.pages.create({ parent: { data_source_id: dataSourceId }, properties });

  if (!isPage(response)) throw new Error("Notion did not return a settings page.");
  return toSettings(response);
}

export function defaultSettings(): Settings {
  return { ...fallbackSettings };
}
