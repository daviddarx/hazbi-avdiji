import { useGSAP } from '@gsap/react';
import { gsap } from 'gsap';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useRef } from 'react';

gsap.registerPlugin(useGSAP);

export default function AnimatedBackground() {
  const container = useRef<HTMLDivElement | null>(null);
  const path = usePathname();

  useEffect(() => {
    if (path === '/') {
      gsap.globalTimeline.resume();
      container.current?.classList.remove('paused');
    } else {
      gsap.globalTimeline.resume();

      setTimeout(() => {
        gsap.globalTimeline.pause();
      }, 500);
      container.current?.classList.add('paused');
    }
  }, [path]);

  useGSAP(
    () => {
      if (container.current) {
        const divs = container.current.querySelectorAll('div');
        // var tl = gsap.timeline({ repeat: -1, yoyo: true });

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
  );
}
