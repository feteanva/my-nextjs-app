/**
 * Dynamic cookie management for SE API
 */

// Cache cookies for 10 minutes to avoid too many requests to SE
const COOKIE_CACHE_DURATION = 10 * 60 * 1000; // 10 minutes

interface CookieCache {
  cookies: string;
  timestamp: number;
}

let cookieCache: CookieCache | null = null;

/**
 * Fetch fresh cookies from SE website
 */
async function fetchFreshCookies(): Promise<string> {
  try {
    console.log("Fetching fresh cookies from SE website...");

    const response = await fetch("https://www.se.com.sa/ar-SA/GuestViewBill", {
      method: "GET",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/139.0.0.0 Mobile Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Language": "ar-SA,ar;q=0.9,en-US;q=0.8,en;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "sec-ch-ua": '"Chromium";v="139", "Not;A=Brand";v="99"',
        "sec-ch-ua-mobile": "?1",
        "sec-ch-ua-platform": '"Android"',
        "sec-fetch-dest": "document",
        "sec-fetch-mode": "navigate",
        "sec-fetch-site": "none",
        "upgrade-insecure-requests": "1",
        "cache-control": "no-cache",
        pragma: "no-cache",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch SE page: ${response.status}`);
    }

    // Extract cookies from Set-Cookie headers
    const setCookieHeaders = response.headers.getSetCookie?.() || [];

    // Fallback for older Node.js versions
    if (setCookieHeaders.length === 0) {
      const setCookieHeader = response.headers.get("set-cookie");
      if (setCookieHeader) {
        // Handle multiple cookies in a single header
        const cookieArray = Array.isArray(setCookieHeader)
          ? setCookieHeader
          : [setCookieHeader];
        setCookieHeaders.push(...cookieArray);
      }
    }

    if (setCookieHeaders.length === 0) {
      console.warn("No cookies received from SE website, using fallback");
      // Return empty string - the API might still work without cookies
      return "";
    }

    // Parse and format cookies
    const cookies = setCookieHeaders
      .map((cookie) => cookie.split(";")[0]) // Get only the name=value part
      .filter((cookie) => cookie.includes("=")) // Ensure it's a valid cookie
      .join("; ");

    console.log(
      `Successfully fetched ${setCookieHeaders.length} cookies from SE`
    );
    return cookies;
  } catch (error) {
    console.error("Error fetching cookies from SE:", error);
    throw error;
  }
}

/**
 * Get cookies (from cache if fresh, otherwise fetch new ones)
 */
export async function getSECookies(): Promise<string> {
  const now = Date.now();

  // Check if we have cached cookies that are still fresh
  if (cookieCache && now - cookieCache.timestamp < COOKIE_CACHE_DURATION) {
    console.log("Using cached SE cookies");
    return cookieCache.cookies;
  }

  // Fetch fresh cookies
  try {
    const freshCookies = await fetchFreshCookies();

    // Update cache
    cookieCache = {
      cookies: freshCookies,
      timestamp: now,
    };

    return freshCookies;
  } catch (error) {
    // If fetching fails and we have old cached cookies, use them as fallback
    if (cookieCache) {
      console.warn(
        "Failed to fetch fresh cookies, using cached ones as fallback"
      );
      return cookieCache.cookies;
    }

    throw error;
  }
}

/**
 * Clear cookie cache (useful for testing or forcing refresh)
 */
export function clearCookieCache(): void {
  cookieCache = null;
  console.log("SE cookie cache cleared");
}

/**
 * Get cookie cache info (useful for debugging)
 */
export function getCookieCacheInfo(): {
  hasCachedCookies: boolean;
  age?: number;
  expires?: number;
} {
  if (!cookieCache) {
    return { hasCachedCookies: false };
  }

  const now = Date.now();
  const age = now - cookieCache.timestamp;
  const expires = COOKIE_CACHE_DURATION - age;

  return {
    hasCachedCookies: true,
    age: Math.floor(age / 1000), // age in seconds
    expires: Math.floor(expires / 1000), // expires in seconds
  };
}
