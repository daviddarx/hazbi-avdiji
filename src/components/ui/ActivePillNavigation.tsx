import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

export default function ActivePillNavigation({
  children = [],
  title = '',
  currentActiveValue = '',
  className = '',
}: {
  children: React.ReactNode;
  title: string;
  currentActiveValue: string;
  className?: string;
}) {
  const container = useRef<HTMLElement>(null);
  const [activeChild, setActiveChild] = useState<null | HTMLElement>(null);

  const [activeDimensions, setActiveDimensions] = useState<{
    top: string | number;
    left: string | number;
    width: number;
    height: number;
    opacity: number;
  }>({
    top: '50%',
    left: '50%',
    width: 0,
    height: 0,
    opacity: 0,
  });

  const handleActiveItem = useCallback((item: HTMLElement | null | undefined) => {
    if (item) {
      const parent = item.parentNode as HTMLElement;
      if (parent) {
        setActiveDimensions({
          top: parent.offsetTop,
          left: parent.offsetLeft - 4,
          width: item.offsetWidth + 8,
          height: item.offsetHeight,
          opacity: 1,
        });
      }
    } else {
      setActiveDimensions((currentDimensions) => {
        return {
          top: '50%',
          left:
            typeof currentDimensions.left === 'number'
              ? currentDimensions.left + currentDimensions.width * 0.5
              : currentDimensions.left,
          width: 0,
          height: 0,
          opacity: 0,
        };
      });
    }
  }, []);

  const handleResize = useCallback(() => {
    handleActiveItem(activeChild);
  }, [activeChild, handleActiveItem]);

  useEffect(() => {
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [handleResize]);

  useEffect(() => {
    const activeElement = container.current?.querySelector(
      `[data-active-value='${currentActiveValue}']`,
    );
    handleActiveItem(activeElement as HTMLElement);
    setActiveChild(activeElement as HTMLElement);
  }, [currentActiveValue, handleActiveItem]);

  return (
    <nav
      ref={container}
      className={classNames(
        'rounded-[1.5em] border border-black/20 p-12 backdrop-blur-md',
        className,
      )}
      style={{ backgroundColor: 'color-mix(in lab, var(--color-theme) 20%, transparent)' }}
    >
      <h2 className='sr-only'>{title}</h2>
      <ul className='relative flex flex-wrap items-start px-4'>
        {children &&
          React.Children.map(children, (child, i) => (
            <li key={i}>
              {React.cloneElement(child as React.ReactElement, {
                className: 'inline-block px-16 py-8 font-bold',
                'data-clickable': true,
              })}
            </li>
          ))}
        <div
          className={classNames(
            'absolute -z-10 rounded-full border border-black bg-theme-next transition-all duration-500 ease-in-out-quart',
          )}
          style={activeDimensions}
        ></div>
      </ul>
    </nav>
  );
}
