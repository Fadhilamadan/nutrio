import type { NextRequest } from "next/server";

import { AuthRequiredError, requireAuthenticatedUser } from "@/lib/auth";
import { createMeal, listMeals } from "@/lib/notion/meals";
import { parseMealRequest, ValidationError } from "@/lib/validation";

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuthenticatedUser();
    const date = request.nextUrl.searchParams.get("date") ?? undefined;
    const cursor = request.nextUrl.searchParams.get("cursor") ?? undefined;
    const query = request.nextUrl.searchParams.get("query") ?? undefined;
    const limit = Number(request.nextUrl.searchParams.get("limit") ?? 50);
    return Response.json(
      await listMeals({
        userId: user.id,
        dateFilter: date,
        cursor,
        query,
        pageSize: Number.isFinite(limit) ? limit : 50,
      }),
    );
  } catch (error) {
    console.error("[API] meals GET:", error);

    if (error instanceof AuthRequiredError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json({ error: error instanceof Error ? error.message : "Failed to load meals." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await requireAuthenticatedUser();
    const body = parseMealRequest(await request.json());
    return Response.json(await createMeal({ ...body, userId: user.id }), { status: 201 });
  } catch (error) {
    console.error("[API] meals POST:", error);

    if (error instanceof AuthRequiredError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to create meal." },
      { status: error instanceof SyntaxError ? 400 : 500 },
    );
  }
}
