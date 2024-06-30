import TextContent from '@/components/content/TextContent';
import ContentLeftColumn from '@/components/layout/ContentLeftColumn';
import Metas from '@/components/layout/Metas';
import PostHeader from '@/components/layout/PostHeader';
import t from '@/content/translations';
import { PostResult } from '@/types/';
import { useTina } from 'tinacms/dist/react';

export default function Post({
  postProps,
  postListLink,
}: {
  postProps: PostResult;
  postListLink: string;
}) {
  const data = useTina(postProps);
  const { post } = data.data;

  return (
    <article>
      <Metas title={post.title} />
      <PostHeader post={post} postListLink={postListLink} />
      <div className='mb-v-spacer-120 flex flex-col gap-spacer-80'>
        {post.blocks?.map((block, i) => {
          switch (block?.__typename) {
            case 'PostBlocksTextContent': {
              return (
                <section className='grid-layout' key={i}>
                  <ContentLeftColumn
                    title={t.post}
                    tinaFieldObject={post}
                    postCategoryName={post.category.title}
                    postCategoryLink={postListLink}
                  />
                  <div className='grid-item-right'>
                    <TextContent content={{ ...block }} />
                  </div>
                </section>
              );
            }
          }
        })}
      </div>
    </article>
  );
}
