import { withAuth } from "next-auth/middleware";
import type { NextRequestWithAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ req, token }) => {
      if (!token) return false;
      const url = req.nextUrl.pathname;
      const role = (token as any).role as string | undefined;
      
      if (url.startsWith("/dashboard")) {
        // Dashboard back-office : ADMIN, MANAGER, STAFF uniquement
        return role === "ADMIN" || role === "MANAGER" || role === "STAFF";
      }
      
      if (url.startsWith("/espace-client")) {
        // Espace client : USER uniquement
        return role === "USER";
      }
      
      if (url.startsWith("/reservation")) {
        // Réservation : USER uniquement
        return role === "USER";
      }
      
      return true;
    },
  },
});

export const config = {
  matcher: ["/dashboard/:path*", "/espace-client/:path*", "/reservation/:path*"],
};

