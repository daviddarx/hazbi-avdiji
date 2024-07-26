import Icon from '@/components/ui/Icon';
import PageLink from '@/components/ui/PageLink';
import t from '@/content/translations';
import { NavigationResult } from '@/types';
import { getMenuMotionVariants } from '@/utils/core';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import React from 'react';
import { tinaField, useTina } from 'tinacms/dist/react';

export default function MobileNavigation(props: NavigationResult) {
  const navigationData = useTina(props);
  const { navigation } = navigationData.data;
  const pathName = usePathname();

  return (
    <div className='pointer-events-auto lg:hidden'>
      <Menu>
        {({ open }) => (
          <>
            <MenuButton className='border-light data-[open]:bg-themed-prev bg-blurred data-[open]:!border-strong hashover:hover:bg-themed-prev hashover:hover:!border-strong relative z-100 rounded-full border p-16 transition-colors duration-200 ease-out'>
              <Icon name='menu' />
            </MenuButton>
            <AnimatePresence>
              {open && (
                <MenuItems
                  static
                  as={motion.div}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  variants={getMenuMotionVariants(window?.innerWidth)}
                  anchor='bottom end'
                  className='navigation-menu-items'
                >
                  <div className='navigation-subtitle'>{t.mobileNavigation.title}</div>
                  {navigation.links &&
                    navigation.links.map((link) => (
                      <MenuItem key={link!.link}>
                        {({ close }) => (
                          <React.Fragment>
                            {/* Fragment to avoid error of slot giving ref to functional component PageLink. */}
                            <PageLink
                              href={link!.link}
                              data-tina-field={tinaField(link!, 'label')}
                              data-active-value={link!.link.split('/')[1]}
                              onClick={close}
                              className={classNames('navigation-link', {
                                'bg-themed-next':
                                  pathName.split('/')[1] === link!.link.split('/')[1],
                              })}
                            >
                              {link!.label}
                            </PageLink>
                          </React.Fragment>
                        )}
                      </MenuItem>
                    ))}
                </MenuItems>
              )}
            </AnimatePresence>
          </>
        )}
      </Menu>
    </div>
  );
}
