import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Minimal middleware — Supabase session is managed client-side via supabase-js.
export async function middleware(request: NextRequest) {
  return NextResponse.next({ request });
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
