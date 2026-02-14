import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/api-auth";
import { bookingsService } from "@/lib/services/bookings.service";

const ALLOWED_ROLES = ["ADMIN", "MANAGER", "STAFF", "USER"] as const;

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const forbidden = requireRole(auth.user, [...ALLOWED_ROLES]);
  if (forbidden) return forbidden;

  try {
    const { id } = await context.params;
    const body = await request.json();

    const booking = await bookingsService.update(id, body);
    return NextResponse.json({ booking });
  } catch (err: unknown) {
    const e = err as Error & { status?: number };
    if (e.status === 409) {
      return NextResponse.json({ error: e.message }, { status: 409 });
    }
    console.error("[API] PUT /api/protected/bookings/[id]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
