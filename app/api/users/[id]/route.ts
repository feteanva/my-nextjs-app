import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser, hashPassword } from "@/lib/auth";
import { Prisma } from "@prisma/client";

// Update a user
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Get current user from auth token
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, role, password } = body;

    // Basic validation
    if (!name || !email) {
      return NextResponse.json(
        { error: "Name and email are required" },
        { status: 400 }
      );
    }

    // Validate role if provided
    if (role && role !== "admin" && role !== "operator") {
      return NextResponse.json(
        { error: "Invalid role. Must be either 'admin' or 'operator'" },
        { status: 400 }
      );
    }

    // Check if email is already in use by another user
    const existingUser = await prisma.user.findFirst({
      where: {
        email,
        id: {
          not: id,
        },
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email is already in use" },
        { status: 409 }
      );
    }

    // Prepare update data
    const updateData: Prisma.UserUpdateInput = {
      name,
      email,
      role,
    };

    // Add password to update data if provided
    if (password) {
      updateData.password = await hashPassword(password);
    }

    // Update user in database
    const updatedUser = await prisma.user.update({
      where: {
        id: id,
      },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Delete a user
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    // Get current user from auth token
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Delete user from database
    await prisma.user.delete({
      where: {
        id: id,
      },
    });

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
