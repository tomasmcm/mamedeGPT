import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { writable } from 'svelte/store';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const chatMessages = writable([]);
export const query = writable('');