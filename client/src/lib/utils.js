import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatDate(date) {
  if (!date) return 'N/A';

  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(date));
  } catch (error) {
    return 'Invalid Date';
  }
}

export function formatDateTime(date) {
  if (!date) return 'N/A';

  try {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(new Date(date));
  } catch (error) {
    return 'Invalid Date';
  }
}

export const formatInstructions = text => {
  if (!text) return '—';
  let t = String(text);

  // If the string contains escaped newline sequences like "\n" (two chars),
  // convert them to real newlines.
  t = t.replace(/\\r?\\n/g, '\n').replace(/\\n/g, '\n');

  // Collapse 3+ newlines to max 2 for cleaner spacing
  t = t.replace(/\n{3,}/g, '\n\n');

  // Trim whitespace on each line
  t = t
    .split('\n')
    .map(line => line.trim())
    .join('\n');

  return t;
};
