import CustomMarkdown from '@/components/ui/CustomMarkdown';
import type { PagePartsFragment } from '@/tina/types';
import { tinaField } from 'tinacms/dist/react';

export default function PageHeader({ page }: { page: PagePartsFragment }) {
  return (
    <header className='grid-layout'>
      <div className='grid-item-left mb-v-spacer-120'>
        {page.longTitle && (
          <h2 className='h1 mb-spacer-32' data-tina-field={tinaField(page, 'longTitle')}>
            {page.longTitle}
          </h2>
        )}
        {page.lead && (
          <div data-tina-field={tinaField(page, 'lead')}>
            <CustomMarkdown content={page.lead} />
          </div>
        )}
      </div>
    </header>
  );
}
