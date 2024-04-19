import { themeColors } from './src/utils/core';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      black: '#3917A1',
      white: '#ffffff',
      theme: 'var(--color-theme)',
      'theme-prev': 'var(--color-theme-prev)',
      'theme-next': 'var(--color-theme-next)',
      ...themeColors,
    },
    fontSize: {
      xs: ['0.75rem', '1.5'], // 12px
      sm: ['0.875rem', '1.5'], // 14px
      base: ['1rem', '1.5'], // 16px
      lg: ['1.125rem', '1.5'], // 18px
      xl: ['1.25rem', '1.5'], // 20px
      '2xl': ['1.5rem', '1.5'], // 24px
      '3xl': ['1.75rem', '1.5'], // 28px
      '4xl': ['2rem', '1.5'], // 32px
      '5xl': ['2.5rem', '1.5'], // 40px
      '6xl': ['3rem', '1.5'], // 48px
      '7xl': ['3.5rem', '1.5'], // 56px
      '8xl': ['4.5rem', '1.5'], // 72px
      '9xl': ['6rem', '1.5'], // 96px
    },
    lineHeight: {
      normal: '1.65',
      tight: '1.4',
      title: '1.15',
      none: '1',
    },
    spacing: {
      0: '0', // 0
      1: '1px', // 1px
      2: '0.125rem', // 2px
      3: '0.1875rem', // 3px
      4: '0.25rem', // 4px
      6: '0.3125rem', // 6px
      8: '0.5rem', // 8px
      10: '0.625rem', // 10px
      12: '0.75rem', // 12px
      14: '0.875rem', // 14px
      16: '1rem', // 16px
      18: '1.125rem', // 18px
      20: '1.25rem', // 20px
      24: '1.5rem', // 24px
      28: '1.75rem', // 28px
      32: '2rem', // 32px
      40: '2.5rem', // 40px
      48: '3rem', // 48px
      56: '3.5rem', // 56px
      64: '4rem', // 64px
      72: '4.5rem', // 72px
      80: '5rem', // 80px
      96: '6rem', // 96px
      120: '7.5rem', // 120px
      'spacer-8': 'var(--spacer-8)',
      'spacer-12': 'var(--spacer-12)',
      'spacer-16': 'var(--spacer-16)',
      'spacer-20': 'var(--spacer-20)',
      'spacer-24': 'var(--spacer-24)',
      'spacer-32': 'var(--spacer-32)',
      'spacer-40': 'var(--spacer-40)',
      'spacer-48': 'var(--spacer-48)',
      'spacer-56': 'var(--spacer-56)',
      'spacer-64': 'var(--spacer-64)',
      'spacer-80': 'var(--spacer-80)',
      'spacer-96': 'var(--spacer-96)',
      'spacer-120': 'var(--spacer-120)',
      gutter: 'var(--gutter)',
      'gutter-1/2': 'calc(var(--gutter)*0.5)',
    },
    boxShadow: {
      base: '0 0 5px 0px black',
    },
    extend: {
      transitionTimingFunction: {
        'in-quad': 'cubic-bezier(0.55, 0.085, 0.68, 0.53)',
        'in-cubic': 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
        'in-quart': 'cubic-bezier(0.895, 0.03, 0.685, 0.22)',
        'in-quint': 'cubic-bezier(0.755, 0.05, 0.855, 0.06)',
        'in-sine': 'cubic-bezier(0.47, 0.0, 0.745, 0.715)',
        'in-expo': 'cubic-bezier(0.95, 0.05, 0.795, 0.035)',
        'in-circ': 'cubic-bezier(0.6, 0.04, 0.98, 0.335)',
        'in-back': 'cubic-bezier(0.6, -0.28, 0.735, 0.045)',

        'out-quad': 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
        'out-cubic': 'cubic-bezier(0.215, 0.61, 0.355, 1.0)',
        'out-quart': 'cubic-bezier(0.165, 0.84, 0.44, 1.0)',
        'out-quint': 'cubic-bezier(0.23, 1.0, 0.32, 1.0)',
        'out-sine': 'cubic-bezier(0.39, 0.575, 0.565, 1.0)',
        'out-expo': 'cubic-bezier(0.19, 1.0, 0.22, 1.0)',
        'out-circ': 'cubic-bezier(0.075, 0.82, 0.165, 1.0)',
        'out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',

        'in-out-quad': 'cubic-bezier(0.455, 0.03, 0.515, 0.955)',
        'in-out-cubic': 'cubic-bezier(0.645, 0.045, 0.355, 1.0)',
        'in-out-quart': 'cubic-bezier(0.77, 0.0, 0.175, 1.0)',
        'in-out-quint': 'cubic-bezier(0.86, 0.0, 0.07, 1.0)',
        'in-out-sine': 'cubic-bezier(0.445, 0.05, 0.55, 0.95)',
        'in-out-expo': 'cubic-bezier(1.0, 0.0, 0.0, 1.0)',
        'in-out-circ': 'cubic-bezier(0.785, 0.135, 0.15, 0.86)',
        'in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
      },
    },
  },
  plugins: [],
};
export default config;
