import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all paths except:
     * - _next/static, _next/image (bundled assets)
     * - favicon, sitemap.xml, robots.txt, icon.svg
     * - /api routes (they handle auth themselves when needed)
     * - IndexNow verification files (*.txt with hex names in /public)
     */
    "/((?!_next/static|_next/image|favicon.ico|icon.svg|sitemap.xml|robots.txt|api/|[a-f0-9]{32}\\.txt$).*)",
  ],
};