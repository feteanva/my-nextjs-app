import { NextResponse } from "next/server";
import { getCookieCacheInfo, clearCookieCache } from "@/lib/cookie-manager";

export async function GET() {
  try {
    const cacheInfo = getCookieCacheInfo();
    return NextResponse.json({
      success: true,
      cacheInfo,
      message: cacheInfo.hasCachedCookies
        ? `Cookies cached ${cacheInfo.age}s ago, expires in ${cacheInfo.expires}s`
        : "No cached cookies",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    clearCookieCache();
    return NextResponse.json({
      success: true,
      message: "Cookie cache cleared successfully",
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
