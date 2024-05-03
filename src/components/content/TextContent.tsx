import CustomMarkdown from '@/components/ui/CustomMarkdown';
import { PageBlocksTextContent, PostBlocksTextContent } from '@/tina/types';
import { getRandomBetween, mediaLinksURLPrefix } from '@/utils/core';
import ease from '@/utils/eases';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';

const motionVariants = {
  initial: () => {
    return { opacity: 0, y: 200, rotate: getRandomBetween(-15, 15) };
  },
  animate: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: {
      duration: 0.35,
      ease: ease.outQuart,
    },
  },
  exit: {
    opacity: 0,
    y: 50,
    transition: {
      duration: 0.2,
      ease: ease.outQuart,
    },
  },
};

export default function TextContent(props: PageBlocksTextContent | PostBlocksTextContent) {
  const [currentMedia, setCurrentMedia] = useState<{ id: string; caption: string } | null>(null);
  const textContainer = useRef<HTMLDivElement | null>(null);

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

  const handleBodyClick = useCallback(
    (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.hasAttribute('data-media-video')) {
        closeMedia();
      }
    },
    [closeMedia],
  );

  useEffect(() => {
    if (currentMedia) {
      document.body.addEventListener('click', handleBodyClick);
    }

    return () => {
      if (currentMedia) {
        document.body.removeEventListener('click', handleBodyClick);
      }
    };
  }, [currentMedia, handleBodyClick]);

  useEffect(() => {
    const textContainerEl = textContainer.current;

    textContainerEl!.addEventListener('click', handleMediaClick);

    return () => {
      textContainerEl!.removeEventListener('click', handleMediaClick);
    };
  }, []);

  return (
    <section className='layout-grid'>
      <div className='text-container relative col-start-4 col-end-10'>
        {props.content && (
          <div ref={textContainer} data-tina-field={tinaField(props, 'content')}>
            <CustomMarkdown content={props.content} />
          </div>
        )}
        {props.mediaBlocks && (
          <div className='absolute left-0 top-0 z-70'>
            <AnimatePresence mode='wait' initial={false}>
              {props.mediaBlocks.map((mediaBlock, i) => {
                if (currentMedia && currentMedia.id === mediaBlock?.id) {
                  return (
                    <motion.figure
                      key={i}
                      className={classNames(
                        'relative -mx-40 rounded-cards border border-black bg-white',
                        'before:bg-theme-mix before:absolute before:-inset-80 before:-z-10 before:rounded-cards before:border before:border-black/20 before:backdrop-blur-md',
                      )}
                      initial='initial'
                      animate='animate'
                      exit='exit'
                      variants={motionVariants}
                    >
                      {mediaBlock?.videoURL && (
                        <video
                          controls
                          data-media-video='true'
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
                          className='overflow-hidden rounded-cards'
                          alt='media'
                        />
                      )}
                      <figcaption className='px-40 py-8 text-center text-base font-bold'>
                        {currentMedia.caption}
                      </figcaption>
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
                  {mediaBlock?.image && (
                    <Image
                      src={mediaBlock.image!}
                      width={mediaBlock.imageWidth!}
                      height={mediaBlock.imageHeight!}
                      alt='media'
                    />
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </section>
  );
}
