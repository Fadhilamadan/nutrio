import { AI_ANALYSIS_TEMPERATURE, AI_MAX_OUTPUT_TOKENS } from "@/lib/ai/constants";
import { fetchWithTimeout } from "@/lib/ai/fetch";
import { parseAnalysis } from "@/lib/ai/parse";
import { FOOD_ANALYSIS_PROMPTS } from "@/lib/ai/prompt";
import type { ProviderService } from "@/lib/ai/types";
import type { AnalysisResult } from "@/lib/types";

export class GroqService implements ProviderService {
  async analyzeImage(imageBase64: string, apiKey: string, model: string): Promise<AnalysisResult> {
    const effectiveModel = model || process.env.GROQ_DEFAULT_MODEL || "llama-3.2-90b-vision-preview";

    const response = await fetchWithTimeout("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
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
        temperature: AI_ANALYSIS_TEMPERATURE,
        max_tokens: AI_MAX_OUTPUT_TOKENS,
      }),
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as {
        error?: { message?: string };
      } | null;
      throw new Error(errorBody?.error?.message ?? `Groq request failed: ${response.status}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (!content) throw new Error("Groq did not return analysis content.");

    return parseAnalysis(content, "Groq");
  }
}
