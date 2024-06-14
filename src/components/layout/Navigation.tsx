import ActivePillNavigation from '@/components/ui/ActivePillNavigation';
import PageLink from '@/components/ui/PageLink';
import { uiStateType } from '@/store/ui-slice';
import { NavigationResult } from '@/types';
import classNames from 'classnames';
import { usePathname } from 'next/navigation';
import React from 'react';
import { useSelector } from 'react-redux';
import { tinaField, useTina } from 'tinacms/dist/react';

export default function Navigation(props: NavigationResult) {
  const navigationData = useTina(props);
  const { navigation } = navigationData.data;
  const pathName = usePathname();
  const hiddenTopBar = useSelector((state: uiStateType) => state.ui.hiddenTopBar);

  return (
    <React.Fragment>
      {navigation.links && (
        <ActivePillNavigation
          title={'Navigation'}
          currentActiveValue={pathName.split('/')[1]}
          className={classNames(
            'pointer-events-auto relative transition-opacity duration-300 max-lg:hidden',
            {
              'opacity-0 duration-1000': hiddenTopBar,
            },
          )}
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
