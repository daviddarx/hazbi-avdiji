import { themeColors } from '@/utils/core';
import type { Timeout } from '@/utils/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const colors = Object.values(themeColors);
const animationDuration = 1000;
let wasInitialized = false;

export default function ColoredBackground() {
  const router = useRouter();
  const [currentColorId, setCurrentColorId] = useState<null | number>(null);
  const [transformValue, setTransformValue] = useState('0%');
  const [transitionDuration, setTransitionDuration] = useState(animationDuration);

  useEffect(() => {
    setCurrentColorId((current) => {
      if (current === null) {
        return 0;
      } else {
        return current < colors.length - 1 ? current + 1 : 0;
      }
    });
  }, [router.asPath]);

  useEffect(() => {
    let resetTimeout: Timeout;

    if (currentColorId !== null) {
      let tv = 0;
      switch (currentColorId) {
        case 1:
          tv = -20;
          break;
        case 2:
          tv = -40;
          break;
        case 3:
          tv = -60;
          break;
        default:
          if (wasInitialized) {
            tv = -80;
            resetTimeout = setTimeout(() => {
              setTransitionDuration(0);
              requestAnimationFrame(() => {
                setTransformValue(`0%`);
                requestAnimationFrame(() => {
                  setTransitionDuration(animationDuration);
                });
              });
            }, animationDuration + 10);
          } else {
            tv = 0;
            wasInitialized = true;
          }
      }
      setTransformValue(`${tv}%`);
      document.body.style.setProperty('--color-theme', colors[currentColorId]);

      return () => {
        if (resetTimeout) {
          clearTimeout(resetTimeout);
        }
      };
    }
  }, [currentColorId]);

  useEffect(() => {
    requestAnimationFrame(() => {
      setTransformValue(`0%`);
    });
  }, []);

  return (
    <div className='fixed left-0 top-0 -z-10 h-lvh w-screen overflow-hidden'>
      <div
        className='transition-transform'
        style={{
          transitionDuration: `${transitionDuration}ms`,
          transform: `translate3d(0, ${transformValue}, 0)`,
        }}
      >
        <div className='from-theme1 to-theme2 h-lvh w-screen bg-gradient-to-b'>1</div>
        <div className='from-theme2 to-theme3 h-lvh w-screen bg-gradient-to-b'>2</div>
        <div className='from-theme3 to-theme4 h-lvh w-screen bg-gradient-to-b'>3</div>
        <div className='from-theme4 to-theme1 h-lvh w-screen bg-gradient-to-b'>4</div>
        <div className='from-theme1 to-theme2 h-lvh w-screen bg-gradient-to-b'>5</div>
      </div>
    </div>
  );
}
