import { AI_ANALYSIS_TEMPERATURE, AI_MAX_OUTPUT_TOKENS } from "@/lib/ai/constants";
import { fetchWithTimeout } from "@/lib/ai/fetch";
import { parseAnalysis } from "@/lib/ai/parse";
import { buildUserPrompt, FOOD_ANALYSIS_PROMPTS } from "@/lib/ai/prompt";
import type { ProviderService } from "@/lib/ai/types";
import type { AnalysisResult } from "@/lib/types";

export class GeminiService implements ProviderService {
  async analyzeImage(
    imageBase64: string,
    apiKey: string,
    model: string,
    foodDescription?: string,
  ): Promise<AnalysisResult> {
    const effectiveModel = model || process.env.GEMINI_DEFAULT_MODEL || "gemini-2.5-flash";

    const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;

    const response = await fetchWithTimeout(
      `https://generativelanguage.googleapis.com/v1/models/${effectiveModel}:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [
                { text: `${FOOD_ANALYSIS_PROMPTS.system}\n\n${buildUserPrompt(foodDescription)}` },
                {
                  inlineData: {
                    mimeType: "image/webp",
                    data: base64Data,
                  },
                },
              ],
            },
          ],
          generationConfig: {
            temperature: AI_ANALYSIS_TEMPERATURE,
            maxOutputTokens: AI_MAX_OUTPUT_TOKENS,
          },
        }),
      },
    );

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      throw new Error(errorBody?.error?.message ?? `Gemini request failed: ${response.status}`);
    }

    const payload = (await response.json()) as {
      candidates?: Array<{ content?: { parts?: Array<{ text?: string }> } }>;
    };
    const content = payload.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
    if (!content) throw new Error("Gemini did not return analysis content.");

    return parseAnalysis(content, "Gemini");
  }
}
