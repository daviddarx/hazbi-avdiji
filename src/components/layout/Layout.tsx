import ColoredBackground from '@/components/layout/ColoredBackground';
import DarkModeSwitcher from '@/components/layout/DarkModeSwitcher';
import MobileNavigation from '@/components/layout/MobileNavigation';
import Navigation from '@/components/layout/Navigation';
import { uiActions } from '@/store';
import { uiStateType } from '@/store/ui-slice';
import { NavigationResult } from '@/types';
import { delayBeforeScrollRestoration } from '@/utils/core';
import classNames from 'classnames';
import { AnimatePresence } from 'framer-motion';
import { Manrope } from 'next/font/google';
import localFont from 'next/font/local';
import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const fontText = Manrope({
  weight: ['500', '700'],
  subsets: ['latin'],
  variable: '--font-text',
});
const fontTitle = localFont({
  src: './../../fonts/Larken-Bold.ttf',
  variable: '--font-title',
});

export default function Layout({
  navigationProps,
  children,
}: {
  navigationProps: NavigationResult;
  children: React.ReactNode;
}) {
  const router = useRouter();
  const dispatch = useDispatch();
  const lastScrollPosition = useRef<number[]>([]);
  const [scrollPosition, setScrollPosition] = useState(0);

  const scrollToTopOnPageChange = useSelector(
    (state: uiStateType) => state.ui.scrollToTopOnPageChange,
  );

  useEffect(() => {
    const handleBeforeHistoryChange = () => {
      /**
       * Save the scroll position on page leave, to restore
       * it on back/popstate navigation. Use an array instead
       * of useState to have directly the value updated, everywhere.
       */
      lastScrollPosition.current[0] = window.scrollY;
    };

    const handlePopState = () => {
      /**
       * On back/popstate navigation, override the scroll
       * restoration position to the previously saved position.
       */
      setScrollPosition(lastScrollPosition.current[0]);
    };

    router.events.on('beforeHistoryChange', handleBeforeHistoryChange);
    router.beforePopState((state) => {
      /**
       * Deactive Next's scroll restoration on back/popstate navigation.
       */
      state.options.scroll = false;
      return true;
    });
    window.addEventListener('popstate', handlePopState);
    /**
     * Deactivate completely the scroll restoration
     * of the browser, necessary for custom scroll
     * restoration on back/popstate navigation.
     */
    window.history.scrollRestoration = 'manual';

    return () => {
      router.events.off('beforeHistoryChange', handleBeforeHistoryChange);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [router, router.events]);

  const handleExitComplete = () => {
    /**
     * If an PageLink disabled the scroll to top on page change,
     * just enable it again for the next page change, with a small
     * delay to wait for the motionVariants to be accordingly updated
     * in PageWrapper.
     */
    if (scrollToTopOnPageChange === false) {
      setTimeout(() => {
        dispatch(uiActions.setScrollToTopOnPageChange(true));
      }, 50);
    } else {
      /**
       * Add a delay for the scroll restoration to be sure that the
       * the page height is updated across all browsers, after
       * the animation-out of the page. Necessary for the scroll
       * restoration on back/popstate navigation.
       */
      setTimeout(() => {
        window.scrollTo(0, scrollPosition);
        setScrollPosition(0);
      }, delayBeforeScrollRestoration);
    }
  };

  return (
    <div
      className={classNames('h-full', fontText.className, fontText.variable, fontTitle.variable)}
    >
      <div className='fixed right-gutter top-gutter z-60 flex gap-12 lg:absolute'>
        <DarkModeSwitcher />
        {navigationProps && <MobileNavigation {...navigationProps} />}
      </div>

      {navigationProps && <Navigation {...navigationProps} />}
      <main className='h-full'>
        <AnimatePresence mode='wait' initial={false} onExitComplete={handleExitComplete}>
          {children}
        </AnimatePresence>
      </main>
      <ColoredBackground />
    </div>
  );
}
