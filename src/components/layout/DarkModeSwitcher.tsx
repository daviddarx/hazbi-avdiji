import DarkModeTypewitcherButton from '@/components/layout/DarkModeSwitcherButton';
import Icon from '@/components/ui/Icon';
import { MenuMotionVariants } from '@/utils/core';
import { Menu, MenuButton, MenuItems } from '@headlessui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export type darkModeType = 'light' | 'dark' | 'system';

type darkModeOption = {
  label: string;
  value: darkModeType;
};

const options: darkModeOption[] = [
  {
    label: 'Clair',
    value: 'light',
  },
  {
    label: 'Sombre',
    value: 'dark',
  },
  {
    label: 'Système',
    value: 'system',
  },
];

export default function DarkModeSwitcher({ className }: { className?: string }) {
  const [darkMode, setDarkMode] = useState<darkModeType>();
  const [isDark, setIsDark] = useState(false);

  const applyDarkMode = () => {
    document.documentElement.classList.add('dark');
    localStorage.theme = 'dark';
    setIsDark(true);
  };

  const removeDarkMode = () => {
    document.documentElement.classList.remove('dark');
    localStorage.theme = 'light';
    setIsDark(false);
  };

  useEffect(() => {
    if (!('theme' in localStorage)) {
      setDarkMode('system');
    } else {
      setDarkMode(localStorage.theme === 'dark' ? 'dark' : 'light');
      setIsDark(localStorage.theme === 'dark');
    }
  }, []);

  const handleChange = (mode: darkModeType) => {
    switch (mode) {
      case 'light':
        removeDarkMode();
        break;
      case 'dark':
        applyDarkMode();
        break;
      default:
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          applyDarkMode();
        } else {
          removeDarkMode();
        }
    }

    setDarkMode(mode);
  };

  return (
    <div className={className}>
      <Menu>
        {({ open }) => (
          <>
            <MenuButton className='border-light data-[open]:bg-themed-prev bg-blurred data-[open]:!border-strong relative z-100 rounded-full p-16 transition-colors duration-200 ease-out'>
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
                  variants={MenuMotionVariants}
                  anchor='bottom end'
                  className='bg-blurred border-light relative z-60 mt-16 min-w-[200px] origin-top rounded-xl'
                >
                  <div className='subtitle px-24 py-12 text-sm'>Apparence</div>

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
