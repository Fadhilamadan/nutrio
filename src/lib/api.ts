import type { AiProviderName } from "@/lib/ai";
import type { AnalysisResult, Meal, MealPage, Settings, Targets, User } from "@/lib/types";

type NewMeal = Omit<Meal, "id" | "time">;

type ApiError = Error & { status?: number };

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { error?: string } | null;
    const error = new Error(body?.error ?? `Request failed: ${response.status}`) as ApiError;
    error.status = response.status;
    throw error;
  }

  return (await response.json()) as T;
}

export async function getCurrentUser() {
  return await requestJson<User>("/api/users/me");
}

export async function analyzeFoodImage(input: {
  imageBase64: string;
  provider: Settings["aiProvider"];
  model: string;
  apiKey: string;
  foodDescription?: string;
}) {
  return await requestJson<AnalysisResult>("/api/analyze-food", { method: "POST", body: JSON.stringify(input) });
}

export function createMealFromAnalysis(userId: string, result: AnalysisResult): NewMeal {
  return {
    ...result,
    userId,
    date: new Date().toISOString(),
    editedByUser: true,
  };
}

export async function getMeals(input: { limit?: number; cursor?: string | null; date?: string; query?: string } = {}) {
  const params = new URLSearchParams();
  if (input.limit) params.set("limit", String(input.limit));
  if (input.cursor) params.set("cursor", input.cursor);
  if (input.date) params.set("date", input.date);
  if (input.query) params.set("query", input.query);
  const suffix = params.size ? `?${params.toString()}` : "";
  return await requestJson<MealPage>(`/api/meals${suffix}`);
}

export async function saveMeal(meal: NewMeal) {
  return await requestJson<Meal>("/api/meals", { method: "POST", body: JSON.stringify(meal) });
}

// time is intentionally excluded — the API reuses the existing timestamp
export async function updateMeal(meal: Meal) {
  const { id, time: _unused, ...payload } = meal;
  return await requestJson<Meal>(`/api/meals/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export async function deleteMeal(id: string) {
  await requestJson<{ ok: boolean }>(`/api/meals/${encodeURIComponent(id)}`, { method: "DELETE" });
}

export async function getTargets() {
  return await requestJson<Targets | null>("/api/targets");
}

export async function saveTargets(targets: Targets) {
  return await requestJson<Targets>("/api/targets", {
    method: "PUT",
    body: JSON.stringify(targets),
  });
}

export async function getSettings() {
  return await requestJson<Settings>("/api/settings");
}

export async function getDefaultModels() {
  return requestJson<Record<AiProviderName, string>>("/api/settings/defaults");
}

export async function saveSettings(settings: Settings) {
  return await requestJson<Settings>("/api/settings", {
    method: "PUT",
    body: JSON.stringify(settings),
  });
}
