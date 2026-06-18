import { ZodError } from "zod";

import type { AiProviderName } from "@/lib/ai";
import { AI_PROVIDERS } from "@/lib/ai";
import { mealRequestSchema, targetsSchema } from "@/lib/schemas";
import type { Meal, Settings } from "@/lib/types";

type AnalyzeInput = {
  imageBase64: string;
  provider: AiProviderName;
  model: string;
  apiKey: string;
  foodDescription: string;
};

const MAX_TEXT_LENGTH = 500;
const MAX_IMAGE_DATA_URL_LENGTH = 8_000_000;

export class ValidationError extends Error {
  status = 400;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

function text(value: unknown, name: string, maxLength = MAX_TEXT_LENGTH) {
  if (typeof value !== "string") throw new ValidationError(`${name} must be text.`);
  const trimmed = value.trim();
  if (trimmed.length > maxLength) throw new ValidationError(`${name} is too long.`);
  return trimmed;
}

function optionalText(value: unknown, name: string, maxLength = MAX_TEXT_LENGTH) {
  if (value == null) return "";
  return text(value, name, maxLength);
}

function booleanValue(value: unknown, name: string) {
  if (typeof value !== "boolean") throw new ValidationError(`${name} must be true or false.`);
  return value;
}

function validateProvider(provider: string): AiProviderName {
  if (!AI_PROVIDERS.includes(provider as AiProviderName)) {
    throw new ValidationError(`AI provider must be one of: ${AI_PROVIDERS.join(", ")}.`);
  }
  return provider as AiProviderName;
}

function formatZodError(error: ZodError): string {
  return error.issues
    .map((issue) => {
      const path = issue.path.length ? `${issue.path.join(".")}: ` : "";
      return `${path}${issue.message}`;
    })
    .join("; ");
}

export function parseAnalyzeRequest(value: unknown): AnalyzeInput {
  if (!isRecord(value)) throw new ValidationError("Analysis request must be an object.");

  const provider = validateProvider(text(value.provider, "AI provider", 40));

  const imageBase64 = text(value.imageBase64, "Image", MAX_IMAGE_DATA_URL_LENGTH);
  if (!imageBase64.startsWith("data:image/")) throw new ValidationError("Image must be a data URL.");

  return {
    imageBase64,
    provider,
    model: optionalText(value.model, "AI model", 160),
    apiKey: text(value.apiKey, "API key", 400),
    foodDescription: optionalText(value.foodDescription, "Food description", 1_000),
  };
}

export function parseMealRequest(value: unknown): Omit<Meal, "id" | "time"> {
  if (!isRecord(value)) throw new ValidationError("Meal must be an object.");

  try {
    return mealRequestSchema.parse(value) as Omit<Meal, "id" | "time">;
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(formatZodError(error));
    }
    throw error;
  }
}

export function parseTargetsRequest(value: unknown) {
  if (!isRecord(value)) throw new ValidationError("Targets must be an object.");

  try {
    return targetsSchema.parse(value);
  } catch (error) {
    if (error instanceof ZodError) {
      throw new ValidationError(formatZodError(error));
    }
    throw error;
  }
}

export function parseSettingsRequest(value: unknown): Settings {
  if (!isRecord(value)) throw new ValidationError("Settings must be an object.");

  const theme = text(value.theme, "Theme", 20);
  if (theme !== "System" && theme !== "Light" && theme !== "Dark") throw new ValidationError("Theme is invalid.");

  const provider = validateProvider(text(value.aiProvider, "AI provider", 40));

  return {
    aiProvider: provider,
    aiModel: text(value.aiModel, "AI model", 160),
    apiKey: text(value.apiKey, "API key", 400),
    notifications: booleanValue(value.notifications, "Notifications"),
    pwaInstalled: booleanValue(value.pwaInstalled, "PWA installed"),
    theme,
  };
}
