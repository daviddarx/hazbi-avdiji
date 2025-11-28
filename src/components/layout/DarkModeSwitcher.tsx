import DarkModeTypewitcherButton from '@/components/layout/DarkModeSwitcherButton';
import Icon from '@/components/ui/Icon';
import t from '@/content/translations';
import { uiStateType } from '@/store/ui-slice';
import { getMenuMotionVariants } from '@/utils/core';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export type darkModeType = 'light' | 'dark' | 'system';

type darkModeOption = {
  label: string;
  value: darkModeType;
};

const options: darkModeOption[] = [
  {
    label: t.darkModeSwitcher.options.light,
    value: 'light',
  },
  {
    label: t.darkModeSwitcher.options.dark,
    value: 'dark',
  },
  {
    label: t.darkModeSwitcher.options.system,
    value: 'system',
  },
];

export default function DarkModeSwitcher() {
  const [darkMode, setDarkMode] = useState<darkModeType>();
  const [isDark, setIsDark] = useState(false);
  const hiddenTopBar = useSelector((state: uiStateType) => state.ui.hiddenTopBar);

  const applyDarkMode = () => {
    document.documentElement.classList.add('dark');
    setIsDark(true);
  };

  const removeDarkMode = () => {
    document.documentElement.classList.remove('dark');
    setIsDark(false);
  };

  const applySystemPreference = () => {
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      applyDarkMode();
    } else {
      removeDarkMode();
    }
  };

  useEffect(() => {
    // Initialize dark mode from localStorage or default to system
    const storedTheme = localStorage.theme;
    if (!storedTheme || storedTheme === 'system') {
      setDarkMode('system');
      applySystemPreference();
      localStorage.theme = 'system';
    } else if (storedTheme === 'dark') {
      setDarkMode('dark');
      applyDarkMode();
    } else {
      setDarkMode('light');
      removeDarkMode();
    }
  }, []);

  const handleChange = (mode: darkModeType) => {
    setDarkMode(mode);

    switch (mode) {
      case 'light':
        removeDarkMode();
        localStorage.theme = 'light';
        break;
      case 'dark':
        applyDarkMode();
        localStorage.theme = 'dark';
        break;
      case 'system':
        localStorage.theme = 'system';
        applySystemPreference();
        break;
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
              <Icon name={isDark ? 'dark' : 'light'} />
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
                  <div className='navigation-subtitle'>{t.darkModeSwitcher.title}</div>

                  {options.map((option) => (
                    <DarkModeTypewitcherButton
                      key={option.value}
                      label={option.label}
                      value={option.value}
                      onClick={(value: darkModeType) => {
                        handleChange(value);
                      }}
                      active={darkMode === option.value}
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
