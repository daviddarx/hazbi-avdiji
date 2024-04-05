import CustomMarkdown from '@/components/ui/CustomMarkdown';
import { PageBlocksTextContent, PostBlocksTextContent } from '@/tina/types';
import classNames from 'classnames';
import { tinaField } from 'tinacms/dist/react';

export default function TextContent(props: PageBlocksTextContent | PostBlocksTextContent) {
  return (
    <section className='layout-grid'>
      <div className='text-container col-start-4 col-end-10'>
        {props.content && (
          <div data-tina-field={tinaField(props, 'content')}>
            <CustomMarkdown content={props.content} />
          </div>
        )}
      </div>
    </section>
  );
}
