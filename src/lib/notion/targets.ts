import { getNotionDataSourceId, notion, notionDatabaseIds } from "@/lib/notion/client";
import type { NotionPage } from "@/lib/notion/properties";
import { date, isPage, number, richText, textProperty, titleProperty } from "@/lib/notion/properties";
import type { Targets } from "@/lib/types";

type TargetRecord = Targets & { id: string; userId: string; updatedAt: string };

function toTargets(page: NotionPage): TargetRecord {
  const properties = page.properties;

  return {
    id: page.id,
    userId: richText(properties, "UserID"),
    calories: number(properties, "DailyCalories"),
    protein: number(properties, "DailyProtein"),
    carbs: number(properties, "DailyCarbs"),
    fat: number(properties, "DailyFat"),
    updatedAt: date(properties, "UpdatedAt"),
  };
}

function targetProperties(userId: string, targets: Targets) {
  return {
    Name: titleProperty(`${userId} Targets`),
    UserID: textProperty(userId),
    DailyCalories: { number: targets.calories },
    DailyProtein: { number: targets.protein },
    DailyCarbs: { number: targets.carbs },
    DailyFat: { number: targets.fat },
    UpdatedAt: { date: { start: new Date().toISOString() } },
  };
}

export async function getTargets(userId: string): Promise<TargetRecord | null> {
  const dataSourceId = await getNotionDataSourceId(notionDatabaseIds.targets);
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: { property: "UserID", rich_text: { equals: userId } },
    page_size: 1,
  });

  const page = response.results.find(isPage);
  return page ? toTargets(page) : null;
}

export async function upsertTargets(userId: string, targets: Targets): Promise<TargetRecord> {
  const [existing, dataSourceId] = await Promise.all([
    getTargets(userId),
    getNotionDataSourceId(notionDatabaseIds.targets),
  ]);
  const properties = targetProperties(userId, targets);
  const response = existing
    ? await notion.pages.update({ page_id: existing.id, properties })
    : await notion.pages.create({ parent: { data_source_id: dataSourceId }, properties });

  if (!isPage(response)) throw new Error("Notion did not return a targets page.");
  return toTargets(response);
}
