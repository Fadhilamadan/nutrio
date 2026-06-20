import type { AiProviderName } from "@/lib/ai";
import { getProvider } from "@/lib/ai";
import { AuthRequiredError, requireAuthenticatedUser } from "@/lib/auth";
import { parseAnalyzeRequest, ValidationError } from "@/lib/validation";

function normalizeError(error: unknown, usedDefaultToken: boolean): Error {
  if (!(error instanceof Error)) return new Error("Failed to analyze food.");

  const msg = error.message.toLowerCase();
  const isAuthError =
    msg.includes("api_key") ||
    msg.includes("api key") ||
    msg.includes("auth") ||
    msg.includes("401") ||
    msg.includes("403") ||
    msg.includes("unauthorized") ||
    msg.includes("forbidden") ||
    msg.includes("invalid key") ||
    msg.includes("incorrect api key") ||
    msg.includes("authentication");

  if (isAuthError) {
    return new Error(
      usedDefaultToken
        ? "Free trial temporarily unavailable. Try again later or set up your own API key in Settings."
        : "Invalid API key. Check your key in Settings.",
    );
  }

  return error;
}

export async function POST(request: Request) {
  let usedDefaultToken = false;

  try {
    await requireAuthenticatedUser();
    const body = parseAnalyzeRequest(await request.json());

    let { apiKey, provider, model } = body;

    usedDefaultToken = !apiKey;

    if (!apiKey) {
      apiKey = process.env.DEFAULT_AI_API_KEY ?? "";
      provider = (process.env.DEFAULT_AI_PROVIDER as AiProviderName) ?? "Groq";
      model = process.env.GROQ_DEFAULT_MODEL ?? "";
    }

    const providerInstance = getProvider(provider);
    const result = await providerInstance.analyzeImage(body.imageBase64, apiKey, model, body.foodDescription);

    return Response.json(result);
  } catch (error) {
    console.error("[API] analyze-food:", error);

    if (error instanceof AuthRequiredError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    const normalized = normalizeError(error, usedDefaultToken);

    return Response.json({ error: normalized.message }, { status: error instanceof SyntaxError ? 400 : 500 });
  }
}
