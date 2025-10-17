import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const token = req.nextauth.token;

    // Protect submit route - requires authentication
    if (pathname.startsWith("/submit")) {
      if (!token) {
        return NextResponse.redirect(new URL("/auth/signin", req.url));
      }
    }

    // Protect queue route - requires EDITOR or ADMIN role
    if (pathname.startsWith("/queue")) {
      if (!token || (token.role !== "EDITOR" && token.role !== "ADMIN")) {
        return NextResponse.redirect(new URL("/", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Allow access to public routes
        const { pathname } = req.nextUrl;
        if (
          pathname === "/" ||
          pathname.startsWith("/word/") ||
          pathname.startsWith("/regions") ||
          pathname.startsWith("/api/")
        ) {
          return true;
        }
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/submit/:path*", "/queue/:path*"],
};
