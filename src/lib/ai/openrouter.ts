import { fetchWithTimeout } from "@/lib/ai/fetch";
import { parseAnalysis } from "@/lib/ai/parse";
import { FOOD_ANALYSIS_PROMPTS } from "@/lib/ai/prompt";
import type { ProviderService } from "@/lib/ai/types";
import type { AnalysisResult } from "@/lib/types";

export class OpenRouterService implements ProviderService {
  async analyzeImage(imageBase64: string, apiKey: string, model: string): Promise<AnalysisResult> {
    const effectiveModel = model || process.env.OPENROUTER_DEFAULT_MODEL || "openrouter/free";
    const response = await fetchWithTimeout("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL ?? process.env.AUTH_URL ?? "http://localhost:3000",
        "X-Title": "Nutrio",
      },
      body: JSON.stringify({
        model: effectiveModel,
        messages: [
          { role: "system", content: FOOD_ANALYSIS_PROMPTS.system },
          {
            role: "user",
            content: [
              { type: "text", text: FOOD_ANALYSIS_PROMPTS.user },
              { type: "image_url", image_url: { url: imageBase64 } },
            ],
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      throw new Error(errorBody?.error?.message ?? `OpenRouter request failed: ${response.status}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("OpenRouter did not return analysis content.");

    return parseAnalysis(content, "OpenRouter");
  }
}
