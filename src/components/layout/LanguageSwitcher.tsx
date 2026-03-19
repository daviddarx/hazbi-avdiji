import LanguageSwitcherButton from '@/components/layout/LanguageSwitcherButton';
import useTranslations from '@/hooks/useTranslations';
import { uiStateType } from '@/store/ui-slice';
import { getMenuMotionVariants } from '@/utils/core';
import { getLocale } from '@/utils/locale';
import { postRoutes } from '@/utils/tina';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { useSelector } from 'react-redux';

type TranslationProps = {
  slug: string;
  locale: string;
  isPost?: boolean;
} | null;

const localeOptions = [
  { label: 'Français', value: 'fr' as const },
  { label: 'English', value: 'en' as const },
];

export default function LanguageSwitcher({
  translationProps,
}: {
  translationProps: TranslationProps;
}) {
  const router = useRouter();
  const t = useTranslations();
  const hiddenTopBar = useSelector((state: uiStateType) => state.ui.hiddenTopBar);
  const currentLocale = getLocale(router.locale);

  const handleChange = (targetLocale: string) => {
    if (targetLocale === currentLocale) return;

    localStorage.setItem('preferred-locale', targetLocale);

    if (translationProps && translationProps.locale === targetLocale) {
      const basePath = translationProps.isPost
        ? `${postRoutes[targetLocale]}/${translationProps.slug}`
        : translationProps.slug
          ? `/${translationProps.slug}`
          : '/';
      router.push(basePath, undefined, { locale: targetLocale });
    } else {
      router.push('/', undefined, { locale: targetLocale });
    }
  };

  return (
    <div
      className={classNames('pointer-events-auto lg:transition-opacity lg:duration-300', {
        'lg:opacity-0 lg:duration-1000': hiddenTopBar,
      })}
    >
      <Menu>
        {({ open }) => (
          <>
            <MenuButton className='border-light data-[open]:bg-themed-prev bg-blurred data-[open]:!border-strong hashover:hover:bg-themed-prev hashover:hover:!border-strong relative z-100 rounded-full border p-16 transition-colors duration-200 ease-out lg:p-20'>
              <span className='text-sm font-bold uppercase lg:text-base'>{currentLocale}</span>
            </MenuButton>
            <AnimatePresence>
              {open && (
                <MenuItems
                  static
                  as={motion.div}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  variants={getMenuMotionVariants(window?.innerWidth)}
                  anchor='bottom end'
                  className='navigation-menu-items'
                >
                  <div className='navigation-subtitle'>{t.languageSwitcher.title}</div>

                  {localeOptions.map((option) => (
                    <LanguageSwitcherButton
                      key={option.value}
                      label={option.label}
                      onClick={() => handleChange(option.value)}
                      active={currentLocale === option.value}
                    />
                  ))}
                </MenuItems>
              )}
            </AnimatePresence>
          </>
        )}
      </Menu>
    </div>
  );
}
