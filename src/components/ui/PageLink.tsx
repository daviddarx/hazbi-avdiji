/* based on https://github.com/vercel/next.js/blob/canary/examples/active-class-name/components/PageLink.tsx */
import { uiActions } from '@/store';
import { ActiveLinkDetectionFn } from '@/types';
import Link, { LinkProps } from 'next/link';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

type PageLinkProps = LinkProps & {
  className?: string;
  activeClassName?: string;
  scrollToTop?: boolean;
  activeDetection?: ActiveLinkDetectionFn;
  onActive?: (link: HTMLAnchorElement) => void | undefined;
};

const defaultActiveLinkDetection = (currentPathname: string, linkPathname: string) => {
  return currentPathname.split('/')[1] === linkPathname.split('/')[1];
};

const PageLink = ({
  children,
  activeClassName = '',
  className = '',
  scrollToTop = true,
  activeDetection = defaultActiveLinkDetection,
  onActive = undefined,
  ...props
}: PropsWithChildren<PageLinkProps>) => {
  const { isReady } = useRouter();
  const [computedClassName, setComputedClassName] = useState(className);
  const dispatch = useDispatch();
  const linkRef = useRef<HTMLAnchorElement>(null);
  const path = usePathname();

  useEffect(() => {
    if (isReady) {
      const linkPathname = new URL((props.as || props.href) as string, location.href).pathname;

      const isActive = activeDetection(path, linkPathname);

      const newClassName = isActive ? `${className} ${activeClassName}`.trim() : className;

      if (newClassName !== computedClassName) {
        setComputedClassName(newClassName);
      }

      if (isActive && onActive) {
        onActive(linkRef.current!);
      }
    }
  }, [
    isReady,
    path,
    activeDetection,
    props.as,
    props.href,
    activeClassName,
    className,
    computedClassName,
    onActive,
  ]);

  const handleClick = () => {
    if (scrollToTop === false) {
      dispatch(uiActions.setScrollToTopOnPageChange(false));
    }
  };

  return (
    <Link
      ref={linkRef}
      onClick={handleClick}
      scroll={false}
      className={computedClassName}
      {...props}
    >
      {children}
    </Link>
  );
};

export default PageLink;
