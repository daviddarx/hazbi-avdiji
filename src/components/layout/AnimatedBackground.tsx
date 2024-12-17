import { reducedMotion } from '@/utils/core';
import classNames from 'classnames';
import { useRouter } from 'next/router';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createNoise2D } from 'simplex-noise';

const cardsArray = Array.from({ length: 8 });
const cardsScaleRange = 0.1;
const cardsRotationRange = 20;
const cardsRotationRangeIncrement = 0.25;
const cardsPositionRangeRatioToScreenW = 0.04;
const cardsPositionRangeIncrement = 0.25;
const cardsRadiusRange = 30;
const easingNormal = 0.015;
const easingMinimized = 0.005;
const mouseIdleTimeoutDuration = 5000;
const mouseIdleNoiseSpeed = 0.001;

export default function AnimatedBackground() {
  const router = useRouter();
  const container = useRef<HTMLDivElement | null>(null);
  const cards = useRef<HTMLDivElement[]>([]);
  const raf = useRef<number | null>(null);
  const [isAlternative, setIsAlternative] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [isMouseIdle, setIsMouseIdle] = useState(true);
  const mouseIdleTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mouseIdleNoise = useRef(createNoise2D());
  const mouseIdleTime = useRef(0);
  const mouseToCenter = useRef({ x: 0, y: 0 });

  const setCards = useCallback(() => {
    if (!reducedMotion()) {
      const positionRange = window.innerWidth * cardsPositionRangeRatioToScreenW;

      cards.current.forEach((card, i) => {
        const increment = cardsArray.length - 1 - i + 0.5;

        const currentRotation =
          parseFloat(card.style.getPropertyValue('--rotation').split('deg')[0]) || 0;
        const currentX = parseFloat(card.style.getPropertyValue('--x').split('px')[0]) || 0;
        const currentY = parseFloat(card.style.getPropertyValue('--y').split('px')[0]) || 0;
        const currentRadius =
          parseFloat(card.style.getPropertyValue('--radius').split('vw')[0]) || 0;

        const targetRotation =
          mouseToCenter.current.x * cardsRotationRange * (increment * cardsRotationRangeIncrement);
        const targetX =
          mouseToCenter.current.x * positionRange * (increment * cardsPositionRangeIncrement);
        const targetY =
          mouseToCenter.current.y * positionRange * (increment * cardsPositionRangeIncrement);
        const targetRadius = Math.abs(mouseToCenter.current.x) * cardsRadiusRange;

        const easing =
          router.asPath === '/' ? easingNormal : isMinimized ? easingMinimized : easingNormal;

        const rotation = currentRotation + (targetRotation - currentRotation) * easing;
        const x = currentX + (targetX - currentX) * easing;
        const y = currentY + (targetY - currentY) * easing;
        const radius = currentRadius + (targetRadius - currentRadius) * easing;

        card.style.setProperty('--index', (cardsArray.length - i).toString());
        card.style.setProperty('--rotation', `${rotation}deg`);
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
        card.style.setProperty('--radius', `${radius}vw`);
      });
    }
  }, [mouseToCenter, isMinimized, router.asPath]);

  const setMouseIdleTimeout = useCallback(() => {
    if (mouseIdleTimeout.current) {
      clearTimeout(mouseIdleTimeout.current);
    }
    setIsMouseIdle(false);

    mouseIdleTimeout.current = setTimeout(() => {
      setIsMouseIdle(true);
    }, mouseIdleTimeoutDuration);
  }, []);

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const halfWidth = window.innerWidth * 0.5;
      const halfHeight = window.innerHeight * 0.5;

      setMouseIdleTimeout();

      mouseToCenter.current = {
        x: ((e.clientX - halfWidth) / window.innerWidth) * 2,
        y: ((e.clientY - halfHeight) / window.innerHeight) * 2,
      };
    },
    [setMouseIdleTimeout],
  );

  const updateAutomaticMousePosition = useCallback(() => {
    if (isMouseIdle) {
      mouseIdleTime.current += mouseIdleNoiseSpeed;
      mouseToCenter.current = {
        x: mouseIdleNoise.current(mouseIdleTime.current, 0),
        y: mouseIdleNoise.current(0, mouseIdleTime.current),
      };
    }
  }, [isMouseIdle]);

  const handleRAF = useCallback(() => {
    updateAutomaticMousePosition();
    setCards();
    raf.current = requestAnimationFrame(handleRAF);
  }, [setCards, updateAutomaticMousePosition]);

  useEffect(() => {
    if (container.current && !reducedMotion()) {
      cards.current = Array.from(container.current.querySelectorAll('div'));

      cards.current.forEach((card, i) => {
        card.style.setProperty('--scale', `${1 - i * cardsScaleRange}`);
      });

      document.addEventListener('mousemove', handleMouseMove);

      setIsMounted(true);

      raf.current = requestAnimationFrame(handleRAF);
    }

    return () => {
      if (!reducedMotion()) {
        document.removeEventListener('mousemove', handleMouseMove);
        if (raf.current) {
          cancelAnimationFrame(raf.current);
        }
      }
    };
  }, [container, raf, handleMouseMove, handleRAF]);

  useEffect(() => {
    if (router.asPath === '/') {
      setIsMinimized(false);
    } else {
      setIsMinimized(true);
    }
  }, [router.asPath]);

  return (
    <React.Fragment>
      <button
        onClick={() => setIsAlternative(!isAlternative)}
        className='fixed left-0 top-0 z-100 size-20'
        tabIndex={-1}
      >
        <span className='sr-only'>Switch background</span>
      </button>
      <div className='animated-background-container motion-reduce:hidden'>
        <div
          className={classNames('animated-background', {
            'animated-background--mounted': isMounted,
            'animated-background--minimized': isMinimized,
            'animated-background--alternative': isAlternative,
          })}
          ref={container}
        >
          {cardsArray.map((_, i) => (
            <div key={i}></div>
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}
