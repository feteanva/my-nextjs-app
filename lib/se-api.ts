/**
 * Saudi Electric API utilities
 */

import { generateEncryptedContractAccount } from "./encryption";
import { type SEApiResponse } from "./types";

/**
 * Fetch bill details from Saudi Electric API
 */
export async function getBillDetails(
  accountNumber: string
): Promise<SEApiResponse> {
  try {
    // Generate encrypted contract account using SE's real encryption
    const encryptedAccount = await generateEncryptedContractAccount(
      accountNumber
    );

    // Construct the API URL using our custom API route
    const apiUrl = `/api/se?contractAccount=${encodeURIComponent(
      encryptedAccount
    )}&isEncrypt=true`;

    // Make the API call
    const response = await fetch(apiUrl, {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SEApiResponse = await response.json();
    return data; // Return SE's response as-is
  } catch (error) {
    console.error("SE API Error:", error);

    // Check if it's a network error (no internet or failed to fetch)
    if (error instanceof Error) {
      if (
        error.message.includes("Failed to fetch") ||
        error.message.includes("NetworkError") ||
        error.message.includes("fetch") ||
        error.name === "TypeError" ||
        error.message.includes("ERR_NETWORK") ||
        error.message.includes("ERR_INTERNET_DISCONNECTED")
      ) {
        throw new Error("هناك خطأ ما. حاول مرة اخرى");
      }
    }

    throw error;
  }
}

// Alias for backward compatibility
export const getBillDetailsWithFallback = getBillDetails;

/**
 * Format currency amount
 */
export function formatCurrency(
  amount: string,
  currency: string = "SAR"
): string {
  const numAmount = parseFloat(amount);
  if (isNaN(numAmount)) return amount;

  return new Intl.NumberFormat("ar-SA", {
    style: "currency",
    currency: currency,
  }).format(numAmount);
}

/**
 * Format date from API timestamp
 */
export function formatDate(dateString: string): string {
  try {
    // Handle the /Date(timestamp)/ format from the API
    const match = dateString.match(/\/Date\((\d+)\)\//);
    if (match) {
      const timestamp = parseInt(match[1]);
      const date = new Date(timestamp);
      return date.toLocaleDateString("ar-SA");
    }

    // Fallback to regular date parsing
    return new Date(dateString).toLocaleDateString("ar-SA");
  } catch (_error: unknown) {
    return dateString;
  }
}
