import type { Locale } from '@/content/translations';

/**
 * Converts a raw Next.js locale string to a typed Locale.
 * Falls back to 'fr' for the 'default' pseudo-locale and any unknown values.
 *
 * @param locale - The locale string from `useRouter().locale` or `context.locale`
 * @returns A valid Locale ('fr' | 'en')
 */
export function getLocale(locale: string | undefined): Locale {
  if (locale === 'fr' || locale === 'en') return locale;
  return 'fr';
}
