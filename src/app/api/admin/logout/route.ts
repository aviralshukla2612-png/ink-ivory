import { NextRequest, NextResponse } from "next/server";
import { ADMIN_COOKIE_NAME } from "@/lib/auth";
import { logSecurityEvent } from "@/lib/security/logger";

export async function POST(request: NextRequest) {
  const response = NextResponse.json({
    success: true,
    message: "Administrative session terminated successfully.",
  });

  // Clear admin session cookie
  response.cookies.set({
    name: ADMIN_COOKIE_NAME,
    value: "",
    path: "/",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    sameSite: "strict",
  });

  logSecurityEvent({
    event: "ADMIN_LOGOUT",
    level: "INFO",
  });

  return response;
}
