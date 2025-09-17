import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyToken, getCurrentUser } from "@/lib/auth";
import { cookies } from "next/headers";

export const revalidate = 1800; // 30 minutes

export async function GET(request: NextRequest) {
  try {
    // Get current user from auth token
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Return user data (without password)
    return NextResponse.json(
      { user },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
