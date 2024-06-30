import HomeContent from '@/components/content/HomeContent';
import PostList from '@/components/content/PostList';
import TextContent from '@/components/content/TextContent';
import ContentLeftColumn from '@/components/layout/ContentLeftColumn';
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
      {page.longTitle && <PageHeader page={page} />}
      <div className='mb-v-spacer-120 flex h-full flex-col gap-spacer-80'>
        {page.blocks?.map((block, i) => {
          switch (block?.__typename) {
            case 'PageBlocksTextContent': {
              return (
                <section className='grid-layout' key={i}>
                  <ContentLeftColumn title={page.title} tinaFieldObject={page} />
                  <div className='grid-item-right'>
                    <TextContent content={{ ...block }} />
                  </div>
                </section>
              );
            }
            case 'PageBlocksHomeContent':
              return <HomeContent content={{ ...block }} key={i} />;

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
