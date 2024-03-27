import { themeColors } from '@/utils/core';
import type { Timeout } from '@/utils/core';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const colors = Object.values(themeColors);
const animationDuration = 1000;
const colorsStepsAmount = colors.length + 1;
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

      if (currentColorId === 0) {
        if (wasInitialized) {
          tv = (((colorsStepsAmount - 1) * -1) / colorsStepsAmount) * 100;
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
      } else {
        tv = ((currentColorId * -1) / 7) * 100;
      }

      setTransformValue(`${tv}%`);
      document.body.style.setProperty('--color-theme', colors[currentColorId]);
      document.body.style.setProperty(
        '--color-theme-prev',
        currentColorId === 0 ? colors[colors.length - 1] : colors[currentColorId - 1],
      );
      document.body.style.setProperty(
        '--color-theme-next',
        currentColorId === colors.length - 1 ? colors[0] : colors[currentColorId + 1],
      );

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
        <div className='h-lvh w-screen bg-gradient-to-b from-theme1 to-theme2'></div>
        <div className='h-lvh w-screen bg-gradient-to-b from-theme2 to-theme3'></div>
        <div className='h-lvh w-screen bg-gradient-to-b from-theme3 to-theme4'></div>
        <div className='h-lvh w-screen bg-gradient-to-b from-theme4 to-theme5'></div>
        <div className='h-lvh w-screen bg-gradient-to-b from-theme5 to-theme6'></div>
        <div className='h-lvh w-screen bg-gradient-to-b from-theme6 to-theme1'></div>
        <div className='h-lvh w-screen bg-gradient-to-b from-theme1 to-theme2'></div>
      </div>
    </div>
  );
}
