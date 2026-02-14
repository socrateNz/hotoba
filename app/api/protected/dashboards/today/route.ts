import { NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/api-auth";
import { getDashboardToday } from "@/lib/services/dashboard.service";

const ALLOWED_ROLES = ["ADMIN", "MANAGER"] as const;

export async function GET() {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const forbidden = requireRole(auth.user, [...ALLOWED_ROLES]);
  if (forbidden) return forbidden;

  try {
    const data = await getDashboardToday();
    return NextResponse.json(data);
  } catch (err) {
    console.error("[API] GET /api/protected/dashboards/today", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
