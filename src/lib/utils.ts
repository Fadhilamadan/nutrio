import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function percentage(current: number, target: number) {
  if (target <= 0) {
    return 0;
  }

  return Math.min(Math.round((current / target) * 100), 100);
}
