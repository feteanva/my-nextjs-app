import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Parses Microsoft JSON date format /Date(timestamp)/ to a JavaScript Date
 * @param dateString - Date string in format "/Date(1759017600000)/"
 * @returns JavaScript Date object or null if invalid
 */
export function parseMicrosoftDate(
  dateString: string | null | undefined
): Date | null {
  if (!dateString) return null;

  const match = dateString.match(/\/Date\((\d+)\)\//);
  if (!match) return null;

  const timestamp = parseInt(match[1], 10);
  return new Date(timestamp);
}

/**
 * Gets formatted date parts for display
 * @param dateString - Microsoft JSON date string
 * @returns Object with dateText and year
 */
export function getDateParts(
  dateString: string | null | undefined,
  isMinusDate: boolean = false
) {
  const date = parseMicrosoftDate(dateString);
  if (!date) return { dateText: "", year: "" };

  // If we need to subtract a day, do it properly using setDate
  if (isMinusDate) {
    date.setDate(date.getDate() - 1);
  }

  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();

  return {
    dateText: `${day} ${month}, `,
    year: year.toString(),
  };
}
