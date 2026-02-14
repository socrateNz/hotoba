import { supabaseServer } from "@/lib/supabase-server";

export type TransactionType = "CASH" | "CARD" | "TRANSFER" | "OTHER";

export interface CreateTransactionDto {
  booking_id: string;
  amount: number;
  type: TransactionType;
}

export const transactionsService = {
  async create(payload: CreateTransactionDto) {
    const { data, error } = await supabaseServer
      .from("transactions")
      .insert({
        booking_id: payload.booking_id,
        amount: payload.amount,
        type: payload.type,
      })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async listAll(limit = 200) {
    const { data, error } = await supabaseServer
      .from("transactions")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data ?? [];
  },

  async listByBooking(booking_id: string) {
    const { data, error } = await supabaseServer
      .from("transactions")
      .select("*")
      .eq("booking_id", booking_id)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async listByGuest(guest_id: string) {
    const { data: bookings } = await supabaseServer
      .from("bookings")
      .select("id")
      .eq("guest_id", guest_id);

    if (!bookings || bookings.length === 0) {
      return [];
    }

    const bookingIds = bookings.map((b) => b.id);
    const { data, error } = await supabaseServer
      .from("transactions")
      .select("*, bookings(id, guest_id, start_date, end_date, rooms(*), profiles(*))")
      .in("booking_id", bookingIds)
      .order("created_at", { ascending: false });

    if (error) throw error;
    return data ?? [];
  },
};
