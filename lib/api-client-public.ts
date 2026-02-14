// API client pour le front-office (routes publiques Next.js)

export interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  status: "AVAILABLE" | "OCCUPIED" | "CLEANING" | "MAINTENANCE";
  equipments: string[];
}

export async function getAvailableRooms() {
  const res = await fetch("/api/public/bookings/rooms", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`API GET /api/public/bookings/rooms failed (${res.status})`);
  }
  return (res.json() as Promise<{ rooms: Room[] }>);
}

export async function checkRoomAvailability(
  roomId: string,
  startDate: string,
  endDate: string
) {
  const params = new URLSearchParams({
    room_id: roomId,
    start_date: startDate,
    end_date: endDate,
  });
  const res = await fetch(`/api/public/bookings/availability?${params}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `API GET /api/public/bookings/availability failed (${res.status})`
    );
  }
  return (res.json() as Promise<{ available: boolean }>);
}

export interface CreatePublicBookingPayload {
  guest_name: string;
  guest_email: string;
  guest_phone?: string;
  room_id: string;
  start_date: string;
  end_date: string;
}

export interface PublicBooking {
  id: string;
  guest_id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "CHECKED_IN" | "CHECKED_OUT";
}

export async function createPublicBooking(payload: CreatePublicBookingPayload) {
  const res = await fetch("/api/public/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data as any)?.error ??
      `API POST /api/public/bookings failed (${res.status})`;
    throw new Error(message);
  }
  return data as { booking: PublicBooking };
}
