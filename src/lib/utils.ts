import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { format, parse } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = (today.getMonth() + 1).toString().padStart(2, '0');
  const day = today.getDate().toString().padStart(2, '0');
  return `${year}${month}${day}`;
}

export async function sha256(str: string): Promise<string> {
  // Normalize the answer: trim whitespace and convert to lowercase
  const normalizedStr = str.trim().toLowerCase().replace(/\s+/g, '');
  const buffer = new TextEncoder().encode(normalizedStr);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  return hashHex;
}

export function formatDisplayDate(dateStr: string): string {
  // Assumes dateStr is in 'YYYYMMDD' format
  try {
    const date = parse(dateStr, 'yyyyMMdd', new Date());
    return format(date, 'MMMM d, yyyy');
  } catch (e) {
    console.error("Error formatting date:", e);
    // Fallback for invalid date string, or return YYYY-MM-DD
    if (dateStr && dateStr.length === 8) {
      return `${dateStr.substring(0, 4)}-${dateStr.substring(4, 6)}-${dateStr.substring(6, 8)}`;
    }
    return dateStr; // or a default error message
  }
}
