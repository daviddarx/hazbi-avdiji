import Footer from '@/components/layout/Footer';
import { uiStateType } from '@/store/ui-slice';
import { FooteNavigationResult } from '@/types';
import { delayBeforeScrollRestoration } from '@/utils/core';
import { reducedMotion } from '@/utils/core';
import eases from '@/utils/eases';
import { motion } from 'framer-motion';
import React, { ReactNode, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

const motionVariants = {
  initial: (animated: boolean) => {
    if (animated) {
      return { opacity: 0, y: 30 };
    } else {
      return { opacity: 1 };
    }
  },
  animate: (animated: boolean) => {
    if (animated) {
      return {
        opacity: 1,
        y: 0,
        transition: {
          delay:
            delayBeforeScrollRestoration / 1000 +
            0.05 /* aditional delay to avoid visual glitch when pages have big differences in their height  */,
          duration: 0.25,
          ease: eases.outQuart,
        },
      };
    } else {
      return {
        opacity: 1,
        transition: {
          duration: 0,
        },
      };
    }
  },
  exit: (animated: boolean) => {
    if (animated) {
      return {
        opacity: 0,
        y: 0,
        transition: {
          duration: 0.15,
          ease: eases.linear,
        },
      };
    } else {
      return {
        opacity: 1,
        transition: {
          duration: 0,
        },
      };
    }
  },
};

export default function PageWrapper({
  footerNavigationProps,
  children,
}: {
  footerNavigationProps: FooteNavigationResult;
  children: ReactNode;
}) {
  const scrollToTopOnPageChange = useSelector(
    (state: uiStateType) => state.ui.scrollToTopOnPageChange,
  );

  const [animated, setAnimated] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      /**
       * Only provide page transition when the scroll to top
       * on page change wasn't disabled by a PageLink and when
       * user doesn't prefer reduced motion. Make test on mount
       * with delay to avoid SSR hydration error.
       */
      setAnimated(scrollToTopOnPageChange && !reducedMotion());
    }, 10);
  });

  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={motionVariants}
      custom={animated}
      className='h-full'
    >
      <div className='flex h-full flex-col'>
        <div className='page-content'>{children}</div>
        <Footer {...footerNavigationProps} />
      </div>
    </motion.div>
  );
}
