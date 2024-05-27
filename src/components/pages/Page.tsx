import PostList from '@/components/content/PostList';
import TextContent from '@/components/content/TextContent';
import Metas from '@/components/layout/Metas';
import { PageResult, PostsFilter, PostsResult } from '@/types';
import { useTina } from 'tinacms/dist/react';
import { tinaField } from 'tinacms/dist/react';

export default function Page(props: {
  pageProps: PageResult;
  postsProps?: PostsResult;
  filterProps?: PostsFilter[];
}) {
  const pageData = useTina(props.pageProps);
  const { page } = pageData.data;

  return (
    <div>
      <Metas title={page.title} />
      <div className='grid-layout'>
        <div className='grid-item-left mb-spacer-80 xl:mb-spacer-120'>
          <span
            className='subtitle mb-spacer-80 block xl:mb-spacer-120'
            data-tina-field={tinaField(page, 'title')}
          >
            {page.title}
          </span>
          {page.longTitle && (
            <h1 className='mb-spacer-24' data-tina-field={tinaField(page, 'longTitle')}>
              {page.longTitle}
            </h1>
          )}
          {page.lead && <p data-tina-field={tinaField(page, 'lead')}>{page.lead}</p>}
        </div>
      </div>

      <div className='mb-spacer-80 flex flex-col gap-spacer-80 xl:mb-spacer-120'>
        {page.blocks?.map((block, i) => {
          switch (block?.__typename) {
            case 'PageBlocksTextContent': {
              return <TextContent {...block} key={i} />;
            }
            case 'PageBlocksPostList': {
              return (
                <PostList
                  blockProps={{ ...block }}
                  postsProps={props.postsProps!}
                  filterProps={props.filterProps!}
                  key={i}
                />
              );
            }
          }
        })}
      </div>
    </div>
  );
}
