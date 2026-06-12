import "server-only";
import { Client } from "@notionhq/client";

type NotionEnvKey =
  | "NOTION_TOKEN"
  | "NOTION_USERS_DB_ID"
  | "NOTION_MEALS_DB_ID"
  | "NOTION_TARGETS_DB_ID"
  | "NOTION_SETTINGS_DB_ID";

function requireEnv(key: NotionEnvKey) {
  const value = process.env[key];
  if (!value) {
    throw new Error(`${key} is required for Notion integration.`);
  }
  return value;
}

export const notion = new Client({ auth: requireEnv("NOTION_TOKEN") });

export const notionDatabaseIds = {
  users: requireEnv("NOTION_USERS_DB_ID"),
  meals: requireEnv("NOTION_MEALS_DB_ID"),
  targets: requireEnv("NOTION_TARGETS_DB_ID"),
  settings: requireEnv("NOTION_SETTINGS_DB_ID"),
};

const dataSourceIdCache = new Map<string, Promise<string>>();

function normalizeNotionId(value: string) {
  try {
    const url = new URL(value);
    const pathId = url.pathname
      .split("/")
      .toReversed()
      .find((part) => /^[a-f0-9]{32}$/i.test(part.replaceAll("-", "")));
    if (pathId) return pathId.replaceAll("-", "");
  } catch {
    console.debug("URL parse failed — assuming raw Notion ID:", value);
  }

  const match = value.replaceAll("-", "").match(/[a-f0-9]{32}/i);
  if (!match) throw new Error(`Invalid Notion ID or URL: ${value}`);
  return match[0];
}

async function resolveDataSourceId(value: string) {
  const id = normalizeNotionId(value);

  try {
    await notion.dataSources.retrieve({ data_source_id: id });
    return id;
  } catch {
    console.debug("Notion data source retrieve failed — falling back to database retrieve:", id);
    const database = await notion.databases.retrieve({ database_id: id });
    if ("data_sources" in database && database.data_sources[0]?.id) {
      return database.data_sources[0].id;
    }
  }

  throw new Error(`Notion database ${id} does not expose a data source. Check that it is shared with the integration.`);
}

export function getNotionDataSourceId(value: string) {
  const id = normalizeNotionId(value);
  const cached = dataSourceIdCache.get(id);
  if (cached) return cached;

  const resolved = resolveDataSourceId(id);
  dataSourceIdCache.set(id, resolved);
  return resolved;
}
