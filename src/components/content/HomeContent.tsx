import CustomMarkdown from '@/components/ui/CustomMarkdown';
import { PageBlocksHomeContent } from '@/tina/types';
import { tinaField } from 'tinacms/dist/react';

export default function HomeContent({ content }: { content: PageBlocksHomeContent }) {
  return (
    <section className='grid-layout lg:mb-v-spacer-120 2xl:mb-0'>
      <div className='grid-item-right relative z-10'>
        <h1 className='mb-spacer-32 text-pretty' data-tina-field={tinaField(content, 'title')}>
          {content.title}
        </h1>
        <div className='sm:ml-1/4' data-tina-field={tinaField(content, 'introduction')}>
          <CustomMarkdown content={content.introduction} />
        </div>
      </div>
    </section>
  );
}
