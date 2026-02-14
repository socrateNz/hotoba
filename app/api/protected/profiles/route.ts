import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/api-auth";
import { profilesService } from "@/lib/services/profiles.service";

const ALLOWED_ROLES = ["ADMIN", "MANAGER", "STAFF"] as const;

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const forbidden = requireRole(auth.user, [...ALLOWED_ROLES]);
  if (forbidden) return forbidden;

  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role") as
      | "ADMIN"
      | "MANAGER"
      | "STAFF"
      | "USER"
      | undefined;

    const profiles = await profilesService.list(role);
    return NextResponse.json({ profiles });
  } catch (err) {
    console.error("[API] GET /api/protected/profiles", err);
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
    const profile = await profilesService.create(body);
    return NextResponse.json({ profile }, { status: 201 });
  } catch (err) {
    console.error("[API] POST /api/protected/profiles", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
