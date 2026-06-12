import { GeminiService } from "@/lib/ai/gemini";
import { GroqService } from "@/lib/ai/groq";
import { HuggingFaceService } from "@/lib/ai/huggingface";
import { MistralService } from "@/lib/ai/mistral";
import { OpenRouterService } from "@/lib/ai/openrouter";
import type { AiProviderName, ProviderService } from "@/lib/ai/types";

const providerConstructors: Record<AiProviderName, new () => ProviderService> = {
  Gemini: GeminiService,
  Groq: GroqService,
  OpenRouter: OpenRouterService,
  HuggingFace: HuggingFaceService,
  Mistral: MistralService,
};

const providerCache = new Map<AiProviderName, ProviderService>();

export function getProvider(name: AiProviderName): ProviderService {
  const cached = providerCache.get(name);
  if (cached) return cached;

  const Constructor = providerConstructors[name];
  if (!Constructor) throw new Error(`Unknown AI provider: ${name}`);

  const instance = new Constructor();
  providerCache.set(name, instance);
  return instance;
}
