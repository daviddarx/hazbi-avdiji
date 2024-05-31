import DarkModeTypewitcherButton from '@/components/layout/DarkModeSwitcherButton';
import Icon from '@/components/ui/Icon';
import t from '@/content/translations';
import { uiStateType } from '@/store/ui-slice';
import { MenuMotionVariants } from '@/utils/core';
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
    <div
      className={classNames('lg:transition-opacity lg:duration-300', {
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
                  variants={MenuMotionVariants}
                  anchor='bottom end'
                  className='bg-blurred border-light relative z-60 mt-16 min-w-[200px] origin-top rounded-xl border'
                >
                  <div className='subtitle px-24 py-12 text-sm'>{t.darkModeSwitcher.title}</div>

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
