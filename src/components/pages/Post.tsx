import TextContent from '@/components/content/TextContent';
import Metas from '@/components/layout/Metas';
import PostHeader from '@/components/layout/PostHeader';
import PageLink from '@/components/ui/PageLink';
import t from '@/content/translations';
import { PostResult } from '@/types/';
import { tinaField, useTina } from 'tinacms/dist/react';

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
                  <div className='grid-item-right-leftover pr-32 max-lg:hidden'>
                    <div className='border-light mt-12 border-t pt-32'>
                      <PageLink
                        href={postListLink}
                        className='button tag'
                        data-tina-field={tinaField(post, 'category')}
                      >
                        {post.category.title}
                      </PageLink>
                    </div>
                  </div>
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
