import CloseButton from '@/components/ui/CloseButton';
import LoadedImage from '@/components/ui/LoadedImage';
import type {
  PageBlocksTextContentMediaBlocks,
  PostBlocksTextContentMediaBlocks,
} from '@/tina/types';
import { getRandomBetween } from '@/utils/core';
import { reducedMotion } from '@/utils/core';
import { ease } from '@/utils/eases';
import { motion } from 'framer-motion';
import { useCallback, useEffect, useRef } from 'react';

const motionVariants = {
  initial: () => {
    return { opacity: 0, scale: 0.75, y: 50, rotate: getRandomBetween(-15, 15) };
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.35,
      ease: ease.outQuart,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: ease.outQuart,
    },
  },
};

export type MediaType = 'image' | 'video' | null;

export default function TextContentMedia({
  mediaBlock,
  caption,
  closeButtonLabelText,
  onClose,
  onMount,
}: {
  mediaBlock: PageBlocksTextContentMediaBlocks | PostBlocksTextContentMediaBlocks;
  caption: string;
  closeButtonLabelText: string;
  onClose: () => void;
  onMount: (type: MediaType) => void;
}) {
  const mediaContainer = useRef<HTMLDivElement | null>(null);
  const mediaVideo = useRef<HTMLVideoElement | null | undefined>(null);

  const handleResize = useCallback(() => {
    if (mediaContainer.current) {
      const element = mediaContainer.current.querySelector(
        '[data-media-element="true"]',
      ) as HTMLElement;

      const width = parseInt(element.getAttribute('data-media-width') || '');
      const height = parseInt(element.getAttribute('data-media-height') || '');
      const computedStyle = window.getComputedStyle(mediaContainer.current);

      element.style.width = `${width}px`;
      element.style.height = `${height}px`;

      let cappedWidth = width;
      let cappedHeight = height;

      const mediaContainerRatio =
        mediaContainer.current.offsetWidth / mediaContainer.current.offsetHeight;
      const screenRatio = window.innerWidth / window.innerHeight;

      if (
        mediaContainerRatio > screenRatio &&
        mediaContainer.current.offsetWidth > window.innerWidth
      ) {
        cappedWidth = window.innerWidth - 2 * parseInt(computedStyle.paddingLeft.split('px')[0]);
        cappedHeight = (cappedWidth * height) / width;
      }

      if (
        mediaContainerRatio < screenRatio &&
        mediaContainer.current.offsetHeight > window.innerHeight
      ) {
        cappedHeight = window.innerHeight - 2 * parseInt(computedStyle.paddingTop.split('px')[0]);
        cappedWidth = (cappedHeight * width) / height;
      }

      element.style.width = `${cappedWidth}px`;
      element.style.height = `${cappedHeight}px`;

      mediaContainer.current.style.left = `${
        (window.innerWidth - mediaContainer.current.offsetWidth) * 0.5
      }px`;
      mediaContainer.current.style.top = `${
        (window.innerHeight - mediaContainer.current.offsetHeight) * 0.5
      }px`;
    }
  }, []);

  useEffect(() => {
    mediaVideo.current = mediaContainer.current?.querySelector('video');
    onMount(mediaVideo.current ? 'video' : 'image');

    requestAnimationFrame(handleResize);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, onMount]);

  return (
    <motion.div
      className='bg-blurred border-light pointer-events-none fixed z-110 rounded-cards-extended border p-gutter py-80 lg:p-80'
      initial='initial'
      animate='animate'
      exit='exit'
      data-media-id={mediaBlock!.id}
      variants={typeof window === 'undefined' || !reducedMotion() ? motionVariants : undefined}
      ref={mediaContainer}
    >
      <figure>
        {mediaBlock?.videoURL && (
          <video
            controls
            autoPlay={true}
            loop={true}
            data-media-element='true'
            data-media-width={mediaBlock.imageWidth!}
            data-media-height={mediaBlock.imageHeight!}
            className='pointer-events-auto max-w-none overflow-hidden rounded-cards'
          >
            <source src={mediaBlock.videoURL} type='video/mp4' />
          </video>
        )}
        {mediaBlock?.image && (
          <span className='border-light block overflow-hidden rounded-cards border'>
            <LoadedImage
              src={mediaBlock.image!}
              width={mediaBlock.imageWidth!}
              height={mediaBlock.imageHeight!}
              alt='media'
              data-media-element='true'
              data-media-width={mediaBlock.imageWidth!}
              data-media-height={mediaBlock.imageHeight!}
              className='max-w-none'
            />
          </span>
        )}
        <figcaption className='absolute bottom-0 left-0 right-0 flex h-80 items-center px-gutter text-base font-bold lg:justify-center lg:px-80 hasmouse:bottom-auto hasmouse:top-0'>
          <span className='line-clamp-2 w-full text-center'>{mediaBlock.title || caption}</span>
        </figcaption>
        <CloseButton
          label={closeButtonLabelText}
          onClick={onClose}
          className='pointer-events-auto absolute right-20 top-20 hasmouse:hidden'
        />
      </figure>
    </motion.div>
  );
}
