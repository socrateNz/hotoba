import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/api-auth";
import { profilesService } from "@/lib/services/profiles.service";

const ALLOWED_ROLES = ["ADMIN", "MANAGER", "STAFF"] as const;

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const forbidden = requireRole(auth.user, [...ALLOWED_ROLES]);
  if (forbidden) return forbidden;

  try {
    // Staff = profiles avec role ADMIN, MANAGER ou STAFF (exclure USER)
    const profiles = await profilesService.list();
    const staffProfiles = profiles.filter(
      (p) => p.role === "ADMIN" || p.role === "MANAGER" || p.role === "STAFF"
    );
    return NextResponse.json({ profiles: staffProfiles });
  } catch (err) {
    console.error("[API] GET /api/protected/staff", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
