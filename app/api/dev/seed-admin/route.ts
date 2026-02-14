import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST() {
  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    return NextResponse.json(
      { error: "SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant" },
      { status: 500 }
    );
  }

  const supabase = createClient(url, serviceKey, {
    auth: { persistSession: false },
  });

  // Vérifier si l'utilisateur existe déjà
  const { data: existing, error: existingError } =
    await supabase.auth.admin.listUsers({
      page: 1,
      perPage: 100,
    });

  if (existingError) {
    return NextResponse.json(
      { error: existingError.message },
      { status: 500 }
    );
  }

  const found = existing.users.find(
    (u) => u.email && u.email.toLowerCase() === "admin@htb.test"
  );

  if (found) {
    return NextResponse.json(
      { message: "Admin déjà existant", id: found.id },
      { status: 200 }
    );
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: "admin@htb.test",
    password: "AdminHtb@2024",
    email_confirm: true,
    user_metadata: {
      role: "ADMIN",
      full_name: "Admin HTB",
    },
  });

  if (error || !data.user) {
    return NextResponse.json(
      { error: error?.message ?? "Erreur inconnue" },
      { status: 500 }
    );
  }

  // Créer/mettre à jour le profil associé
  const { error: profileError } = await supabase
    .from("profiles")
    .upsert({
      id: data.user.id,
      role: "ADMIN",
      full_name: "Admin HTB",
      phone: "+237600000000",
      email: "admin@htb.test",
    });

  if (profileError) {
    return NextResponse.json(
      { error: profileError.message },
      { status: 500 }
    );
  }

  return NextResponse.json(
    { message: "Admin créé avec succès", id: data.user.id },
    { status: 201 }
  );
}

