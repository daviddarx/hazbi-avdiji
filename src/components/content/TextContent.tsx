import TextContentMedia, { type TextContentMediaType } from '@/components/content/TextContentMedia';
import CloseButton from '@/components/ui/CloseButton';
import CustomMarkdown from '@/components/ui/CustomMarkdown';
import LoadedImage from '@/components/ui/LoadedImage';
import { PageBlocksTextContent, PostBlocksTextContent } from '@/tina/types';
import { mediaLinksURLPrefix } from '@/utils/core';
import classNames from 'classnames';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useEffect, useRef, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';

export default function TextContent(props: PageBlocksTextContent | PostBlocksTextContent) {
  const [currentMedia, setCurrentMedia] = useState<{ id: string; caption: string } | null>(null);
  const [currentMediaType, setCurrentMediaType] = useState<TextContentMediaType>(null);
  const textContainer = useRef<HTMLDivElement | null>(null);
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
    const textContainerElement = textContainer.current;

    if (textContainerElement) {
      textContainerElement.addEventListener('click', handleMediaClick);
    }

    const screenCenter = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };

    closeButtonCurrentPosition.current = screenCenter;
    closeButtonTargetPosition.current = screenCenter;

    return () => {
      if (textContainerElement) {
        textContainerElement.removeEventListener('click', handleMediaClick);
      }
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
          <AnimatePresence mode='wait' initial={false}>
            {props.mediaBlocks.map((mediaBlock, i) => {
              if (currentMedia && currentMedia.id === mediaBlock?.id) {
                return (
                  <TextContentMedia
                    mediaBlock={mediaBlock}
                    key={i.toString()}
                    caption={currentMedia.caption}
                    closeButtonLabelText={closeButtonLabelText}
                    onClick={closeMedia}
                    onMount={(type: TextContentMediaType) => {
                      setCurrentMediaType(type);
                    }}
                  />
                );
              }
            })}
          </AnimatePresence>
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
                    <LoadedImage
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
