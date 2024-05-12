import DarkModeIcon from '@/components/layout/DarkModeIcon';
import DarkModeTypewitcherButton from '@/components/layout/DarkModeSwitcherButton';
import ease from '@/utils/eases';
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

const motionVariants = {
  initial: () => {
    return { opacity: 0, scale: 0.95, y: 30 };
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.35,
      ease: ease.outQuart,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    transition: {
      duration: 0.25,
      ease: ease.outQuart,
    },
  },
};

export default function DarkModeTypewitcher({ className }: { className?: string }) {
  const [darkMode, setDarkMode] = useState<darkModeType>();
  const [isDark, setIsDark] = useState(false);

  const applyDarkMode = () => {
    document.documentElement.classList.add('dark');
    setIsDark(true);
  };

  const removeDarkMode = () => {
    document.documentElement.classList.remove('dark');
    setIsDark(false);
  };

  useEffect(() => {
    if (!('theme' in localStorage)) {
      setDarkMode('system');
    } else {
      setDarkMode(localStorage.theme === 'dark' ? 'dark' : 'light');
    }
  }, []);

  useEffect(() => {
    switch (darkMode) {
      case 'light':
        localStorage.theme = 'light';
        removeDarkMode();
        break;
      case 'dark':
        localStorage.theme = 'dark';
        applyDarkMode();
        break;
      default:
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
          applyDarkMode();
        } else {
          removeDarkMode();
        }
        localStorage.removeItem('theme');
    }
  }, [darkMode]);

  return (
    <div className={className}>
      <Menu>
        {({ open }) => (
          <>
            <MenuButton className='border-light data-[open]:bg-themed-prev dark:data-[open]:bg-darked bg-blurred data-[open]:!border-strong relative z-100 rounded-full p-16 transition-colors duration-200 ease-out'>
              <DarkModeIcon name={isDark ? 'dark' : 'light'} />
            </MenuButton>
            <AnimatePresence>
              {open && (
                <MenuItems
                  static
                  as={motion.div}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  variants={motionVariants}
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
                        setDarkMode(value);
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
