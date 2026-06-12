import { getNotionDataSourceId, notion, notionDatabaseIds } from "@/lib/notion/client";
import type { NotionPage } from "@/lib/notion/properties";
import {
  checkbox,
  date,
  isPage,
  number,
  richText,
  select,
  selectProperty,
  textProperty,
  title,
  titleProperty,
} from "@/lib/notion/properties";
import type { Meal, MealPage } from "@/lib/types";

const NOTION_MAX_PAGE_SIZE = 100;
const TIME_FORMATTER = new Intl.DateTimeFormat("en", { hour: "2-digit", minute: "2-digit", hour12: false });

type ListMealsInput = {
  userId?: string;
  dateFilter?: string;
  pageSize?: number;
  cursor?: string;
  query?: string;
};

function displayTime(value: string) {
  const input = value ? new Date(value) : new Date();
  return TIME_FORMATTER.format(input);
}

function mealDate(value?: string) {
  if (!value) return new Date().toISOString();
  return value;
}

function searchDate(value: string) {
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed.toISOString().slice(0, 10);
}

function parseItems(value: string) {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function toMeal(page: NotionPage): Meal {
  const properties = page.properties;
  const dateValue = date(properties, "Date");

  return {
    id: page.id,
    userId: richText(properties, "UserID"),
    name: title(properties, "MealName"),
    date: dateValue,
    time: displayTime(dateValue),
    calories: number(properties, "Calories"),
    protein: number(properties, "Protein"),
    carbs: number(properties, "Carbs"),
    fat: number(properties, "Fat"),
    servingEstimate: richText(properties, "ServingEstimate"),
    items: parseItems(richText(properties, "FoodItems")),
    confidence: number(properties, "Confidence"),
    notes: richText(properties, "Notes"),
    aiProvider: select(properties, "AIProvider"),
    editedByUser: checkbox(properties, "EditedByUser"),
  };
}

function mealProperties(meal: Omit<Meal, "id" | "time">) {
  return {
    MealName: titleProperty(meal.name),
    UserID: textProperty(meal.userId),
    Date: { date: { start: mealDate(meal.date) } },
    Calories: { number: meal.calories },
    Protein: { number: meal.protein },
    Carbs: { number: meal.carbs },
    Fat: { number: meal.fat },
    ServingEstimate: textProperty(meal.servingEstimate),
    FoodItems: textProperty(meal.items.join(", ")),
    Confidence: { number: meal.confidence },
    Notes: textProperty(meal.notes),
    AIProvider: selectProperty(meal.aiProvider),
    EditedByUser: { checkbox: meal.editedByUser },
  };
}

export async function listMeals({
  userId,
  dateFilter,
  pageSize = 50,
  cursor,
  query,
}: ListMealsInput = {}): Promise<MealPage> {
  const dataSourceId = await getNotionDataSourceId(notionDatabaseIds.meals);
  const normalizedQuery = query?.trim();
  const dateQuery = normalizedQuery ? searchDate(normalizedQuery) : null;
  const filters = [
    userId ? { property: "UserID", rich_text: { equals: userId } } : null,
    dateFilter ? { property: "Date", date: { equals: dateFilter } } : null,
    normalizedQuery
      ? {
          or: [
            { property: "MealName", title: { contains: normalizedQuery } },
            { property: "ServingEstimate", rich_text: { contains: normalizedQuery } },
            { property: "FoodItems", rich_text: { contains: normalizedQuery } },
            { property: "Notes", rich_text: { contains: normalizedQuery } },
            ...(dateQuery ? [{ property: "Date", date: { equals: dateQuery } }] : []),
          ],
        }
      : null,
  ].filter((filter) => filter !== null);

  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: filters.length > 1 ? { and: filters } : (filters[0] ?? undefined),
    page_size: Number.isFinite(pageSize) ? Math.min(Math.max(pageSize, 1), NOTION_MAX_PAGE_SIZE) : 50,
    start_cursor: cursor,
    sorts: [{ property: "Date", direction: "descending" }],
  });

  return {
    items: response.results.filter(isPage).map((page) => toMeal(page)),
    nextCursor: response.next_cursor ?? null,
    hasMore: response.has_more,
  };
}

export async function createMeal(meal: Omit<Meal, "id" | "time">): Promise<Meal> {
  const dataSourceId = await getNotionDataSourceId(notionDatabaseIds.meals);
  const response = await notion.pages.create({
    parent: { data_source_id: dataSourceId },
    properties: mealProperties(meal),
  });

  if (!isPage(response)) throw new Error("Notion did not return a meal page.");
  return toMeal(response);
}

export async function getMeal(id: string): Promise<Meal | null> {
  const response = await notion.pages.retrieve({ page_id: id });
  return isPage(response) ? toMeal(response) : null;
}

export async function updateMeal(id: string, meal: Omit<Meal, "id" | "time">): Promise<Meal> {
  const response = await notion.pages.update({ page_id: id, properties: mealProperties(meal) });
  if (!isPage(response)) throw new Error("Notion did not return an updated meal page.");
  return toMeal(response);
}

export async function archiveMeal(id: string) {
  await notion.pages.update({ page_id: id, archived: true });
}
