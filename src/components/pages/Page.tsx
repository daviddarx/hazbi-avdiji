import FeatureList from '@/components/content/FeatureList';
import Hero from '@/components/content/Hero';
import PostList from '@/components/content/PostList';
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
        <h1
          className='subtitle col-start-4 col-end-10 mb-spacer-20'
          data-tina-field={tinaField(page, 'title')}
        >
          {page.title}
        </h1>
      </div>

      <div className='mb-spacer-120 flex flex-col gap-spacer-80'>
        {page.blocks?.map((block, i) => {
          switch (block?.__typename) {
            case 'PageBlocksHero': {
              return <Hero {...block} key={i} />;
            }
            case 'PageBlocksFeatureList': {
              return <FeatureList {...block} key={i} />;
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
