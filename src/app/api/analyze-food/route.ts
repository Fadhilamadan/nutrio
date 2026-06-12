import { getProvider } from "@/lib/ai";
import { AuthRequiredError, requireAuthenticatedUser } from "@/lib/auth";
import { parseAnalyzeRequest, ValidationError } from "@/lib/validation";

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

    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to analyze food." },
      { status: error instanceof SyntaxError ? 400 : 500 },
    );
  }
}
