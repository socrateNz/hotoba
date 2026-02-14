import { supabaseServer } from "@/lib/supabase-server";

export type RoomStatus =
  | "AVAILABLE"
  | "OCCUPIED"
  | "CLEANING"
  | "MAINTENANCE";

export interface CreateRoomDto {
  number: string;
  type: string;
  price: number;
  status?: RoomStatus;
  equipments?: string[];
}

export interface UpdateRoomDto {
  number?: string;
  type?: string;
  price?: number;
  status?: RoomStatus;
  equipments?: string[];
}

export const roomsService = {
  async list() {
    const { data, error } = await supabaseServer
      .from("rooms")
      .select("*")
      .order("number", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async listAvailable() {
    const { data, error } = await supabaseServer
      .from("rooms")
      .select("*")
      .eq("status", "AVAILABLE")
      .order("number", { ascending: true });

    if (error) throw error;
    return data ?? [];
  },

  async create(payload: CreateRoomDto) {
    const { data, error } = await supabaseServer
      .from("rooms")
      .insert({
        number: payload.number,
        type: payload.type,
        price: payload.price,
        status: payload.status ?? "AVAILABLE",
        equipments: payload.equipments ?? [],
      })
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async update(id: string, payload: UpdateRoomDto) {
    const { data, error } = await supabaseServer
      .from("rooms")
      .update(payload)
      .eq("id", id)
      .select("*")
      .single();

    if (error) throw error;
    return data;
  },

  async remove(id: string) {
    const { error } = await supabaseServer.from("rooms").delete().eq("id", id);
    if (error) throw error;
  },
};
