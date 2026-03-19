import PostCard from '@/components/content/PostCard';
import TextContent from '@/components/content/TextContent';
import ContentLeftColumn from '@/components/layout/ContentLeftColumn';
import Metas from '@/components/layout/Metas';
import PostHeader from '@/components/layout/PostHeader';
import useTranslations from '@/hooks/useTranslations';
import type { Post } from '@/tina/types';
import { PostResult } from '@/types/';
import { postRoutes } from '@/utils/tina';
import { useTina } from 'tinacms/dist/react';

export default function Post({
  postProps,
  postListLink,
  prevPost,
  nextPost,
  translationProps,
}: {
  postProps: PostResult;
  postListLink: string;
  prevPost: Post | undefined;
  nextPost: Post | undefined;
  translationProps?: { slug: string; locale: string; isPost?: boolean } | null;
}) {
  const t = useTranslations();
  const data = useTina(postProps);
  const { post } = data.data;

  const translationPath = translationProps
    ? `/${translationProps.locale}${postRoutes[translationProps.locale]}/${translationProps.slug}`
    : undefined;

  return (
    <article>
      <Metas title={post.title} translationPath={translationPath} />
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
      <nav className='grid-layout my-v-spacer-120'>
        <div className='grid-item-center'>
          <h2 className='post-read-more-title'>
            <span>{t.postReadMore}</span>
          </h2>
        </div>
        <div className='grid-item-full mt-spacer-80 grid gap-8 md:grid-cols-2 lg:gap-4'>
          {prevPost && <PostCard post={prevPost} direction='left' />}
          {nextPost && <PostCard post={nextPost} direction='right' />}
        </div>
      </nav>
    </article>
  );
}
