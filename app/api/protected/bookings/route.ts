import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/api-auth";
import { bookingsService } from "@/lib/services/bookings.service";

const ALLOWED_ROLES = ["ADMIN", "MANAGER", "STAFF", "USER"] as const;

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const forbidden = requireRole(auth.user, [...ALLOWED_ROLES]);
  if (forbidden) return forbidden;

  try {
    const guestId = auth.user.role === "USER" ? auth.user.id : undefined;
    const bookings = await bookingsService.list(guestId);
    return NextResponse.json({ bookings });
  } catch (err) {
    console.error("[API] GET /api/protected/bookings", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const forbidden = requireRole(auth.user, [...ALLOWED_ROLES]);
  if (forbidden) return forbidden;

  try {
    const body = await request.json();

    if (auth.user.role === "USER") {
      body.guest_id = auth.user.id;
    }

    const booking = await bookingsService.create(body);
    return NextResponse.json({ booking }, { status: 201 });
  } catch (err: unknown) {
    const e = err as Error & { status?: number };
    if (e.status === 409) {
      return NextResponse.json({ error: e.message }, { status: 409 });
    }
    console.error("[API] POST /api/protected/bookings", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
