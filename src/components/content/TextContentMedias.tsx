import TextContentMedia, { type MediaType } from '@/components/content/TextContentMedia';
import CloseButton from '@/components/ui/CloseButton';
import type {
  Maybe,
  PageBlocksTextContentMediaBlocks,
  PostBlocksTextContentMediaBlocks,
} from '@/tina/types';
import classNames from 'classnames';
import { AnimatePresence } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export type CurrentMediaType = { id: string; caption: string } | null;

export default function TextContentMedias({
  mediaBlocks,
  currentMedia,
  onClose,
}: {
  mediaBlocks:
    | Maybe<PageBlocksTextContentMediaBlocks>[]
    | Maybe<PostBlocksTextContentMediaBlocks>[];
  currentMedia: CurrentMediaType;
  onClose: () => void;
}) {
  const [currentMediaType, setCurrentMediaType] = useState<MediaType>(null);
  const closeOverlay = useRef<HTMLDivElement | null>(null);
  const closeButton = useRef<HTMLDivElement | null>(null);
  const closeButtonLabel = useRef<HTMLSpanElement | null>(null);
  const closeButtonLabelSecurityPadding = 40;
  const closeButtonCurrentPosition = useRef({ x: 0, y: 0 });
  const closeButtonTargetPosition = useRef({ x: 0, y: 0 });
  const closeButtonRAF = useRef(0);
  const closeButtonPositionEase = 0.15;
  const [closeButtonLabelText, setCloseButtonLabelText] = useState('');

  const closeMedia = useCallback(() => {
    hideCloseButton();
    onClose();
  }, [onClose]);

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

  const centerCloseButton = useCallback(() => {
    const screenCenter = { x: window.innerWidth * 0.5, y: window.innerHeight * 0.5 };

    closeButtonCurrentPosition.current = screenCenter;
    closeButtonTargetPosition.current = screenCenter;
  }, []);

  useEffect(() => {
    const closeOverlayElement = closeOverlay.current;

    if (currentMedia && closeOverlayElement && matchMedia('(pointer:fine)').matches) {
      hideCloseButton();
      positionCloseButton();
      closeOverlayElement.addEventListener('mousemove', displayCloseButton);
      closeOverlayElement.addEventListener('mouseleave', hideCloseButton);
      document.body.addEventListener('mousemove', handleCloseMouseMove);
    }

    return () => {
      if (closeOverlayElement && matchMedia('(pointer:fine)').matches) {
        window.cancelAnimationFrame(closeButtonRAF.current);
        closeOverlayElement.removeEventListener('mousemove', displayCloseButton);
        closeOverlayElement.removeEventListener('mouseleave', hideCloseButton);
        document.body.removeEventListener('mousemove', handleCloseMouseMove);
      }
    };
  }, [currentMedia, handleCloseMouseMove, positionCloseButton]);

  useEffect(() => {
    hideCloseButton();
    centerCloseButton();
  }, [centerCloseButton]);

  useEffect(() => {
    centerCloseButton();
  }, [currentMedia, centerCloseButton]);

  return (
    <React.Fragment>
      <AnimatePresence mode='wait' initial={false}>
        {mediaBlocks.map((mediaBlock, i) => {
          if (currentMedia && currentMedia.id === mediaBlock?.id) {
            return (
              <TextContentMedia
                mediaBlock={mediaBlock}
                key={i.toString()}
                caption={currentMedia.caption}
                closeButtonLabelText={closeButtonLabelText}
                onClose={closeMedia}
                onMount={(type: MediaType) => {
                  setCurrentMediaType(type);
                }}
              />
            );
          }
        })}
      </AnimatePresence>
      <div
        className={classNames(
          'pointer-events-none fixed left-0 top-0 z-50 h-screen w-screen cursor-none opacity-0 transition-opacity duration-300',
          {
            'pointer-events-auto opacity-100': currentMedia,
          },
        )}
        ref={closeOverlay}
        onClick={closeMedia}
      ></div>
      <div
        className='pointer-events-none fixed left-0 top-0 z-70 transform-gpu transition-opacity duration-200'
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
    </React.Fragment>
  );
}
