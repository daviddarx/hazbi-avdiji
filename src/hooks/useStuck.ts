import { useEffect, useRef } from 'react';

export default function useStuck<T extends HTMLElement>({
  onStuck,
  onStuckClass = 'stucked',
  onUnStuck,
  stickToTop = true,
  onMount,
  onUnmount,
  positionDelay = 0,
}: {
  onStuck?: (el: T) => void;
  onStuckClass?: string;
  onUnStuck?: (el: T) => void;
  stickToTop?: boolean;
  onMount?: (el: T) => void;
  onUnmount?: (el: T) => void;
  positionDelay?: number;
}) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const node = ref.current;
    let intersectionObserver: IntersectionObserver;

    if (node) {
      /**
       * A sentinel is added before (sickToTop) or after (!stickToTop)
       * the sticky element to manage the isStuck with an intersection
       * observer. When the sentinel is visible, the sticky element
       * cannot be sticking.
       *
       * - 1px height is needed for safari.
       * - nodeTop insure the system to work with top property, to have multiple stucked elements.
       */
      intersectionObserver = new IntersectionObserver(intersectionCallback, {});
      const stickySentinel = document.createElement('div');
      const nodeTop = parseInt(getComputedStyle(node).top.split('px')[0]) + positionDelay;

      stickySentinel.style.cssText = `position: absolute; height: 1px;`;

      if (stickToTop) {
        node.parentNode?.insertBefore(stickySentinel, node);
        stickySentinel.style.marginTop = `-${nodeTop}px`;
      } else {
        node.parentNode?.insertBefore(stickySentinel, node.nextSibling);
        stickySentinel.style.marginBottom = `${nodeTop}px`;
      }

      intersectionObserver.observe(stickySentinel);

      if (onMount) {
        onMount(node);
      }
    }

    function intersectionCallback(entries: IntersectionObserverEntry[]) {
      const entry: IntersectionObserverEntry = entries[0];

      let isStuck = false;

      if (!entry.isIntersecting && isValidYPosition(entry)) {
        isStuck = true;
      }

      if (node) {
        if (isStuck) {
          node.classList.add(onStuckClass);
          if (onStuck) {
            onStuck(node);
          }
        } else {
          node.classList.remove(onStuckClass);
          if (onUnStuck) {
            onUnStuck(node);
          }
        }
      }
    }

    function isValidYPosition({
      boundingClientRect,
    }: {
      boundingClientRect: { y: number };
    }): boolean {
      if (stickToTop) {
        return boundingClientRect.y < 0;
      } else {
        return boundingClientRect.y > 0;
      }
    }

    return () => {
      if (node) {
        intersectionObserver.disconnect();

        if (onUnmount) {
          onUnmount(node);
        }
      }
    };
  }, [onStuck, onStuckClass, onUnStuck, onMount, onUnmount, stickToTop]);

  return ref;
}
