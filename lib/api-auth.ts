import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth/options";

export type Role = "ADMIN" | "MANAGER" | "STAFF" | "USER";

export interface AuthUser {
  id: string;
  email: string;
  role: Role;
  full_name?: string;
}

const PROTECT_API = process.env.PROTECT_API !== "false";

/**
 * Récupère la session et l'utilisateur authentifié.
 * Retourne une NextResponse d'erreur si non authentifié.
 */
export async function requireAuth(): Promise<
  | { user: AuthUser; error?: never }
  | { user?: never; error: NextResponse }
> {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      error: NextResponse.json({ error: "Unauthenticated" }, { status: 401 }),
    };
  }

  const user = session.user as AuthUser;
  return { user };
}

/**
 * Vérifie que l'utilisateur a l'un des rôles autorisés.
 */
export function requireRole(user: AuthUser, allowed: Role[]): NextResponse | null {
  if (!PROTECT_API) return null;
  if (!allowed.includes(user.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}
