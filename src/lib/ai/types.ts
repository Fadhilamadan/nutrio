import type { AnalysisResult } from "@/lib/types";

export type AiProviderName = "Gemini" | "Groq" | "OpenRouter" | "HuggingFace" | "Mistral";

export const AI_PROVIDERS: AiProviderName[] = ["Gemini", "Groq", "OpenRouter", "HuggingFace", "Mistral"];

export const AI_PROVIDER_LABELS: Record<AiProviderName, string> = {
  Gemini: "Gemini (Google)",
  Groq: "Groq",
  OpenRouter: "OpenRouter",
  HuggingFace: "Hugging Face",
  Mistral: "Mistral AI",
};

export interface ProviderService {
  analyzeImage(imageBase64: string, apiKey: string, model: string, foodDescription?: string): Promise<AnalysisResult>;
}
