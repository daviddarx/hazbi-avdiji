import classNames from 'classnames';
import { useEffect, useState } from 'react';

type darkModes = 'light' | 'dark' | 'auto';

export default function DarkModeSwitcher({ className }: { className?: string }) {
  const [darkMode, setDarkMode] = useState<darkModes>();

  const applyDarkMode = () => {
    document.documentElement.classList.add('dark');
  };

  const removeDarkMode = () => {
    document.documentElement.classList.remove('dark');
  };

  useEffect(() => {
    if (!('theme' in localStorage)) {
      setDarkMode('auto');
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
    <div className={classNames('flex gap-12', className)}>
      <button
        onClick={() => {
          setDarkMode('light');
        }}
        className={darkMode === 'light' ? 'underline' : ''}
      >
        Light
      </button>
      <button
        onClick={() => {
          setDarkMode('dark');
        }}
        className={darkMode === 'dark' ? 'underline' : ''}
      >
        Dark
      </button>
      <button
        onClick={() => {
          setDarkMode('auto');
        }}
        className={darkMode === 'auto' ? 'underline' : ''}
      >
        Auto
      </button>
    </div>
  );
}
