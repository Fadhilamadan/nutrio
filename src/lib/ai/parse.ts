import type { AnalysisResult } from "@/lib/types";

function numberValue(value: unknown, max = 10000) {
  const number = Number(value);
  return Number.isFinite(number) ? Math.min(Math.max(number, 0), max) : 0;
}

export function parseAnalysis(content: string, providerName: string): AnalysisResult {
  const cleaned = content
    .replace(/```(?:json)?\s*\n?/gi, "")
    .replace(/\s*```/g, "")
    .trim();

  let rawResponse: Record<string, unknown>;
  try {
    rawResponse = JSON.parse(cleaned) as Record<string, unknown>;
  } catch {
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error(`${providerName} did not return JSON nutrition data.`);
    rawResponse = JSON.parse(jsonMatch[0]) as Record<string, unknown>;
  }
  const items = Array.isArray(rawResponse.items)
    ? rawResponse.items
        .map((item) =>
          typeof item === "object" && item !== null
            ? String((item as Record<string, unknown>).name ?? JSON.stringify(item))
            : String(item),
        )
        .filter(Boolean)
    : [];

  return {
    name: String(rawResponse.mealName ?? rawResponse.name ?? "Analyzed meal"),
    calories: numberValue(rawResponse.calories, 10000),
    protein: numberValue(rawResponse.protein, 1000),
    carbs: numberValue(rawResponse.carbs, 1000),
    fat: numberValue(rawResponse.fat, 500),
    servingEstimate: String(rawResponse.servingEstimate ?? "Estimated from image"),
    items,
    confidence: numberValue(rawResponse.confidence, 1),
    notes: String(rawResponse.notes ?? "Estimated from image. No image was stored."),
    aiProvider: providerName,
  };
}
