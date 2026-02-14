import { randomUUID } from "crypto";
import { supabaseServer } from "@/lib/supabase-server";

export interface Profile {
  id: string;
  role: "ADMIN" | "MANAGER" | "STAFF" | "USER";
  full_name: string;
  phone: string | null;
  email: string;
}

export const profilesService = {
  async list(role?: Profile["role"]) {
    let query = supabaseServer.from("profiles").select("*");

    if (role) {
      query = query.eq("role", role);
    }

    const { data, error } = await query.order("full_name", {
      ascending: true,
    });

    if (error) throw error;
    return (data ?? []) as Profile[];
  },

  async create(payload: {
    full_name: string;
    email: string;
    phone?: string | null;
    role?: Profile["role"];
  }) {
    const id = randomUUID();

    const { data, error } = await supabaseServer
      .from("profiles")
      .insert({
        id,
        full_name: payload.full_name,
        email: payload.email,
        phone: payload.phone ?? null,
        role: payload.role ?? "USER",
      })
      .select("*")
      .single();

    if (error) throw error;
    return data as Profile;
  },
};
