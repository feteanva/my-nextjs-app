import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { comparePasswords, createToken, getUserPayload } from "@/lib/auth";

// Development mode credentials
const DEV_EMAIL = "admin@example.com";
const DEV_PASSWORD = "admin123";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Development mode authentication
    if (
      process.env.NODE_ENV === "development" &&
      email === DEV_EMAIL &&
      password === DEV_PASSWORD
    ) {
      // Create a dev admin user payload
      const devUserPayload = {
        id: "dev-admin-id",
        name: "Development Admin",
        email: DEV_EMAIL,
        role: "admin",
        phone: "",
      };

      // Create JWT token
      const token = createToken(devUserPayload);

      // Return success response with dev user
      return NextResponse.json(
        {
          message: "Authentication successful",
          user: devUserPayload,
        },
        {
          status: 200,
          headers: {
            "Set-Cookie": `auth_token=${token}; Path=/; HttpOnly; SameSite=Strict${
              process.env.NODE_ENV !== "development" ? "; Secure" : ""
            }`,
          },
        }
      );
    }

    // Production mode - continue with database authentication
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const passwordMatch = await comparePasswords(password, user.password);

    if (!passwordMatch) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create user payload (without sensitive data)
    const userPayload = getUserPayload(user);

    // Create JWT token
    const token = createToken(userPayload);

    // Return success response
    return NextResponse.json(
      {
        message: "Authentication successful",
        user: userPayload,
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `auth_token=${token}; Path=/; HttpOnly; SameSite=Strict${
            process.env.NODE_ENV === "production" ? "; Secure" : ""
          }`,
        },
      }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
