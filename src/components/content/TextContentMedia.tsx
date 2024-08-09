import CloseButton from '@/components/ui/CloseButton';
import LoadedImage from '@/components/ui/LoadedImage';
import type {
  PageBlocksTextContentMediaBlocks,
  PostBlocksTextContentMediaBlocks,
} from '@/tina/types';
import { getRandomBetween } from '@/utils/core';
import { reducedMotion } from '@/utils/core';
import ease from '@/utils/eases';
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

  const positionMedia = useCallback(() => {
    if (mediaContainer.current) {
      mediaContainer.current.style.left = `${
        (window.innerWidth - mediaContainer.current.offsetWidth) * 0.5
      }px`;
      mediaContainer.current.style.top = `${
        (window.innerHeight - mediaContainer.current.offsetHeight) * 0.5
      }px`;
    }
  }, []);

  const handleResize = useCallback(() => {
    if (mediaContainer.current) {
      const element = mediaContainer.current.querySelector(
        '[data-media-element="true"]',
      ) as HTMLElement;

      positionMedia();

      let naturalWidth = 0;

      if (element instanceof HTMLImageElement) {
        naturalWidth = element.naturalWidth * window.devicePixelRatio;
      }

      if (element instanceof HTMLVideoElement) {
        naturalWidth = element.videoWidth * window.devicePixelRatio;
      }

      if (naturalWidth) {
        mediaContainer.current.style.width = 'auto';
        element.style.width = `${naturalWidth}px`;
        element.style.height = 'auto';

        if (mediaContainer.current.offsetWidth > window.innerWidth) {
          mediaContainer.current.style.width = window.innerWidth + 'px';
          element.style.width = '100%';
          element.style.height = 'auto';
        }

        if (mediaContainer.current.offsetHeight > window.innerHeight) {
          const height =
            element.offsetHeight - (mediaContainer.current.offsetHeight - window.innerHeight);
          mediaContainer.current.style.width = 'auto';
          element.style.height = `${height}px`;
          element.style.width = 'auto';
        }

        positionMedia();
      }
    }
  }, [positionMedia]);

  const onLoadComplete = useCallback(
    (e: Event) => {
      const element = e.target as HTMLElement;
      if (element) {
        element.removeEventListener('load', onLoadComplete);
        element.removeEventListener('loadedmetadata', onLoadComplete);
        element.setAttribute('data-loaded', 'true');
        handleResize();
      }
    },
    [handleResize],
  );

  const handleLoading = useCallback(() => {
    if (mediaContainer.current) {
      const element = mediaContainer.current.querySelector(
        '[data-media-element="true"]',
      ) as HTMLElement;
      if (element.getAttribute('data-loaded') !== 'true') {
        element.addEventListener('load', onLoadComplete);
        element.addEventListener('loadedmetadata', onLoadComplete);
      }
    }
  }, [onLoadComplete]);

  useEffect(() => {
    mediaVideo.current = mediaContainer.current?.querySelector('video');
    onMount(mediaVideo.current ? 'video' : 'image');

    requestAnimationFrame(handleResize);
    requestAnimationFrame(handleLoading);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, handleLoading, onMount]);

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
              className='max-w-none'
            />
          </span>
        )}
        <figcaption className='absolute left-0 right-0 top-0 flex h-80 items-center pl-gutter pr-80 text-base font-bold lg:justify-center lg:px-80'>
          {mediaBlock.title || caption}
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
