import PostList from '@/components/content/PostList';
import TextContent from '@/components/content/TextContent';
import Metas from '@/components/layout/Metas';
import PageHeader from '@/components/layout/PageHeader';
import { PageResult, PostsFilter, PostsResult } from '@/types';
import { useTina } from 'tinacms/dist/react';

export default function Page(props: {
  pageProps: PageResult;
  postsProps?: PostsResult;
  filterProps?: PostsFilter[];
}) {
  const pageData = useTina(props.pageProps);
  const { page } = pageData.data;

  return (
    <article>
      <Metas title={page.title} />
      <PageHeader page={page} />
      <div className='mb-v-spacer-120 flex flex-col gap-spacer-80'>
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
    </article>
  );
}
