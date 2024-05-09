import CloseButton from '@/components/ui/CloseButton';
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
  const [currentMediaType, setCurrentMediaType] = useState<'image' | 'video' | null>(null);
  const textContainer = useRef<HTMLDivElement | null>(null);
  const mediasContainer = useRef<HTMLDivElement | null>(null);
  const closeOverlay = useRef<HTMLDivElement | null>(null);
  const closeButton = useRef<HTMLDivElement | null>(null);
  const closeButtonLabel = useRef<HTMLSpanElement | null>(null);
  const closeButtonLabelSecurityPadding = 40;
  const closeButtonCurrentPosition = useRef({ x: 0, y: 0 });
  const closeButtonTargetPosition = useRef({ x: 0, y: 0 });
  const closeButtonRAF = useRef(0);
  const closeButtonPositionEase = 0.15;
  const [closeButtonLabelText, setCloseButtonLabelText] = useState('');

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

        setCurrentMediaType(videoElement ? 'video' : 'image');
      }
    }
  }, [currentMedia, resizeMedia]);

  useEffect(() => {
    setCloseButtonLabelText(currentMediaType === 'image' ? "Fermer l'image" : 'Fermer la vidéo');
  }, [currentMediaType]);

  const handleCloseMouseMove = useCallback((e: MouseEvent) => {
    closeButtonTargetPosition.current = { x: e.clientX, y: e.clientY };

    const screenCenterX = window.innerWidth * 0.5;

    let closeButtonLabelLeftPositioned: boolean;

    if (e.clientX > screenCenterX) {
      closeButtonLabelLeftPositioned = true;

      if (
        e.clientX <
        window.innerWidth -
          (closeButtonLabel.current!.scrollWidth + closeButtonLabelSecurityPadding)
      ) {
        closeButtonLabelLeftPositioned = false;
      }
    } else {
      closeButtonLabelLeftPositioned = false;

      if (e.clientX > closeButtonLabel.current!.scrollWidth + closeButtonLabelSecurityPadding) {
        closeButtonLabelLeftPositioned = true;
      }
    }

    if (closeButtonLabelLeftPositioned) {
      closeButtonLabel.current?.style.setProperty('--tw-translate-x', 'calc(-100% - 24px)');
    } else {
      closeButtonLabel.current?.style.setProperty('--tw-translate-x', '24px');
    }
  }, []);

  const positionCloseButton = useCallback(() => {
    const posX =
      closeButtonCurrentPosition.current.x +
      (closeButtonTargetPosition.current.x - closeButtonCurrentPosition.current.x) *
        closeButtonPositionEase;
    const posY =
      closeButtonCurrentPosition.current.y +
      (closeButtonTargetPosition.current.y - closeButtonCurrentPosition.current.y) *
        closeButtonPositionEase;

    if (closeButton.current) {
      closeButton.current.style.setProperty('--tw-translate-x', `${posX}px`);
      closeButton.current.style.setProperty('--tw-translate-y', `${posY}px`);
    }

    closeButtonCurrentPosition.current = { x: posX, y: posY };

    closeButtonRAF.current = window.requestAnimationFrame(positionCloseButton);
  }, []);

  const displayCloseButton = () => {
    if (closeButton.current) {
      closeButton.current.style.opacity = '1';
    }
  };

  const hideCloseButton = () => {
    if (closeButton.current) {
      closeButton.current.style.opacity = '0';
    }
  };

  useEffect(() => {
    const closeOverlayElement = closeOverlay.current;

    if (currentMedia && closeOverlayElement && matchMedia('(pointer:fine)').matches) {
      hideCloseButton();
      positionCloseButton();
      closeOverlayElement.addEventListener('mouseenter', displayCloseButton);
      closeOverlayElement.addEventListener('mouseleave', hideCloseButton);
      document.body.addEventListener('mousemove', handleCloseMouseMove);
    }

    return () => {
      if (closeOverlayElement && matchMedia('(pointer:fine)').matches) {
        window.cancelAnimationFrame(closeButtonRAF.current);
        closeOverlayElement.removeEventListener('mouseenter', displayCloseButton);
        closeOverlayElement.removeEventListener('mouseleave', hideCloseButton);
        document.body.removeEventListener('mousemove', handleCloseMouseMove);
      }
    };
  }, [currentMedia, handleCloseMouseMove, positionCloseButton]);

  useEffect(() => {
    const mediasContainerElement = mediasContainer.current;
    const textContainerElement = textContainer.current;

    if (mediasContainerElement && textContainerElement) {
      resizeCurrentMedia();
      textContainerElement.addEventListener('click', handleMediaClick);
      window.addEventListener('resize', resizeCurrentMedia);
    }

    const screenCenter = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };

    closeButtonCurrentPosition.current = screenCenter;
    closeButtonTargetPosition.current = screenCenter;

    return () => {
      if (mediasContainerElement && textContainerElement) {
        textContainerElement.removeEventListener('click', handleMediaClick);
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
                      className='bg-blurred border-semi-transparent relative rounded-cards p-80'
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
                          className='border-semi-transparent overflow-hidden rounded-cards'
                          alt='media'
                          data-media-element='true'
                        />
                      )}
                      <figcaption className='absolute left-0 right-0 top-28 mx-auto text-center text-base font-bold'>
                        {currentMedia.caption}
                      </figcaption>
                      <CloseButton
                        label={closeButtonLabelText}
                        onClick={closeMedia}
                        className='absolute right-20 top-20 hasmouse:hidden'
                      />
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
                  {/**
                   * Use <img> instead of <Image> to preload the pictures on page load,
                   * as it isn't possible de place the <Image> direclty in the media-links
                   * of CustomMarkDown, as it is rendered on the server and can't access
                   * this part.
                   **/}
                  {mediaBlock?.image && <img src={mediaBlock.image!} alt='media' />}
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
      <div
        className={classNames(
          'pointer-events-none fixed left-0 top-0 z-60 h-screen w-screen cursor-none opacity-0 transition-opacity duration-300',
          {
            'pointer-events-auto opacity-100': currentMedia,
          },
        )}
        ref={closeOverlay}
        onClick={closeMedia}
      >
        <div
          className='absolute left-0 top-0 transform-gpu transition-opacity duration-200'
          ref={closeButton}
        >
          <div className='relative'>
            <CloseButton
              label={closeButtonLabelText}
              onClick={closeMedia}
              className='bg-blurred pointer-events-none absolute z-20 -translate-x-1/2 -translate-y-1/2'
            />
            <span
              className='bg-blurred border-semi-transparent absolute z-10 inline-block -translate-y-1/2 transform-gpu whitespace-nowrap rounded-full px-[1em] py-[0.35em] text-base font-bold transition-transform duration-500 ease-in-out-quart'
              ref={closeButtonLabel}
              aria-hidden='true'
            >
              {closeButtonLabelText}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
