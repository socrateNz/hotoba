import { supabaseServer } from "@/lib/supabase-server";

export interface DashboardToday {
  revenue_today: number;
  occupancy_rate: number;
  arrivals: number;
  departures: number;
  debtors: Array<{ guest_name: string; balance: number }>;
}

export async function getDashboardToday(): Promise<DashboardToday> {
  const today = new Date().toISOString().slice(0, 10);
  // Plage UTC explicite pour inclure toute la journée
  const startOfDay = `${today}T00:00:00.000Z`;
  const endOfDay = `${today}T23:59:59.999Z`;

  const [revenueTodayRes, roomsRes, arrivalsRes, departuresRes] =
    await Promise.all([
      supabaseServer
        .from("transactions")
        .select("amount, created_at")
        .gte("created_at", startOfDay)
        .lte("created_at", endOfDay),
      supabaseServer.from("rooms").select("id, status"),
      supabaseServer
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("start_date", today),
      supabaseServer
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("end_date", today),
    ]);

  if (
    revenueTodayRes.error ||
    roomsRes.error ||
    arrivalsRes.error ||
    departuresRes.error
  ) {
    throw (
      revenueTodayRes.error ||
      roomsRes.error ||
      arrivalsRes.error ||
      departuresRes.error
    );
  }

  const revenue_today =
    revenueTodayRes.data?.reduce(
      (sum: number, t: { amount: number }) => sum + (t.amount ?? 0),
      0
    ) ?? 0;

  const totalRooms = roomsRes.data?.length ?? 0;
  const occupiedRooms =
    roomsRes.data?.filter((r: { status: string }) =>
      ["OCCUPIED"].includes(r.status)
    ).length ?? 0;
  const occupancy_rate =
    totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

  return {
    revenue_today,
    occupancy_rate,
    arrivals: arrivalsRes.count ?? 0,
    departures: departuresRes.count ?? 0,
    debtors: [],
  };
}
