import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// On utilise la clé service_role côté serveur ONLY, jamais côté client.
const supabaseUrl = process.env.SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "[REGISTER] SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY manquant dans l'environnement"
  );
}

const supabase =
  supabaseUrl && serviceRoleKey
    ? createClient(supabaseUrl, serviceRoleKey, {
        auth: { persistSession: false },
      })
    : null;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { full_name, email, password, phone } = body;

    if (!full_name || !email || !password) {
      return NextResponse.json(
        { error: "Nom, email et mot de passe sont obligatoires" },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 6 caractères" },
        { status: 400 }
      );
    }

    if (!supabase) {
      return NextResponse.json(
        {
          error:
            "Configuration Supabase invalide côté serveur. Vérifiez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 }
      );
    }

    // Créer l'utilisateur dans Supabase Auth avec email confirmé (pas de lien de confirmation)
    const { data: created, error: createError } =
      await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
          full_name,
          phone: phone || null,
        },
      });

    if (createError || !created.user) {
      return NextResponse.json(
        {
          error:
            createError?.message ??
            "Erreur lors de la création du compte (admin.createUser)",
        },
        { status: 400 }
      );
    }

    const userId = created.user.id;

    // Créer / mettre à jour le profil dans la table profiles
    const { error: profileError } = await supabase.from("profiles").upsert({
      id: userId,
      role: "USER",
      full_name,
      email,
      phone: phone || null,
    });

    if (profileError) {
      console.error("[REGISTER] Profile upsert error:", profileError);
      return NextResponse.json(
        {
          error:
            "Compte créé mais erreur lors de la création du profil. Contactez l'administrateur.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Compte créé avec succès", userId },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("[REGISTER] Unexpected error:", error);
    return NextResponse.json(
      { error: error.message ?? "Erreur serveur" },
      { status: 500 }
    );
  }
}
