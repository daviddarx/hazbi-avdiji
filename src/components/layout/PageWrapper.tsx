import Footer from '@/components/layout/Footer';
import { uiStateType } from '@/store/ui-slice';
import { FooteNavigationResult } from '@/types';
import { delayBeforeScrollRestoration } from '@/utils/core';
import { reducedMotion } from '@/utils/core';
import eases from '@/utils/eases';
import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';

const motionVariants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      delay:
        delayBeforeScrollRestoration / 1000 +
        0.05 /* aditional delay to avoid visual glitch when pages have big differences in their height  */,
      duration: 0.25,
      ease: eases.outQuart,
    },
  },
  exit: {
    opacity: 0,
    y: 0,
    transition: {
      duration: 0.15,
      ease: eases.linear,
    },
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

  /**
   * Only provide page transition when the scroll to top
   * on page change wasn't disabled by a PageLink and when
   * user doesn't prefer reduced motion.
   */
  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={
        typeof window === 'undefined' || !reducedMotion()
          ? scrollToTopOnPageChange
            ? motionVariants
            : undefined
          : undefined
      }
      className='h-full'
    >
      <div className='flex h-full flex-col'>
        <div className='page-content'>{children}</div>
        <Footer {...footerNavigationProps} />
      </div>
    </motion.div>
  );
}
