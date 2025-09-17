import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export const revalidate = 300; // 5 minutes

// GET endpoint to fetch the current site info
export async function GET() {
  try {
    // Fetch all relevant settings in a single query
    const settings = await prisma.setting.findMany({
      where: {
        key: {
          in: ["domain"],
        },
      },
      select: {
        key: true,
        value: true,
      },
    });

    // Map settings to an object for easy access
    const settingsMap = settings.reduce((acc, setting) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);

    return NextResponse.json(
      {
        domain: settingsMap["domain"] || "https://karinity.com",
      },
      {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, s-maxage=300, stale-while-revalidate=300",
        },
      }
    );
  } catch (error) {
    console.error("Error fetching site info:", error);
    return NextResponse.json(
      { error: "Failed to fetch site info settings" },
      { status: 500 }
    );
  }
}

// PUT endpoint to update the site info
export async function PUT(request: NextRequest) {
  try {
    // Get current user from auth token
    const user = await getCurrentUser();

    // Check if user is authenticated and is an admin
    if (!user || user.role !== "admin") {
      return NextResponse.json({ error: "Not authorized" }, { status: 403 });
    }

    const { domain } = await request.json();

    if (!domain) {
      return NextResponse.json(
        { error: "At least one setting is required" },
        { status: 400 }
      );
    }

    // Update site name if provided
    if (domain) {
      await prisma.setting.upsert({
        where: { key: "domain" },
        update: { value: domain },
        create: { key: "domain", value: domain },
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating site info:", error);
    return NextResponse.json(
      { error: "Failed to update site info settings" },
      { status: 500 }
    );
  }
}
