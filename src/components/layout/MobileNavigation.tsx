import Icon from '@/components/ui/Icon';
import PageLink from '@/components/ui/PageLink';
import { NavigationResult } from '@/types';
import { MenuMotionVariants } from '@/utils/core';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import classNames from 'classnames';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { tinaField, useTina } from 'tinacms/dist/react';

export default function MobileNavigation(props: NavigationResult) {
  const navigationData = useTina(props);
  const { navigation } = navigationData.data;
  const pathName = usePathname();

  return (
    <div className='lg:hidden'>
      <Menu>
        {({ open }) => (
          <>
            <MenuButton className='border-light data-[open]:bg-themed-prev bg-blurred data-[open]:!border-strong relative z-100 rounded-full p-16 transition-colors duration-200 ease-out'>
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
                  variants={MenuMotionVariants}
                  anchor='bottom end'
                  className='bg-blurred border-light relative z-60 mt-16 min-w-[200px] origin-top rounded-xl'
                >
                  <div className='subtitle px-24 py-12 text-sm'>Navigation</div>
                  {navigation.links &&
                    navigation.links.map((link) => (
                      <MenuItem key={link!.link}>
                        <PageLink
                          href={link!.link}
                          data-tina-field={tinaField(link!, 'label')}
                          data-active-value={link!.link.split('/')[1]}
                          className={classNames(
                            'border-light data-[focus]:bg-themed-prev flex w-full gap-16 !border-b-0 !border-l-0 !border-r-0 py-16 pl-24 pr-16 text-left text-base font-bold transition-colors duration-200 ease-out',
                            {
                              'bg-themed-next': pathName.split('/')[1] === link!.link.split('/')[1],
                            },
                          )}
                        >
                          {link!.label}
                        </PageLink>
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
