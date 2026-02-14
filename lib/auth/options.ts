import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.error("[AUTH] Missing Supabase environment variables!");
  console.error("[AUTH] SUPABASE_URL:", supabaseUrl ? "✓" : "✗");
  console.error("[AUTH] SUPABASE_ANON_KEY:", supabaseAnonKey ? "✓" : "✗");
}

const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    })
  : null;

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.error("[AUTH] Missing credentials", credentials?.email);
          throw new Error("Email et mot de passe requis");
        }

        if (!supabase) {
          console.error("[AUTH] Supabase client not initialized - check environment variables");
          throw new Error("Configuration serveur incorrecte. Vérifiez les variables d'environnement.");
        }

        try {
          console.log("[AUTH] Attempting sign in for:", credentials.email);
          
          const { data, error } = await supabase.auth.signInWithPassword({
            email: credentials.email,
            password: credentials.password,
          });

          if (error) {
            console.error("[AUTH] Supabase signIn error:", {
              message: error.message,
              status: error.status,
              name: error.name,
            });
            
            // Messages d'erreur plus explicites
            if (error.message.includes("Invalid login credentials")) {
              throw new Error("Email ou mot de passe incorrect");
            } else if (error.message.includes("Email not confirmed")) {
              throw new Error("Veuillez confirmer votre email avant de vous connecter");
            } else {
              throw new Error(`Erreur de connexion: ${error.message}`);
            }
          }

          if (!data.user) {
            console.error("[AUTH] No user returned from Supabase");
            throw new Error("Aucun utilisateur retourné par Supabase");
          }

          console.log("[AUTH] User authenticated:", data.user.id);

          const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("role, full_name, phone")
            .eq("id", data.user.id)
            .single();

          if (profileError) {
            console.warn("[AUTH] profile fetch error (continuing anyway):", profileError.message);
            // On continue quand même si le profil n'existe pas, on utilise les valeurs par défaut
          } else {
            console.log("[AUTH] profile found:", { role: profile?.role, full_name: profile?.full_name });
          }

          return {
            id: data.user.id,
            email: data.user.email ?? "",
            role: profile?.role ?? "USER",
            full_name: profile?.full_name ?? data.user.email ?? "",
            phone: profile?.phone ?? null,
          } as any;
        } catch (err: any) {
          console.error("[AUTH] Unexpected error in authorize:", err);
          // Si c'est déjà une Error avec un message, on la relance
          if (err instanceof Error) {
            throw err;
          }
          throw new Error("Erreur inattendue lors de la connexion");
        }
      }
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      // Cette fonction est appelée après authorize
      // Si authorize retourne null ou lance une erreur, cette fonction ne sera pas appelée
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id;
        token.role = (user as any).role;
        token.full_name = (user as any).full_name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).full_name = token.full_name;
      }
      return session;
    },
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      console.log("[AUTH] Sign in successful:", user.email);
    },
  },
  pages: {
    signIn: "/login",
    error: "/api/auth/error",
  },
};

