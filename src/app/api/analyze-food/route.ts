import { getProvider } from "@/lib/ai";
import { AuthRequiredError, requireAuthenticatedUser } from "@/lib/auth";
import { parseAnalyzeRequest, ValidationError } from "@/lib/validation";

function normalizeError(error: unknown): Error {
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
    return new Error("Invalid API key. Check your key in Settings.");
  }

  return error;
}

export async function POST(request: Request) {
  try {
    await requireAuthenticatedUser();
    const body = parseAnalyzeRequest(await request.json());

    const provider = getProvider(body.provider);
    const result = await provider.analyzeImage(body.imageBase64, body.apiKey, body.model);

    return Response.json(result);
  } catch (error) {
    console.error("[API] analyze-food:", error);

    if (error instanceof AuthRequiredError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    const normalized = normalizeError(error);

    return Response.json({ error: normalized.message }, { status: error instanceof SyntaxError ? 400 : 500 });
  }
}
