import { NextResponse } from "next/server";
import { supabaseServer } from "@/lib/supabase-server";
import { bookingsService } from "@/lib/services/bookings.service";
import { profilesService } from "@/lib/services/profiles.service";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      guest_name,
      guest_email,
      guest_phone,
      room_id,
      start_date,
      end_date,
    } = body;

    if (!guest_name || !guest_email || !room_id || !start_date || !end_date) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    // Vérifier la disponibilité
    const available = await bookingsService.checkAvailability(
      room_id,
      start_date,
      end_date
    );
    if (!available) {
      return NextResponse.json(
        { error: "Chambre non disponible pour ces dates" },
        { status: 409 }
      );
    }

    // Créer ou récupérer le profil client
    let guestId: string;
    const { data: existingProfile } = await supabaseServer
      .from("profiles")
      .select("id")
      .eq("email", guest_email)
      .eq("role", "USER")
      .single();

    if (existingProfile) {
      guestId = existingProfile.id;
      if (guest_name || guest_phone) {
        await supabaseServer
          .from("profiles")
          .update({
            full_name: guest_name,
            phone: guest_phone ?? null,
          })
          .eq("id", guestId);
      }
    } else {
      const newProfile = await profilesService.create({
        full_name: guest_name,
        email: guest_email,
        phone: guest_phone ?? null,
      });
      guestId = newProfile.id;
    }

    const booking = await bookingsService.create({
      guest_id: guestId,
      room_id,
      start_date,
      end_date,
      status: "PENDING",
    });

    return NextResponse.json({ booking }, { status: 201 });
  } catch (err: unknown) {
    const e = err as Error & { status?: number };
    if (e.status === 409) {
      return NextResponse.json({ error: e.message }, { status: 409 });
    }
    console.error("[API] POST /api/public/bookings", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
