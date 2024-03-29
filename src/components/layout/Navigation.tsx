import PageLink from '@/components/ui/PageLink';
import { NavigationResult } from '@/types';
import ease from '@/utils/eases';
import classNames from 'classnames';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { tinaField, useTina } from 'tinacms/dist/react';

export default function Navigation(props: NavigationResult) {
  const navigationData = useTina(props);
  const { navigation } = navigationData.data;
  const path = usePathname();

  return (
    <nav
      className={classNames(
        'nav',
        'lg:fixed lg:left-1/2 lg:top-gutter lg:z-50 lg:-translate-x-1/2',
        'lg:overflow-hidden lg:backdrop-blur-md',
        'lg:before:absolute lg:before:left-0 lg:before:top-0 lg:before:-z-10 lg:before:h-full lg:before:w-full lg:before:bg-theme lg:before:opacity-20',
      )}
    >
      <h2 className='sr-only'>Navigation</h2>
      <ul className='nav-list'>
        {navigation.links &&
          navigation.links.map((link) => (
            <li
              key={link!.link}
              data-tina-field={link && tinaField(link, 'label')}
              className='relative'
            >
              <PageLink href={link!.link} className='nav-link'>
                {link?.label}
              </PageLink>

              {path.split('/')[1] === link!.link.split('/')[1] && (
                <motion.span
                  layoutId='activeNav'
                  className='absolute -bottom-4 -left-4 -right-4 -top-4 -z-10 rounded-full border border-black bg-theme-next'
                  transition={{
                    duration: 0.5,
                    ease: ease.inOutQuart,
                  }}
                />
              )}
            </li>
          ))}
      </ul>
    </nav>
  );
}
