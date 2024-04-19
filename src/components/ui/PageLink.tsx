/* based on https://github.com/vercel/next.js/blob/canary/examples/active-class-name/components/PageLink.tsx */
import { uiActions } from '@/store';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

type PageLinkProps = LinkProps & {
  className?: string;
  activeClassName?: string;
  scrollToTop?: boolean;
  onActive?: (link: HTMLAnchorElement) => void | undefined;
};

const PageLink = ({
  children,
  activeClassName = '',
  className = '',
  scrollToTop = true,
  onActive = undefined,
  ...props
}: PropsWithChildren<PageLinkProps>) => {
  const { asPath, isReady } = useRouter();
  const [computedClassName, setComputedClassName] = useState(className);
  const dispatch = useDispatch();
  const linkRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (isReady) {
      const linkPathname = new URL((props.as || props.href) as string, location.href).pathname;

      const activePathname = new URL(asPath, location.href).pathname;

      const isActive = linkPathname.split('/')[1] === activePathname.split('/')[1];

      const newClassName = isActive ? `${className} ${activeClassName}`.trim() : className;

      if (newClassName !== computedClassName) {
        setComputedClassName(newClassName);
      }

      if (isActive && onActive) {
        onActive(linkRef.current!);
      }
    }
  }, [
    asPath,
    isReady,
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
