import { AI_ANALYSIS_TEMPERATURE, AI_MAX_OUTPUT_TOKENS } from "@/lib/ai/constants";
import { fetchWithTimeout } from "@/lib/ai/fetch";
import { parseAnalysis } from "@/lib/ai/parse";
import { FOOD_ANALYSIS_PROMPTS } from "@/lib/ai/prompt";
import type { ProviderService } from "@/lib/ai/types";
import type { AnalysisResult } from "@/lib/types";

export class HuggingFaceService implements ProviderService {
  async analyzeImage(imageBase64: string, apiKey: string, model: string): Promise<AnalysisResult> {
    const effectiveModel = model || process.env.HUGGINGFACE_DEFAULT_MODEL || "meta-llama/Llama-3.2-90B-Vision-Instruct";

    const base64Data = imageBase64.includes(",") ? imageBase64.split(",")[1] : imageBase64;

    const response = await fetchWithTimeout(`https://api-inference.huggingface.co/models/${effectiveModel}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        inputs: {
          image: base64Data,
          prompt: `${FOOD_ANALYSIS_PROMPTS.system}\n\n${FOOD_ANALYSIS_PROMPTS.user}`,
        },
        parameters: {
          max_new_tokens: AI_MAX_OUTPUT_TOKENS,
          temperature: AI_ANALYSIS_TEMPERATURE,
          return_full_text: false,
        },
      }),
    });

    if (!response.ok) {
      const errorBody = (await response.json().catch(() => null)) as {
        error?: string;
      } | null;
      throw new Error(
        typeof errorBody?.error === "string" ? errorBody.error : `Hugging Face request failed: ${response.status}`,
      );
    }

    const payload = (await response.json()) as Array<{ generated_text?: string }> | { generated_text?: string };
    const generatedText = Array.isArray(payload) ? payload[0]?.generated_text : payload?.generated_text;
    if (!generatedText) throw new Error("Hugging Face did not return analysis content.");

    return parseAnalysis(generatedText, "HuggingFace");
  }
}
