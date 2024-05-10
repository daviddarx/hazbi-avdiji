import CloseButton from '@/components/ui/CloseButton';
import LoadedImage from '@/components/ui/LoadedImage';
import type {
  PageBlocksTextContentMediaBlocks,
  PostBlocksTextContentMediaBlocks,
} from '@/tina/types';
import { getRandomBetween } from '@/utils/core';
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

export type TextContentMediaType = 'image' | 'video' | null;

export default function TextContentMedia({
  mediaBlock,
  key,
  caption,
  closeButtonLabelText,
  onClick,
  onMount,
}: {
  mediaBlock: PageBlocksTextContentMediaBlocks | PostBlocksTextContentMediaBlocks;
  key: string;
  caption: string;
  closeButtonLabelText: string;
  onClick: () => void;
  onMount: (type: TextContentMediaType) => void;
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

  const resizeMedia = useCallback(() => {
    if (mediaContainer.current) {
      const element = mediaContainer.current.querySelector(
        '[data-media-element="true"]',
      ) as HTMLElement;
      positionMedia();

      if (mediaContainer.current.offsetHeight > window.innerHeight) {
        const height =
          element.offsetHeight - (mediaContainer.current.offsetHeight - window.innerHeight);
        element.style.height = `${height}px`;
        element.style.width = 'auto';

        requestAnimationFrame(() => {
          positionMedia();
        });
      }
    }
  }, [positionMedia]);

  const handleResize = useCallback(() => {
    resizeMedia();

    if (mediaVideo.current && mediaVideo.current.getAttribute('data-loaded') !== 'true') {
      mediaVideo.current.classList.add('opacity-0');
      mediaVideo.current.addEventListener(
        'loadedmetadata',
        () => {
          mediaVideo.current?.classList.remove('opacity-0');
          mediaVideo.current?.setAttribute('data-loaded', 'true');
          resizeMedia();
        },
        { once: true },
      );
    }
  }, [resizeMedia]);

  useEffect(() => {
    mediaVideo.current = mediaContainer.current?.querySelector('video');
    onMount(mediaVideo.current ? 'video' : 'image');

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize, onMount]);

  return (
    <motion.div
      key={key}
      className='bg-blurred border-semi-transparent fixed z-70 rounded-cards p-80'
      initial='initial'
      animate='animate'
      exit='exit'
      data-media-id={mediaBlock!.id}
      variants={motionVariants}
      ref={mediaContainer}
    >
      <figure>
        {mediaBlock?.videoURL && (
          <video
            controls
            autoPlay={true}
            loop={true}
            data-media-element='true'
            className='overflow-hidden rounded-cards'
          >
            <source src={mediaBlock.videoURL} type='video/mp4' />
          </video>
        )}
        {mediaBlock?.image && (
          <span className='border-semi-transparent block overflow-hidden rounded-cards'>
            <LoadedImage
              src={mediaBlock.image!}
              width={mediaBlock.imageWidth!}
              height={mediaBlock.imageHeight!}
              alt='media'
              data-media-element='true'
            />
          </span>
        )}
        <figcaption className='absolute left-0 right-0 top-28 mx-auto text-center text-base font-bold'>
          {caption}
        </figcaption>
        <CloseButton
          label={closeButtonLabelText}
          onClick={onClick}
          className='absolute right-20 top-20 hasmouse:hidden'
        />
      </figure>
    </motion.div>
  );
}
