import { NextRequest, NextResponse } from "next/server";
import { bookingsService } from "@/lib/services/bookings.service";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const room_id = searchParams.get("room_id");
    const start_date = searchParams.get("start_date");
    const end_date = searchParams.get("end_date");

    if (!room_id || !start_date || !end_date) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    const available = await bookingsService.checkAvailability(
      room_id,
      start_date,
      end_date
    );
    return NextResponse.json({ available });
  } catch (err) {
    console.error("[API] GET /api/public/bookings/availability", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
