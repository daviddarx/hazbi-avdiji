import type { Locale } from '@/content/translations';

/**
 * Converts a raw Next.js locale string to a typed Locale.
 * Falls back to 'fr' (default locale) for any unknown values.
 */
export function getLocale(locale: string | undefined): Locale {
  if (locale === 'fr' || locale === 'en') return locale;
  return 'fr';
}
