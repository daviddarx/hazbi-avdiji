import { themeColors } from '@/utils/ui';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const colors = Object.values(themeColors);

export default function ColoredBackground() {
  const router = useRouter();
  const [currentColorId, setCurrentColorId] = useState<null | number>(null);

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
    if (currentColorId !== null) {
      document.body.style.setProperty('--color-theme', colors[currentColorId]);
    }
  }, [currentColorId]);

  return (
    <div className='h-lvh bg-theme fixed left-0 top-0 -z-10 w-screen transition-colors duration-500'></div>
  );
}
