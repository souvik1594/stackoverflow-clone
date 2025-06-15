import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import dbSetup from "@/models/server/dbSetup";
import storageSetup from "@/models/server/storageSetup";

// This function can be marked `async` if using `await` inside
export async function middleware() {
  await Promise.all([dbSetup(), storageSetup()]);
  return NextResponse.next();
}
// See "Matching Paths" below to learn more
export const config = {
  /*match all request paths except for the ones starts with
    - api
    - _next/static
    - _next/image
    - favicon.ico
    */
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
