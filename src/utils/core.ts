import ease from './eases';
import { detect } from 'detect-browser';

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('de-CH', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
}

export const POSTS_CATEGORY_SEARCH_PARAMS = 'categorie';
export const POSTS_LIST_VIEW_SEARCH_PARAMS = 'liste';
export const POSTS_LIST_VIEW_SEARCH_PARAMS_VALUE = '1';
export const POSTS_CATEGORY_ALL_VALUE = 'tout';

export function getSystem() {
  const detected = detect();

  if (detected && detected.os && detected.name) {
    let os = detected.os.replace(/\s+/g, '') as string;
    let browser = detected.name.replace(/\s+/g, '') as string;

    if (detected.os.indexOf('Windows') > -1) {
      os = 'windows';
    } else if (detected.os.indexOf('Mac') > -1) {
      os = 'mac';
    } else if (detected.os.indexOf('iOS') > -1) {
      os = 'ios';
    } else if (detected.os.indexOf('Android') > -1) {
      os = 'android';
    }

    const ios = /iP(ad|od|hone)/i.test(window.navigator.userAgent);
    const safari = !!navigator.userAgent.match(/Version\/[\d\.]+.*Safari/);

    if (ios && safari) {
      browser = 'safari';
    }

    return {
      os: os,
      browser: browser,
    };
  } else {
    return {
      os: 'not-detected',
      browser: 'not-detected',
    };
  }
}

export const delayBeforeScrollRestoration = 50;

export const themeColors = [
  '#E8FFB7', // green
  '#CFFFFC', // blue
  '#F5F1FF', // violet
  '#FFE5ED', // red
  '#FFEECE', // orange
  '#FFFCB7', // yellow
];

export type Timeout = ReturnType<typeof setTimeout>;

export const mediaLinksURLPrefix = '#media-';

export function getRandomBetween(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export const getMenuMotionVariants = (screenW: number) => {
  if (screenW < 1024) {
    return {
      initial: { x: '100%' },
      animate: {
        x: 0,
        transition: {
          duration: 0.35,
          ease: ease.outQuart,
        },
      },
      exit: {
        x: '100%',
        transition: {
          duration: 0.25,
          ease: ease.outQuart,
        },
      },
    };
  } else {
    return {
      initial: { opacity: 0, scale: 0.95, y: 30 },
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
  }
};
