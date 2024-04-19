import PageLink from '@/components/ui/PageLink';
import { NavigationResult } from '@/types';
import classNames from 'classnames';
import { useCallback, useState } from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';

export default function Navigation(props: NavigationResult) {
  const navigationData = useTina(props);
  const { navigation } = navigationData.data;
  const [activeDimensions, setActiveDimensions] = useState({
    top: 0,
    left: 0,
    width: 10,
    height: 20,
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
      className={classNames(
        'overflow-hidden rounded-full border border-black/20 p-12 backdrop-blur-md',
        'lg:fixed lg:left-1/2 lg:top-gutter lg:z-50 lg:-translate-x-1/2',
      )}
      style={{ backgroundColor: ' color-mix(in lab, var(--color-theme) 20%, transparent)' }}
    >
      <h2 className='sr-only'>Navigation</h2>
      <ul className='relative flex flex-wrap items-start px-4'>
        {navigation.links &&
          navigation.links.map((link) => (
            <li key={link!.link} data-tina-field={link && tinaField(link, 'label')}>
              <PageLink
                href={link!.link}
                className='inline-block px-16 py-8 font-bold'
                onActive={handleActiveItem}
              >
                {link?.label}
              </PageLink>
            </li>
          ))}
        <div
          className='absolute -z-10 rounded-full border border-black bg-theme-next transition-all duration-500 ease-in-out-quart'
          style={activeDimensions}
        ></div>
      </ul>
    </nav>
  );
}
