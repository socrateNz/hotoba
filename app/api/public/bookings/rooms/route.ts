import { NextResponse } from "next/server";
import { roomsService } from "@/lib/services/rooms.service";

export async function GET() {
  try {
    const rooms = await roomsService.listAvailable();
    return NextResponse.json({ rooms });
  } catch (err) {
    console.error("[API] GET /api/public/bookings/rooms", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
