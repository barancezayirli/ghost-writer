import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function stripHtml(html: string) {
  return html.replace(/<[^>]*>/g, '');
}

export function getTextStats(text: string) {
  const plainText = stripHtml(text).trim();
  return {
    characters: plainText.replace(/\s/g, '').length,
    words: plainText.split(/\s+/).filter((word) => word.length > 0).length,
  };
}
