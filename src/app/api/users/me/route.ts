import { AuthRequiredError, requireAuthenticatedUser } from "@/lib/auth";

export async function GET() {
  try {
    return Response.json(await requireAuthenticatedUser());
  } catch (error) {
    console.error("[API] users/me:", error);

    if (error instanceof AuthRequiredError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to load authenticated user." },
      { status: 500 },
    );
  }
}
