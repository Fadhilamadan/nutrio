import type { PageObjectResponse } from "@notionhq/client/build/src/api-endpoints";

export type NotionPage = PageObjectResponse;
export type NotionProperties = PageObjectResponse["properties"];

export function title(properties: NotionProperties, name: string) {
  const property = properties[name];
  if (property?.type !== "title") return "";
  return property.title.map((item) => item.plain_text).join("");
}

export function richText(properties: NotionProperties, name: string) {
  const property = properties[name];
  if (property?.type !== "rich_text") return "";
  return property.rich_text.map((item) => item.plain_text).join("");
}

export function email(properties: NotionProperties, name: string) {
  const property = properties[name];
  if (property?.type !== "email") return "";
  return property.email ?? "";
}

export function date(properties: NotionProperties, name: string) {
  const property = properties[name];
  if (property?.type !== "date") return "";
  return property.date?.start ?? "";
}

export function select(properties: NotionProperties, name: string) {
  const property = properties[name];
  if (property?.type !== "select") return "";
  return property.select?.name ?? "";
}

export function number(properties: NotionProperties, name: string) {
  const property = properties[name];
  if (property?.type !== "number") return 0;
  return property.number ?? 0;
}

export function checkbox(properties: NotionProperties, name: string) {
  const property = properties[name];
  if (property?.type !== "checkbox") return false;
  return property.checkbox;
}

export function textProperty(content: string) {
  return { rich_text: [{ text: { content } }] };
}

export function titleProperty(content: string) {
  return { title: [{ text: { content } }] };
}

export function selectProperty(name: string) {
  return { select: name ? { name } : null };
}

export function isPage(response: unknown): response is NotionPage {
  return (
    typeof response === "object" &&
    response !== null &&
    "object" in response &&
    (response as Record<string, unknown>).object === "page" &&
    "properties" in response
  );
}
