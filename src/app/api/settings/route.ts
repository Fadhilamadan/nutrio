import { AuthRequiredError, requireAuthenticatedUser } from "@/lib/auth";
import { defaultSettings, getSettings, upsertSettings } from "@/lib/notion/settings";
import { parseSettingsRequest, ValidationError } from "@/lib/validation";

export async function GET() {
  try {
    const user = await requireAuthenticatedUser();

    return Response.json((await getSettings(user.id)) ?? { ...defaultSettings(), userId: user.id });
  } catch (error) {
    console.error("[API] settings GET:", error);

    if (error instanceof AuthRequiredError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to load settings." },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const user = await requireAuthenticatedUser();

    const body = parseSettingsRequest(await request.json());
    return Response.json(await upsertSettings(user.id, body));
  } catch (error) {
    console.error("[API] settings PUT:", error);

    if (error instanceof AuthRequiredError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to save settings." },
      { status: error instanceof SyntaxError ? 400 : 500 },
    );
  }
}
