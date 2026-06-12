import { USER_COLORS } from "@/lib/constants";
import { getNotionDataSourceId, notion, notionDatabaseIds } from "@/lib/notion/client";
import type { NotionPage } from "@/lib/notion/properties";
import { email, isPage, richText, select, textProperty, title, titleProperty } from "@/lib/notion/properties";
import type { User } from "@/lib/types";

const userColors = [...USER_COLORS];
const roles: User["role"][] = ["Parent", "Adult", "Teen"];

function toRole(value: string): User["role"] {
  return roles.find((role) => role === value) ?? "Adult";
}

function toUser(page: NotionPage, index = 0): User {
  return {
    id: richText(page.properties, "UserID") || page.id,
    name: title(page.properties, "Name"),
    email: email(page.properties, "Email"),
    role: toRole(select(page.properties, "Role")),
    color: userColors[index % userColors.length],
  };
}

async function getUserByEmail(userEmail: string): Promise<User | null> {
  const dataSourceId = await getNotionDataSourceId(notionDatabaseIds.users);
  const response = await notion.dataSources.query({
    data_source_id: dataSourceId,
    filter: { property: "Email", email: { equals: userEmail } },
    page_size: 1,
  });

  const page = response.results.find(isPage);
  return page ? toUser(page) : null;
}

export async function upsertUserFromAuth(authUser: { email: string; name?: string | null }): Promise<User> {
  const existing = await getUserByEmail(authUser.email);
  if (existing) return existing;

  const userId = authUser.email.toLowerCase();
  return await createUser({
    id: userId,
    name: authUser.name?.trim() || authUser.email.split("@")[0],
    email: authUser.email,
    role: "Adult",
  });
}

async function createUser(user: Omit<User, "color">): Promise<User> {
  const dataSourceId = await getNotionDataSourceId(notionDatabaseIds.users);
  const response = await notion.pages.create({
    parent: { data_source_id: dataSourceId },
    properties: {
      Name: titleProperty(user.name),
      Email: { email: user.email },
      UserID: textProperty(user.id),
      CreatedAt: { date: { start: new Date().toISOString() } },
      Role: { select: { name: user.role } },
      Active: { checkbox: true },
    },
  });

  if (!isPage(response)) return { ...user, color: userColors[0] };

  return {
    id: richText(response.properties, "UserID") || response.id,
    name: title(response.properties, "Name"),
    email: email(response.properties, "Email"),
    role: toRole(select(response.properties, "Role")),
    color: userColors[0],
  };
}
