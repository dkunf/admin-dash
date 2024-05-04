import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";
import { headers } from "next/headers";

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
  //any user logged in?
  //   const token = true;
  const token = request.headers.get("Authorization")?.split(" ")[1];
  if (!token) return NextResponse.redirect(new URL("/", request.url));
  let isAuthed = await verify(token, process.env.JWT_SECRET as string);
  //just fake one for now
  const isViewingDB = request.nextUrl?.pathname.startsWith("/ok");

  const response = NextResponse.next();
  // if (isViewingDB && !isAuthed) {
  //   return NextResponse.redirect(new URL("/", request.url));
  //   // return NextResponse.rewrite(new URL('/', request.url))
  // }
  //   return NextResponse;
  return NextResponse.redirect(new URL("/ok/view-db", request.url));
  // return response;
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: "/ok",
};
