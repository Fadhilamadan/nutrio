import { AuthRequiredError, requireAuthenticatedUser } from "@/lib/auth";
import { archiveMeal, getMeal, updateMeal } from "@/lib/notion/meals";
import { parseMealRequest, ValidationError } from "@/lib/validation";

type MealRouteContext = {
  params: Promise<{ id: string }>;
};

export async function PATCH(request: Request, { params }: MealRouteContext) {
  try {
    const user = await requireAuthenticatedUser();
    const { id } = await params;
    const existingMeal = await getMeal(id);
    if (!existingMeal || existingMeal.userId !== user.id) {
      return Response.json({ error: "Meal not found." }, { status: 404 });
    }

    const body = parseMealRequest(await request.json());
    return Response.json(await updateMeal(id, { ...body, userId: user.id }));
  } catch (error) {
    console.error("[API] meals PATCH:", error);

    if (error instanceof AuthRequiredError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    if (error instanceof ValidationError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json(
      { error: error instanceof Error ? error.message : "Failed to update meal." },
      { status: error instanceof SyntaxError ? 400 : 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: MealRouteContext) {
  try {
    const user = await requireAuthenticatedUser();
    const { id } = await params;
    const existingMeal = await getMeal(id);
    if (!existingMeal || existingMeal.userId !== user.id) {
      return Response.json({ error: "Meal not found." }, { status: 404 });
    }

    await archiveMeal(id);
    return Response.json({ ok: true });
  } catch (error) {
    console.error("[API] meals DELETE:", error);

    if (error instanceof AuthRequiredError) {
      return Response.json({ error: error.message }, { status: error.status });
    }

    return Response.json({ error: error instanceof Error ? error.message : "Failed to delete meal." }, { status: 500 });
  }
}
