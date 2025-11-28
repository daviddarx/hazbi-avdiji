import Logo from '@/components/layout/Logo';
import PageLink from '@/components/ui/PageLink';
import t from '@/content/translations';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';

export default function Header() {
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = useCallback(() => {
    const currentScrollTop = Math.max(window.scrollY, 0);

    if (currentScrollTop > 30) {
      setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  });

  return (
    <div
      className={classNames(
        'fixed top-gutter w-full transition-[transform,opacity] ease-out-quart',
        isVisible
          ? 'duration-500'
          : 'pointer-events-none translate-y-32 opacity-0 delay-[150ms,0s] duration-150',
      )}
    >
      <header className='grid-layout pointer-events-none w-full'>
        <h2 className='grid-item-full'>
          <PageLink href='/' className='pointer-events-auto relative z-70 inline-block'>
            <Logo className={'w-[80px] lg:w-[103px]'} />
            <span className='sr-only'>{t.logoTitle}</span>
            <span className='font-text mt-12 block max-w-[9em] text-[0.62rem] leading-tight xs:mt-20 xs:text-sm lg:text-[0.8rem]'>
              {t.logoSubline}
            </span>
          </PageLink>
        </h2>
      </header>
    </div>
  );
}
