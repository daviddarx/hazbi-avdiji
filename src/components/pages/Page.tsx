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
      <div className='layout-grid'>
        <div className='col-start-4 col-end-10 flex flex-col gap-16'>
          <span className='subtitle' data-tina-field={tinaField(page, 'title')}>
            {page.title}
          </span>
          {page.longTitle && (
            <h1 data-tina-field={tinaField(page, 'longTitle')}>{page.longTitle}</h1>
          )}
          {page.lead && <p>{page.lead}</p>}
        </div>
      </div>

      <div className='mb-spacer-120 flex flex-col gap-spacer-80'>
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
