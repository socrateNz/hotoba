import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/api-auth";
import { roomsService } from "@/lib/services/rooms.service";

const ALLOWED_ROLES = ["ADMIN", "MANAGER", "STAFF"] as const;

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
    const room = await roomsService.update(id, body);
    return NextResponse.json({ room });
  } catch (err) {
    console.error("[API] PUT /api/protected/rooms/[id]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const forbidden = requireRole(auth.user, [...ALLOWED_ROLES]);
  if (forbidden) return forbidden;

  try {
    const { id } = await context.params;
    await roomsService.remove(id);
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error("[API] DELETE /api/protected/rooms/[id]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
