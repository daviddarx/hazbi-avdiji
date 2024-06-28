import CustomMarkdown from '@/components/ui/CustomMarkdown';
import { PageBlocksHomeContent } from '@/tina/types';
import { tinaField } from 'tinacms/dist/react';

export default function TextContent({ content }: { content: PageBlocksHomeContent }) {
  return (
    <section className='grid-layout min-h-full'>
      <div className='grid-item-right'>
        <h1 className='mb-spacer-32 text-pretty' data-tina-field={tinaField(content, 'title')}>
          {content.title}
        </h1>
        <div className='ml-1/4' data-tina-field={tinaField(content, 'introduction')}>
          <CustomMarkdown content={content.introduction} />
        </div>
      </div>
    </section>
  );
}
