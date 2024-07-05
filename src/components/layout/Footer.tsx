import PageLink from '@/components/ui/PageLink';
import { FooteNavigationResult } from '@/types';
import { tinaField, useTina } from 'tinacms/dist/react';

export default function Footer(props: FooteNavigationResult) {
  const date = new Date();
  const navigationData = useTina(props);
  const { footerNavigation } = navigationData.data;

  return (
    <footer className='grid-layout mt-auto '>
      <div className='grid-item-full border-light flex justify-between border-t pb-spacer-48 pt-spacer-48 text-base lg:pb-72'>
        <div>© {date.getFullYear()} Hazbi Avdiji</div>
        {footerNavigation.links && (
          <nav className='flex gap-spacer-48 lg:gap-40'>
            <h2 className='sr-only'>Footer Navigation</h2>
            {footerNavigation.links.map((link) => (
              <PageLink
                key={link!.link}
                href={link!.link}
                data-tina-field={tinaField(link!, 'label')}
                className='text-link'
              >
                {link!.label}
              </PageLink>
            ))}
          </nav>
        )}
      </div>
    </footer>
  );
}
