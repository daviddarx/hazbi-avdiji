import Footer from '@/components/layout/Footer';
import { uiStateType } from '@/store/ui-slice';
import { delayBeforeScrollRestoration } from '@/utils/core';
import eases from '@/utils/eases';
import { motion } from 'framer-motion';
import React, { ReactNode } from 'react';
import { useSelector } from 'react-redux';

/**
 * Only provide page transition when the scroll
 * to top on page change wasn't disabled by a PageLink
 */
const motionVariants = {
  initial: (scrollToTopOnPageChange: boolean) => {
    if (scrollToTopOnPageChange) {
      return { opacity: 0, y: 50 };
    } else {
      return { opacity: 1 };
    }
  },
  animate: (scrollToTopOnPageChange: boolean) => {
    if (scrollToTopOnPageChange) {
      return {
        opacity: 1,
        y: 0,
        transition: {
          delay:
            delayBeforeScrollRestoration / 1000 +
            0.05 /* aditional delay to avoid visual glitch when pages have big differences in their height  */,
          duration: 0.5,
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
  exit: (scrollToTopOnPageChange: boolean) => {
    if (scrollToTopOnPageChange) {
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

export default function PageWrapper({ children }: { children: ReactNode }) {
  const scrollToTopOnPageChange = useSelector(
    (state: uiStateType) => state.ui.scrollToTopOnPageChange,
  );

  return (
    <motion.div
      initial='initial'
      animate='animate'
      exit='exit'
      variants={motionVariants}
      custom={scrollToTopOnPageChange}
    >
      {children}
      <Footer />
    </motion.div>
  );
}
