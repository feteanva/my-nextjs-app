import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, createToken } from "@/lib/auth";

export async function PUT(request: NextRequest) {
  try {
    // Get current user from auth token
    const currentUser = await getCurrentUser();

    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get request body
    const body = await request.json();
    const { name, email, phone } = body;

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Check if email is already in use by another user
    if (email !== currentUser.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          id: {
            not: currentUser.id,
          },
        },
      });

      if (existingUser) {
        return NextResponse.json(
          { error: "Email is already in use" },
          { status: 409 }
        );
      }
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data: {
        name,
        email,
        phone,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
      },
    });

    console.log(updatedUser);

    // Generate new token with updated info
    const newToken = createToken({
      ...updatedUser,
      phone: updatedUser.phone || "",
    });

    // Prepare response
    const response = NextResponse.json({
      message: "Profile updated successfully",
      user: updatedUser,
    });

    // Update auth token cookie
    response.cookies.set({
      name: "auth_token",
      value: newToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24, // 1 day
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
