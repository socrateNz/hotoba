export async function getDashboardToday() {
  const res = await fetch("/api/protected/dashboards/today", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `API GET /api/protected/dashboards/today failed (${res.status})`
    );
  }
  return (res.json() as Promise<{
    revenue_today: number;
    occupancy_rate: number;
    arrivals: number;
    departures: number;
    debtors: Array<{ guest_name: string; balance: number }>;
  }>);
}

// ---- Bookings & Transactions ----

export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "CANCELLED"
  | "CHECKED_IN"
  | "CHECKED_OUT";

export interface Booking {
  id: string;
  guest_id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  status: BookingStatus;
  rooms?: { number: string } | null;
  profiles?: { full_name: string } | null;
}

export async function getBookings() {
  const res = await fetch("/api/protected/bookings", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API GET /api/protected/bookings failed (${res.status})`);
  }
  return (res.json() as Promise<{ bookings: Booking[] }>);
}

export interface Profile {
  id: string;
  role: "ADMIN" | "MANAGER" | "STAFF" | "USER";
  full_name: string;
  phone: string | null;
  email: string;
}

export async function getProfiles(role?: "ADMIN" | "MANAGER" | "STAFF" | "USER") {
  const params = role ? `?role=${role}` : "";
  const res = await fetch(`/api/protected/profiles${params}`, { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API GET /api/protected/profiles failed (${res.status})`);
  }
  return (res.json() as Promise<{ profiles: Profile[] }>);
}

export async function getStaffProfiles() {
  const res = await fetch("/api/protected/staff", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`API GET /api/protected/staff failed (${res.status})`);
  }
  return (res.json() as Promise<{ profiles: Profile[] }>);
}

export async function createProfile(payload: {
  full_name: string;
  email: string;
  phone?: string;
  role?: Profile["role"];
}) {
  const res = await fetch("/api/protected/profiles", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data as any)?.error ??
      `API POST /api/protected/profiles failed (${res.status})`;
    throw new Error(message);
  }
  return data as { profile: Profile };
}

export async function createBooking(payload: {
  guest_id: string;
  room_id: string;
  start_date: string;
  end_date: string;
  status?: BookingStatus;
}) {
  const res = await fetch("/api/protected/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data as any)?.error ?? `API POST /api/protected/bookings failed (${res.status})`;
    throw new Error(message);
  }
  return data as { booking: Booking };
}

export async function updateBooking(
  id: string,
  payload: Partial<{
    start_date: string;
    end_date: string;
    status: BookingStatus;
  }>
) {
  const res = await fetch(`/api/protected/bookings/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const message =
      (data as any)?.error ??
      `API PUT /api/protected/bookings/${id} failed (${res.status})`;
    throw new Error(message);
  }
  return data as { booking: Booking };
}

export type TransactionType = "CASH" | "CARD" | "TRANSFER" | "OTHER";

export interface Transaction {
  id: string;
  booking_id: string;
  amount: number;
  type: TransactionType;
  created_at: string;
}

export async function createTransaction(payload: {
  booking_id: string;
  amount: number;
  type: TransactionType;
}) {
  const res = await fetch("/api/protected/transactions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    throw new Error(
      `API POST /api/protected/transactions failed (${res.status})`
    );
  }
  return res.json();
}

export async function getTransactionsByBooking(bookingId: string) {
  const res = await fetch(
    `/api/protected/transactions?bookingId=${encodeURIComponent(bookingId)}`,
    { cache: "no-store" }
  );
  if (!res.ok) {
    throw new Error(
      `API GET /api/protected/transactions?bookingId=${bookingId} failed (${res.status})`
    );
  }
  return (res.json() as Promise<{ transactions: Transaction[] }>);
}

export async function getAllTransactions() {
  const res = await fetch("/api/protected/transactions", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(
      `API GET /api/protected/transactions failed (${res.status})`
    );
  }
  return (res.json() as Promise<{ transactions: Transaction[] }>);
}

// ---- Rooms ----

export type RoomStatus = "AVAILABLE" | "OCCUPIED" | "CLEANING" | "MAINTENANCE";

export interface Room {
  id: string;
  number: string;
  type: string;
  price: number;
  status: RoomStatus;
  equipments: string[];
}

export async function getRooms() {
  const res = await fetch("/api/protected/rooms", {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`API GET /api/protected/rooms failed (${res.status})`);
  }
  return (res.json() as Promise<{ rooms: Room[] }>);
}

export async function createRoom(payload: {
  number: string;
  type: string;
  price: number;
  status?: RoomStatus;
  equipments: string[];
}) {
  const res = await fetch("/api/protected/rooms", {
    method: "POST",
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) {
    throw new Error(`API POST /api/protected/rooms failed (${res.status})`);
  }
  return (res.json() as Promise<{ room: Room }>);
}

export async function updateRoom(
  id: string,
  payload: Partial<{
    number: string;
    type: string;
    price: number;
    status: RoomStatus;
    equipments: string[];
  }>
) {
  const res = await fetch(`/api/protected/rooms/${id}`, { method: "PUT", body: JSON.stringify(payload) });
  if (!res.ok) {
    throw new Error(`API PUT /api/protected/rooms/${id} failed (${res.status})`);
  }
  return (res.json() as Promise<{ room: Room }>);
}

export async function deleteRoom(id: string) {
  const res = await fetch(`/api/protected/rooms/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok && res.status !== 204) {
    throw new Error(
      `API DELETE /api/protected/rooms/${id} failed (${res.status})`
    );
  }
}

