import PageLink from '@/components/ui/PageLink';
import { ActiveLinkDetectionFn } from '@/types';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { tinaField } from 'tinacms/dist/react';

export default function ActiveNavigation({
  title = '',
  items = [],
  scrollToTop = true,
  useTinaField = false,
  className = '',
  activeLinkDetection = undefined,
  animated = true,
}: {
  title: string;
  items: ({ label: string; link: string } | null)[];
  scrollToTop?: boolean;
  useTinaField?: boolean;
  className?: string;
  activeLinkDetection?: ActiveLinkDetectionFn;
  animated?: boolean;
}) {
  const [activeDimensions, setActiveDimensions] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

  const handleActiveItem = useCallback((link: HTMLAnchorElement) => {
    const parent = link.parentNode as HTMLElement;
    if (parent) {
      setActiveDimensions({
        top: parent.offsetTop,
        left: parent.offsetLeft - 4,
        width: link.offsetWidth + 8,
        height: link.offsetHeight,
      });
    }
  }, []);

  return (
    <nav
      className={classNames('rounded-full border border-black/20 p-12 backdrop-blur-md', className)}
      style={{ backgroundColor: 'color-mix(in lab, var(--color-theme) 20%, transparent)' }}
    >
      <h2 className='sr-only'>{title}</h2>
      <ul className='relative flex flex-wrap items-start px-4'>
        {items.map((item) => (
          <li
            key={item!.link}
            data-tina-field={useTinaField ? tinaField(item!, 'label') : undefined}
          >
            <PageLink
              href={item!.link!}
              className='inline-block px-16 py-8 font-bold'
              onActive={handleActiveItem}
              scrollToTop={scrollToTop}
              activeDetection={activeLinkDetection}
            >
              {item?.label}
            </PageLink>
          </li>
        ))}
        <div
          className={classNames(
            'absolute -z-10 rounded-full border border-black bg-theme-next transition-all duration-500 ease-in-out-quart',
            animated ? 'duration-500' : 'duration-0',
          )}
          style={activeDimensions}
        ></div>
      </ul>
    </nav>
  );
}
