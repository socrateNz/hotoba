import { NextRequest, NextResponse } from "next/server";
import { requireAuth, requireRole } from "@/lib/api-auth";
import { transactionsService } from "@/lib/services/transactions.service";

const ALLOWED_ROLES = ["ADMIN", "MANAGER", "STAFF", "USER"] as const;

export async function GET(request: NextRequest) {
  const auth = await requireAuth();
  if (auth.error) return auth.error;

  const forbidden = requireRole(auth.user, [...ALLOWED_ROLES]);
  if (forbidden) return forbidden;

  try {
    const { searchParams } = new URL(request.url);
    const bookingId = searchParams.get("bookingId");

    if (bookingId) {
      const transactions = await transactionsService.listByBooking(bookingId);
      return NextResponse.json({ transactions });
    }

    if (auth.user.role === "USER") {
      const transactions = await transactionsService.listByGuest(auth.user.id);
      return NextResponse.json({ transactions });
    }

    const transactions = await transactionsService.listAll();
    return NextResponse.json({ transactions });
  } catch (err) {
    console.error("[API] GET /api/protected/transactions", err);
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
    const transaction = await transactionsService.create(body);
    return NextResponse.json({ transaction }, { status: 201 });
  } catch (err) {
    console.error("[API] POST /api/protected/transactions", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
