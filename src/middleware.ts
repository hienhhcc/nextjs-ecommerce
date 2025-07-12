import { isValidPassword } from "@/lib/isValidPassword";
import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  if ((await isAuthenticated(req)) === false) {
    return new NextResponse("Unauthorized", {
      status: 401,
      headers: {
        "WWW-Authenticate": "Basic",
      },
    });
  }
}

export const config = {
  matcher: "/admin/:path*",
};

async function isAuthenticated(req: NextRequest) {
  const authHeader =
    req.headers.get("authorization") || req.headers.get("Authorization");

  if (authHeader == null || authHeader === "") {
    return false;
  }

  const [inputUsername, inputPassword] = Buffer.from(
    authHeader.split(" ")[1],
    "base64"
  )
    .toString()
    .split(":");

  return (
    inputUsername === process.env.ADMIN_USERNAME &&
    (await isValidPassword(
      inputPassword,
      process.env.ADMIN_HASHED_PASSWORD as string
    ))
  );
}
