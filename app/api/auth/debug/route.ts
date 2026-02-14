import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  const checks = {
    supabaseUrl: !!process.env.SUPABASE_URL,
    supabaseAnonKey: !!process.env.SUPABASE_ANON_KEY,
    nextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    supabaseUrlValue: process.env.SUPABASE_URL ? `${process.env.SUPABASE_URL.substring(0, 20)}...` : "NOT SET",
  };

  if (!checks.supabaseUrl || !checks.supabaseAnonKey) {
    return NextResponse.json({
      error: "Variables d'environnement manquantes",
      checks,
      message: "Vérifiez que SUPABASE_URL et SUPABASE_ANON_KEY sont définis dans .env.local",
    }, { status: 500 });
  }

  // Tester la connexion Supabase
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_ANON_KEY!,
      { auth: { persistSession: false } }
    );

    // Tester une requête simple
    const { data, error } = await supabase.from("profiles").select("count").limit(1);

    return NextResponse.json({
      success: true,
      checks,
      supabaseConnection: error ? { error: error.message } : { success: true },
      message: "Configuration correcte",
    });
  } catch (err: any) {
    return NextResponse.json({
      error: "Erreur de connexion à Supabase",
      checks,
      details: err.message,
    }, { status: 500 });
  }
}
