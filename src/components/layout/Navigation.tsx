import ActiveNavigation from '../ui/ActiveNavigation';
import { NavigationResult } from '@/types';
import React from 'react';
import { useTina } from 'tinacms/dist/react';

export default function Navigation(props: NavigationResult) {
  const navigationData = useTina(props);
  const { navigation } = navigationData.data;

  return (
    <React.Fragment>
      {navigation.links && (
        <ActiveNavigation
          title={'Navigation'}
          items={navigation.links}
          useTinaField={true}
          className='lg:fixed lg:left-1/2 lg:top-gutter lg:z-50 lg:-translate-x-1/2'
        />
      )}
    </React.Fragment>
  );
}
