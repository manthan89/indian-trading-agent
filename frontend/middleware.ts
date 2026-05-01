import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Public routes — always allow
  const publicRoutes = [
    "/",
    "/login",
    "/signup",
    "/pricing",
    "/auth/callback",
  ];

  const isPublic = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + "/"));
  if (isPublic) {
    const response = NextResponse.next();
    // Prevent caching of HTML pages
    response.headers.set("Cache-Control", "no-cache, no-store, must-revalidate");
    return response;
  }

  // Protected routes — require auth
  const isProtected = pathname.startsWith("/app") || pathname.startsWith("/analysis") || pathname.startsWith("/recommendations") || pathname.startsWith("/scanner") || pathname.startsWith("/strategies") || pathname.startsWith("/performance") || pathname.startsWith("/simulation") || pathname.startsWith("/insights") || pathname.startsWith("/backtest") || pathname.startsWith("/charts") || pathname.startsWith("/history") || pathname.startsWith("/settings") || pathname.startsWith("/news");

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for Supabase auth token
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

  const response = NextResponse.next();

  const supabase = createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      get(name: string) {
        return request.cookies.get(name)?.value;
      },
      set(name: string, value: string, options: CookieOptions) {
        request.cookies.set({ name, value, ...options });
        response.cookies.set({ name, value, ...options });
      },
      remove(name: string, options: CookieOptions) {
        request.cookies.set({ name, value: "", ...options });
        response.cookies.set({ name, value: "", ...options });
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
