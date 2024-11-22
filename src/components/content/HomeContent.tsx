import CustomMarkdown from '@/components/ui/CustomMarkdown';
import { PageBlocksHomeContent } from '@/tina/types';
import { reducedMotion } from '@/utils/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { createNoise2D } from 'simplex-noise';
import { tinaField } from 'tinacms/dist/react';

const cardsCount = 12;
const cardsRotationRange = 35;
const cardsRotationRangeIncrement = 0.25;
const cardsPositionRangeRatioToScreenW = 0.04;
const cardsPositionRangeIncrement = 0.25;
const cardsRadiusRange = 10;
const easing = 0.03;
const mouseIdleTimeoutDuration = 5000;
const mouseIdleNoiseSpeed = 0.001;

export default function HomeContent({ content }: { content: PageBlocksHomeContent }) {
  const container = useRef<HTMLDivElement | null>(null);
  const cards = useRef<HTMLDivElement[]>([]);
  const raf = useRef<number | null>(null);
  const mouseToCenter = useRef({ x: 0, y: 0 });
  const [isMouseIdle, setIsMouseIdle] = useState(true);
  const mouseIdleNoise = useRef(createNoise2D());
  const mouseIdleTime = useRef(0);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setIsMouseIdle(false);
    mouseToCenter.current = {
      x: ((e.clientX - window.innerWidth / 2) / window.innerWidth) * 2,
      y: ((e.clientY - window.innerHeight / 2) / window.innerHeight) * 2,
    };
  }, []);

  const updateAutomaticMousePosition = useCallback(() => {
    if (isMouseIdle) {
      mouseIdleTime.current += mouseIdleNoiseSpeed;
      mouseToCenter.current = {
        x: mouseIdleNoise.current(mouseIdleTime.current, 0),
        y: mouseIdleNoise.current(0, mouseIdleTime.current),
      };
    }
  }, [isMouseIdle]);

  useEffect(() => {
    if (!isMouseIdle) {
      const timeout = setTimeout(() => {
        setIsMouseIdle(true);
      }, mouseIdleTimeoutDuration);

      return () => clearTimeout(timeout);
    }
  }, [isMouseIdle]);

  const setCards = useCallback(() => {
    if (!reducedMotion()) {
      const positionRange = window.innerWidth * cardsPositionRangeRatioToScreenW;

      cards.current.forEach((card, i) => {
        const increment = 1 + i;

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

        const rotation = currentRotation + (targetRotation - currentRotation) * easing;
        const x = currentX + (targetX - currentX) * easing;
        const y = currentY + (targetY - currentY) * easing;
        const radius = currentRadius + (targetRadius - currentRadius) * easing;

        card.style.setProperty('--rotation', `${rotation}deg`);
        card.style.setProperty('--x', `${x}px`);
        card.style.setProperty('--y', `${y}px`);
        card.style.setProperty('--radius', `${radius}vw`);
      });
    }
  }, [mouseToCenter]);

  const handleRAF = useCallback(() => {
    updateAutomaticMousePosition();
    setCards();
    raf.current = requestAnimationFrame(handleRAF);
  }, [setCards, updateAutomaticMousePosition]);

  useEffect(() => {
    if (container.current && !reducedMotion()) {
      cards.current = Array.from(container.current.querySelectorAll('div'));

      cards.current.forEach((card, i) => {
        card.style.setProperty('--scale', `${1 - i * 0.07}`);
      });
    }

    document.addEventListener('mousemove', handleMouseMove);

    raf.current = requestAnimationFrame(handleRAF);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (raf.current) {
        cancelAnimationFrame(raf.current);
      }
    };
  }, [container, raf, handleMouseMove, handleRAF]);

  return (
    <section className='grid-layout'>
      <div className='grid-item-right relative z-10'>
        <h1 className='mb-spacer-32 text-pretty' data-tina-field={tinaField(content, 'title')}>
          {content.title}
        </h1>
        <div className='sm:ml-1/4' data-tina-field={tinaField(content, 'introduction')}>
          <CustomMarkdown content={content.introduction} />
        </div>
      </div>
      <div className='home-visual-container motion-reduce:hidden'>
        <div className='home-visual' ref={container}>
          {Array.from({ length: cardsCount }).map((_, i) => (
            <div key={i}></div>
          ))}
        </div>
      </div>
    </section>
  );
}
