import CloseButton from '@/components/ui/CloseButton';
import CustomMarkdown from '@/components/ui/CustomMarkdown';
import { PageBlocksTextContent, PostBlocksTextContent } from '@/tina/types';
import { getRandomBetween, mediaLinksURLPrefix } from '@/utils/core';
import ease from '@/utils/eases';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';

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

export default function TextContent(props: PageBlocksTextContent | PostBlocksTextContent) {
  const [currentMedia, setCurrentMedia] = useState<{ id: string; caption: string } | null>(null);
  const textContainer = useRef<HTMLDivElement | null>(null);
  const mediasContainer = useRef<HTMLDivElement | null>(null);

  const handleMediaClick = (e: MouseEvent) => {
    if (e.target instanceof HTMLAnchorElement) {
      const target = e.target as HTMLAnchorElement;
      const mediaURL = target.href.split(mediaLinksURLPrefix);
      if (mediaURL.length > 1) {
        requestAnimationFrame(() => {
          setCurrentMedia({ id: mediaURL[1], caption: target.innerText });
        });
        e.preventDefault();
      }
    }
  };

  const closeMedia = useCallback(() => {
    setCurrentMedia(null);
  }, []);

  const positionMedia = useCallback((mediaElement: HTMLElement) => {
    if (mediasContainer.current) {
      mediasContainer.current.style.left = `${
        (window.innerWidth - mediaElement.offsetWidth) * 0.5
      }px`;
      mediasContainer.current.style.top = `${
        (window.innerHeight - mediaElement.offsetHeight) * 0.5
      }px`;
    }
  }, []);

  const resizeMedia = useCallback(
    (mediaElement: HTMLElement) => {
      if (mediaElement) {
        const element = mediaElement.querySelector('[data-media-element="true"]') as HTMLElement;
        positionMedia(mediaElement);

        if (mediaElement.offsetHeight > window.innerHeight) {
          const height = element.offsetHeight - (mediaElement.offsetHeight - window.innerHeight);
          element.style.height = `${height}px`;
          element.style.width = 'auto';

          requestAnimationFrame(() => {
            positionMedia(mediaElement);
          });
        }
      }
    },
    [positionMedia],
  );

  const resizeCurrentMedia = useCallback(() => {
    if (currentMedia) {
      const currentMediaElelement = mediasContainer.current!.querySelector(
        `[data-media-id='${currentMedia.id}']`,
      ) as HTMLElement;

      resizeMedia(currentMediaElelement);

      if (currentMediaElelement) {
        const videoElement = currentMediaElelement.querySelector('video');

        if (videoElement && videoElement.getAttribute('data-loaded') !== 'true') {
          videoElement.classList.add('opacity-0');
          videoElement.addEventListener(
            'loadedmetadata',
            () => {
              videoElement.classList.remove('opacity-0');
              videoElement.setAttribute('data-loaded', 'true');
              if (currentMediaElelement) {
                resizeMedia(currentMediaElelement);
              }
            },
            { once: true },
          );
        }
      }
    }
  }, [currentMedia, resizeMedia]);

  useEffect(() => {
    const mediasContainerEl = mediasContainer.current;
    const textContainerEl = textContainer.current;

    if (mediasContainerEl && textContainerEl) {
      resizeCurrentMedia();
      textContainerEl.addEventListener('click', handleMediaClick);
      window.addEventListener('resize', resizeCurrentMedia);
    }

    return () => {
      if (mediasContainerEl && textContainerEl) {
        textContainerEl.removeEventListener('click', handleMediaClick);
        window.removeEventListener('resize', resizeCurrentMedia);
      }
    };
  }, [resizeCurrentMedia]);

  return (
    <section className='layout-grid'>
      <div className='text-container relative col-start-4 col-end-10'>
        {props.content && (
          <div ref={textContainer} data-tina-field={tinaField(props, 'content')}>
            <CustomMarkdown content={props.content} />
          </div>
        )}
        {props.mediaBlocks && (
          <div className='fixed z-70' ref={mediasContainer}>
            <AnimatePresence mode='wait' initial={false}>
              {props.mediaBlocks.map((mediaBlock, i) => {
                if (currentMedia && currentMedia.id === mediaBlock?.id) {
                  return (
                    <motion.figure
                      key={i}
                      className='bg-blurred relative rounded-cards border border-black/20 p-80'
                      initial='initial'
                      animate='animate'
                      exit='exit'
                      data-media-id={mediaBlock!.id}
                      variants={motionVariants}
                    >
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
                        <Image
                          src={mediaBlock.image!}
                          width={mediaBlock.imageWidth!}
                          height={mediaBlock.imageHeight!}
                          className='overflow-hidden rounded-cards border border-black/20'
                          alt='media'
                          data-media-element='true'
                        />
                      )}
                      <figcaption className='absolute left-0 right-0 top-28 mx-auto text-center text-base font-bold'>
                        {currentMedia.caption}
                      </figcaption>
                      <CloseButton onClick={closeMedia} className={'absolute right-20 top-20'} />
                    </motion.figure>
                  );
                }
              })}
            </AnimatePresence>
          </div>
        )}
        {props.mediaBlocks && (
          <section className='admin-only mt-64'>
            <h1>Médias</h1>
            <ul>
              {props.mediaBlocks.map((mediaBlock, i) => (
                <li key={`mediablock-${i}`} className='mt-20 border-t border-black pt-20'>
                  <div data-tina-field={tinaField(mediaBlock!, 'id')}>{mediaBlock!.id}</div>
                  {mediaBlock?.videoURL && (
                    <video controls>
                      <source src={mediaBlock.videoURL} type='video/mp4' />
                    </video>
                  )}
                  {mediaBlock?.image && <img src={mediaBlock.image!} alt='media' />}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      {currentMedia && (
        <div className='fixed left-0 top-0 z-60 h-screen w-screen' onClick={closeMedia}></div>
      )}
    </section>
  );
}
