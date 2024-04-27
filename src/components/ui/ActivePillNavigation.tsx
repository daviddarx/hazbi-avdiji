import classNames from 'classnames';
import React, { useCallback, useEffect, useRef, useState } from 'react';

type dimensions = {
  top: string | number;
  left: string | number;
  width: number;
  height: number;
  opacity: number;
};

const defaultDimensions = {
  top: '50%',
  left: '50%',
  width: 0,
  height: 0,
  opacity: 0,
};

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

  const [activeDimensions, setActiveDimensions] = useState<dimensions>(defaultDimensions);
  const [hoverDimensions, setHoverDimensions] = useState<dimensions>(defaultDimensions);

  const getItemDimensions = (item: HTMLElement, parent: HTMLElement) => {
    return {
      top: parent.offsetTop,
      left: parent.offsetLeft - 4,
      width: item.offsetWidth + 8,
      height: item.offsetHeight,
      opacity: 1,
    };
  };

  const getDeactiveDimensions = (currentDimensions: dimensions) => {
    return {
      ...currentDimensions,
      opacity: 0,
    };
  };

  const handleActiveItem = useCallback((item: HTMLElement | null | undefined) => {
    if (item) {
      const parent = item.parentNode as HTMLElement;
      if (parent) {
        setActiveDimensions(getItemDimensions(item, parent));
        setHoverDimensions((currentDimensions) => {
          return getDeactiveDimensions(currentDimensions);
        });
      }
    } else {
      setActiveDimensions((currentDimensions) => {
        return getDeactiveDimensions(currentDimensions);
      });
    }
  }, []);

  const handleResize = useCallback(() => {
    handleActiveItem(activeChild);
  }, [activeChild, handleActiveItem]);

  const handleMouseOver = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    if (target.hasAttribute('data-clickable')) {
      const parent = target.parentNode as HTMLElement;
      if (parent) {
        setHoverDimensions(getItemDimensions(target, parent));
      }
    }
  }, []);

  const handleMouseOut = useCallback((e: MouseEvent) => {
    setHoverDimensions((currentDimensions) => {
      return getDeactiveDimensions(currentDimensions);
    });
  }, []);

  useEffect(() => {
    const nav = container.current;
    window.addEventListener('resize', handleResize);
    if (nav) {
      nav.addEventListener('mouseover', handleMouseOver);
      nav.addEventListener('mouseout', handleMouseOut);
    }

    return () => {
      window.removeEventListener('resize', handleResize);
      if (nav) {
        nav.removeEventListener('mouseover', handleMouseOver);
        nav.removeEventListener('mouseout', handleMouseOut);
      }
    };
  }, [handleResize, handleMouseOver, handleMouseOut]);

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
        'rounded-cards border border-black/20 p-12 backdrop-blur-md',
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
            'absolute -z-10 transform-gpu rounded-full border border-black bg-theme-next transition-all duration-500 ease-in-out-quart',
          )}
          style={activeDimensions}
        ></div>
        <div
          className={classNames(
            'absolute -z-20 hidden transform-gpu rounded-full border border-black bg-theme-prev transition-all duration-300 ease-out-quart hashover:block',
          )}
          style={hoverDimensions}
        ></div>
      </ul>
    </nav>
  );
}
