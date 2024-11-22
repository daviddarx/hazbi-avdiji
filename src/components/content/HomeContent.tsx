import CustomMarkdown from '@/components/ui/CustomMarkdown';
import { PageBlocksHomeContent } from '@/tina/types';
import { reducedMotion } from '@/utils/core';
import { useCallback, useEffect, useRef, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';

const cardsCount = 12;
const cardsRotationRange = 20;
const cardsRotationRangeIncrement = 0.25;
const cardsPositionRangeRatioToScreenW = 0.04;
const cardsPositionRangeIncrement = 0.25;

export default function HomeContent({ content }: { content: PageBlocksHomeContent }) {
  const container = useRef<HTMLDivElement | null>(null);
  const cards = useRef<HTMLDivElement[]>([]);
  const raf = useRef<number | null>(null);
  const [mouseToCenter, setMouseToCenter] = useState({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setMouseToCenter({
      x: ((e.clientX - window.innerWidth / 2) / window.innerWidth) * 2,
      y: ((e.clientY - window.innerHeight / 2) / window.innerHeight) * 2,
    });
  }, []);

  const setCards = useCallback(() => {
    if (!reducedMotion()) {
      const positionRange = window.innerWidth * cardsPositionRangeRatioToScreenW;

      cards.current.forEach((card, i) => {
        card.style.setProperty(
          '--rotation',
          `${mouseToCenter.x * cardsRotationRange * ((1 + i) * cardsRotationRangeIncrement)}deg`,
        );
        card.style.setProperty(
          '--x',
          `${mouseToCenter.x * positionRange * ((1 + i) * cardsPositionRangeIncrement)}px`,
        );
        card.style.setProperty(
          '--y',
          `${mouseToCenter.y * positionRange * ((1 + i) * cardsPositionRangeIncrement)}px`,
        );
      });
    }
  }, [mouseToCenter]);

  const handleRAF = useCallback(() => {
    setCards();
    raf.current = requestAnimationFrame(handleRAF);
  }, [setCards]);

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
