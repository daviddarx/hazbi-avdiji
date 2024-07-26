import PageLink from '@/components/ui/PageLink';
import { FooteNavigationResult } from '@/types';
import { tinaField, useTina } from 'tinacms/dist/react';

export default function Footer(props: FooteNavigationResult) {
  const date = new Date();
  const navigationData = useTina(props);
  const { footerNavigation } = navigationData.data;

  return (
    <footer className='grid-layout'>
      <div className='grid-item-full border-light flex flex-wrap justify-between gap-20 border-t py-gutter text-sm md:py-spacer-48 md:text-base lg:pb-72'>
        {footerNavigation.links && (
          <nav className='flex gap-4 max-md:flex-col md:gap-40'>
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
        <div>© {date.getFullYear()} Hazbi Avdiji</div>
      </div>
    </footer>
  );
}
