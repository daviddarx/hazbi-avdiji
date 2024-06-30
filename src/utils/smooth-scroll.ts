/**
 * The built-in node.scrollIntoView() and window.scrollTo() don't
 * work well while updating the content (and height/width) of the
 * page/container, as the duration of the scroll is defined by the
 * browser and the animated scroll bugs if there is a DOM change
 * during the animation.
 *
 * For such cases, a custom scroll animation with RFA and absolute
 * value works better, as it isn't impacted from DOM change.
 */

export type ScrollDirection = 'scrollLeft' | 'scrollTop';

let RFA: number;

export default function smoothScrollTo(
  node: HTMLElement | Window,
  scrollValue: number,
  duration: number,
  direction: ScrollDirection,
  easeFunction: (t: number) => number,
) {
  if (RFA) {
    cancelAnimationFrame(RFA);
  }

  const start =
    node instanceof Window
      ? direction === 'scrollTop'
        ? window.scrollY
        : window.scrollX
      : node[direction];
  const startTime = performance.now();

  function scrollAnimation(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    const ease = easeFunction(progress);
    const scrollPosition = start + (scrollValue - start) * ease;

    if (node instanceof Window) {
      direction === 'scrollTop'
        ? window.scrollTo({ top: scrollPosition, behavior: 'instant' as 'auto' })
        : window.scrollTo({ left: scrollPosition, behavior: 'instant' as 'auto' });
    } else {
      node[direction] = scrollPosition;
    }

    if (progress < 1) {
      RFA = requestAnimationFrame(scrollAnimation);
    }
  }

  RFA = requestAnimationFrame(scrollAnimation);
}

/**
 * Utilitary to get the scrollMarginTop of an element
 */

export function getScrollMarginTop(node: HTMLElement): number {
  return parseInt(
    window.getComputedStyle(node).getPropertyValue('scroll-margin-top').split('px')[0],
  );
}

/**
 * Utilitary to get the scrollTop position of an element,
 * including its scrollMarginTop. This will be always
 * needed for vertical scroll animations, as we have sticky
 * elements in the layout (shopbar, mobile header, etc).
 */

export function getScrollTop(node: HTMLElement, scrollMarginTop?: number): number {
  if (!scrollMarginTop) {
    scrollMarginTop = getScrollMarginTop(node);
  }
  return node.getBoundingClientRect().top - scrollMarginTop + window.scrollY;
}
