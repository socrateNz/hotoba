import { supabaseServer } from "@/lib/supabase-server";

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "CHECKED_IN"
  | "CHECKED_OUT";

export interface CreateBookingDto {
  guest_id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  status?: BookingStatus;
}

export interface UpdateBookingDto {
  start_date?: string;
  end_date?: string;
  status?: BookingStatus;
}

async function hasDateConflict(input: {
  room_id: string;
  start_date: string;
  end_date: string;
  exclude_booking_id?: string;
}) {
  const { room_id, start_date, end_date, exclude_booking_id } = input;

  const blockingStatuses: BookingStatus[] = [
    "PENDING",
    "CONFIRMED",
    "CHECKED_IN",
  ];

  let query = supabaseServer
    .from("bookings")
    .select("id, room_id, start_date, end_date, status")
    .eq("room_id", room_id)
    .in("status", blockingStatuses)
    .lt("start_date", end_date)
    .gt("end_date", start_date);

  if (exclude_booking_id) {
    query = query.neq("id", exclude_booking_id);
  }

  const { data, error } = await query;
  if (error) throw error;

  return (data ?? []).length > 0;
}

export const bookingsService = {
  async list(guestId?: string) {
    let query = supabaseServer
      .from("bookings")
      .select(
        "id, guest_id, room_id, start_date, end_date, status, rooms(*), profiles(*)"
      )
      .order("start_date", { ascending: false });

    if (guestId) {
      query = query.eq("guest_id", guestId);
    }

    const { data, error } = await query;
    if (error) throw error;
    return data ?? [];
  },

  async create(payload: CreateBookingDto) {
    const conflict = await hasDateConflict({
      room_id: payload.room_id,
      start_date: payload.start_date,
      end_date: payload.end_date,
    });

    if (conflict) {
      const err: Error & { status?: number } = new Error(
        "Date en conflit : surbooking détecté"
      );
      err.status = 409;
      throw err;
    }

    const { data, error } = await supabaseServer
      .from("bookings")
      .insert({
        guest_id: payload.guest_id,
        room_id: payload.room_id,
        start_date: payload.start_date,
        end_date: payload.end_date,
        status: payload.status ?? "PENDING",
      })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, payload: UpdateBookingDto) {
    if (payload.start_date && payload.end_date) {
      const existing = await this.getById(id);
      const conflict = await hasDateConflict({
        room_id: existing.room_id,
        start_date: payload.start_date,
        end_date: payload.end_date,
        exclude_booking_id: id,
      });

      if (conflict) {
        const err: Error & { status?: number } = new Error(
          "Date en conflit : surbooking détecté"
        );
        err.status = 409;
        throw err;
      }
    }

    const { data, error } = await supabaseServer
      .from("bookings")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async getById(id: string) {
    const { data, error } = await supabaseServer
      .from("bookings")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;
    return data;
  },

  async checkAvailability(room_id: string, start_date: string, end_date: string) {
    const blockingStatuses: BookingStatus[] = [
      "PENDING",
      "CONFIRMED",
      "CHECKED_IN",
    ];

    const { data, error } = await supabaseServer
      .from("bookings")
      .select("id")
      .eq("room_id", room_id)
      .in("status", blockingStatuses)
      .lt("start_date", end_date)
      .gt("end_date", start_date);

    if (error) throw error;
    return (data ?? []).length === 0;
  },
};
