import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  createToken,
  getUserPayload,
  hashPassword,
  setAuthCookie,
} from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, password, role = "operator" } = body;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email and password are required" },
        { status: 400 }
      );
    }

    // Validate role
    if (role !== "admin" && role !== "operator") {
      return NextResponse.json(
        { error: "Invalid role. Must be either 'admin' or 'operator'" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
      where: { email },
    });

    if (userExists) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create user in database
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    // Create user payload (without sensitive data)
    const userPayload = getUserPayload(newUser);

    // Create JWT token
    const token = createToken(userPayload);

    // Set the token as a cookie
    await setAuthCookie(token);

    return NextResponse.json(
      {
        message: "User created successfully",
        user: userPayload,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Signup error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
