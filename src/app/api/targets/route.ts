import { AuthRequiredError, requireAuthenticatedUser } from "@/lib/auth";
import { getTargets, upsertTargets } from "@/lib/notion/targets";
import { parseTargetsRequest, ValidationError } from "@/lib/validation";

export async function GET() {
  try {
    const user = await requireAuthenticatedUser();

    return Response.json(await getTargets(user.id));
  } catch (error) {
    console.error("[API] targets GET:", error);

    if (error instanceof AuthRequiredError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to load targets." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuthenticatedUser();

    const body = parseTargetsRequest(await request.json());
    return Response.json(await upsertTargets(user.id, body));
  } catch (error) {
    console.error("[API] targets PUT:", error);

    if (error instanceof AuthRequiredError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to save targets." },
      { status: error instanceof SyntaxError ? 400 : 500 },
    );
  }
}
