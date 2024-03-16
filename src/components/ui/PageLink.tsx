/* based on https://github.com/vercel/next.js/blob/canary/examples/active-class-name/components/PageLink.tsx */
import { uiActions } from '@/store';
import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import React, { PropsWithChildren, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

type PageLinkProps = LinkProps & {
  className?: string;
  activeClassName?: string;
  scrollToTop?: boolean;
};

const PageLink = ({
  children,
  activeClassName = '',
  className = '',
  scrollToTop = true,
  ...props
}: PropsWithChildren<PageLinkProps>) => {
  const { asPath, isReady } = useRouter();
  const [computedClassName, setComputedClassName] = useState(className);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isReady) {
      const linkPathname = new URL((props.as || props.href) as string, location.href).pathname;

      const activePathname = new URL(asPath, location.href).pathname;

      const newClassName =
        linkPathname.split('/')[1] === activePathname.split('/')[1]
          ? `${className} ${activeClassName}`.trim()
          : className;

      if (newClassName !== computedClassName) {
        setComputedClassName(newClassName);
      }
    }
  }, [asPath, isReady, props.as, props.href, activeClassName, className, computedClassName]);

  const handleClick = () => {
    if (scrollToTop === false) {
      dispatch(uiActions.setScrollToTopOnPageChange(false));
    }
  };

  return (
    <Link onClick={handleClick} scroll={false} className={computedClassName} {...props}>
      {children}
    </Link>
  );
};

export default PageLink;
