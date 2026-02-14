import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/api-auth";
import { roomsService } from "@/lib/services/rooms.service";

const ALLOWED_ROLES = ["ADMIN", "MANAGER", "STAFF"] as const;

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const forbidden = requireRole(auth.user, [...ALLOWED_ROLES]);
  if (forbidden) return forbidden;

  try {
    const rooms = await roomsService.list();
    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("[API] GET /api/protected/rooms", err);
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
    const room = await roomsService.create(body);
    return NextResponse.json({ room }, { status: 201 });
  } catch (err) {
    console.error("[API] POST /api/protected/rooms", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
