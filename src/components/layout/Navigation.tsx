import ActivePillNavigation from '@/components/ui/ActivePillNavigation';
import PageLink from '@/components/ui/PageLink';
import { NavigationResult } from '@/types';
import { usePathname } from 'next/navigation';
import React from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';

export default function Navigation(props: NavigationResult) {
  const navigationData = useTina(props);
  const { navigation } = navigationData.data;
  const pathName = usePathname();

  return (
    <React.Fragment>
      {navigation.links && (
        <ActivePillNavigation
          title={'Navigation'}
          currentActiveValue={pathName.split('/')[1]}
          className='fixed left-1/2 top-gutter z-50 -translate-x-1/2 max-lg:hidden'
        >
          {navigation.links.map((link) => (
            <PageLink
              key={link!.link}
              href={link!.link}
              data-tina-field={tinaField(link!, 'label')}
              data-active-value={link!.link.split('/')[1]}
            >
              {link!.label}
            </PageLink>
          ))}
        </ActivePillNavigation>
      )}
    </React.Fragment>
  );
}
