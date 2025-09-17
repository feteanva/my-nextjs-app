import { NextRequest, NextResponse } from "next/server";
import { getSECookies } from "@/lib/cookie-manager";

// Simple in-memory cache for responses
const responseCache = new Map<string, { data: unknown; timestamp: number }>();

// Clean old cache entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of responseCache.entries()) {
    if (now - value.timestamp > 10 * 60 * 1000) {
      responseCache.delete(key);
    }
  }
}, 10 * 60 * 1000);

// Add a small delay to avoid rate limiting
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function GET(request: NextRequest) {
  try {
    // Get the search params from the request
    const { searchParams } = new URL(request.url);
    const contractAccount = searchParams.get("contractAccount");
    const isEncrypt = searchParams.get("isEncrypt");

    if (!contractAccount) {
      return NextResponse.json(
        { error: "contractAccount parameter is required" },
        { status: 400 }
      );
    }

    // Check cache first
    const cacheKey = `${contractAccount}-${isEncrypt}`;
    const cached = responseCache.get(cacheKey);
    if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
      console.log("Returning cached response for:", contractAccount);
      return NextResponse.json(cached.data);
    }

    // Get fresh cookies from SE website
    console.log("Fetching fresh cookies from SE...");
    const freshCookies = await getSECookies();

    // Add a small delay to mimic human behavior
    await delay(Math.random() * 1000 + 500);

    // Construct the SE API URL
    const seApiUrl = `https://www.se.com.sa/api/BillDetails/GetViewBillGuest?contractAccount=${encodeURIComponent(
      contractAccount
    )}&isEncrypt=${isEncrypt || "true"}`;

    console.log("Making request to SE API with fresh cookies");

    // Make the API request with optimal headers
    const response = await fetch(seApiUrl, {
      method: "GET",
      headers: {
        accept: "application/json, text/plain, */*",
        "accept-language": "ar-SA",
        "content-type": "application/json",
        "request-from": "07", // Crucial header for SE API
        "sec-ch-ua": '"Chromium";v="139", "Not;A=Brand";v="99"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-requested-with": "XMLHttpRequest",
        Referer: "https://www.se.com.sa/ar-SA/GuestViewBill",
        cookie: freshCookies,
      },
    });

    console.log("SE API Response status:", response.status);

    if (!response.ok) {
      throw new Error(`SE API error: ${response.status}`);
    }

    const data = await response.json();

    // Check if we got a valid response (not blocked)
    if (data.Error?.ErrorMessage?.includes("لا يمكننا متابعة طلبك")) {
      throw new Error("Request was blocked by SE API protection");
    }

    // Cache the response
    responseCache.set(cacheKey, { data, timestamp: Date.now() });

    console.log("SE API response received");

    // Return exactly what SE returns - no modifications
    return NextResponse.json(data);
  } catch (error) {
    console.error("Error in SE API proxy:", error);

    let errorMessage = "هناك خطأ ما. حاول مرة اخرى";

    // Check if it's a network error (no internet or failed to fetch)
    if (error instanceof Error) {
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError") ||
        error.message.includes("fetch") ||
        error.name === "TypeError" ||
        error.message.includes("ERR_NETWORK") ||
        error.message.includes("ERR_INTERNET_DISCONNECTED") ||
        error.message.includes("ENOTFOUND") ||
        error.message.includes("ECONNREFUSED") ||
        error.message.includes("ETIMEDOUT")
      ) {
        errorMessage = "هناك خطأ ما. حاول مرة اخرى";
      } else {
        // For other errors, we can still use the original message or default Arabic
        errorMessage = "هناك خطأ ما. حاول مرة اخرى";
      }
    }

    return NextResponse.json(
      {
        d: null,
        ErrorCode: null,
        Error: {
          ErrorMessage: errorMessage,
        },
      },
      { status: 500 }
    );
  }
}
