import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";
export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/api/orders")) {
    const token = request.headers.get("Authorization")?.split(" ")[1];
    if (token) {
      try {
        const decoded = await jwtVerify(
          token,
          new TextEncoder().encode(process.env.JWT_KEY)
        );
        const userId = decoded.payload.userid;

        const headers = new Headers(request.headers);
        headers.set("UserId", userId as string);
        return NextResponse.next({
          request: {
            headers: headers,
          },
        });
      } catch (err) {
        return new NextResponse(JSON.stringify({ message: "Invalid Token" }), {
          status: 401,
        });
      }
    }

    return NextResponse.next();
  }
}
