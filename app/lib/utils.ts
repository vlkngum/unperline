import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Tailwind class'larını güvenle birleştirir.
 * Çakışanları ayıklar, geriye sade bir iz bırakır.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
