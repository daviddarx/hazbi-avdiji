import t from '@/content/translations';
import { getLocale } from '@/utils/locale';
import { useRouter } from 'next/router';

/**
 * Returns the translation object for the current locale.
 * Uses the router locale, falling back to 'fr' for the 'default' pseudo-locale.
 *
 * @returns The translations for the active locale
 */
export default function useTranslations() {
  const { locale } = useRouter();
  return t[getLocale(locale)];
}
