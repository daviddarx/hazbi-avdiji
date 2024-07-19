import CustomMarkdown from '@/components/ui/CustomMarkdown';
import { PageBlocksHomeContent } from '@/tina/types';
import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { useRef } from 'react';
import { tinaField } from 'tinacms/dist/react';

gsap.registerPlugin(useGSAP);

export default function HomeContent({ content }: { content: PageBlocksHomeContent }) {
  const container = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      if (container.current) {
        const divs = container.current.querySelectorAll('div');
        divs.forEach((div, i) => {
          gsap.set(div, { rotation: i * 2 });
          gsap.to(div, {
            rotation: 180,
            borderRadius: 200,
            delay: i * 0.1,
            duration: 10,
            scale: 1 - i * 0.05,
            ease: 'back.out(2)',
            repeat: -1,
            yoyo: true,
          });
        });
      }
    },
    { scope: container },
  );

  return (
    <section className='grid-layout min-h-full'>
      <div className='grid-item-right relative z-10'>
        <h1 className='mb-spacer-32 text-pretty' data-tina-field={tinaField(content, 'title')}>
          {content.title}
        </h1>
        <div className='ml-1/4' data-tina-field={tinaField(content, 'introduction')}>
          <CustomMarkdown content={content.introduction} />
        </div>
      </div>
      <div className='home-visual' ref={container}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </section>
  );
}
