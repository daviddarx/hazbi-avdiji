import CustomMarkdown from '@/components/ui/CustomMarkdown';
import PageLink from '@/components/ui/PageLink';
import { PageBlocksPostList } from '@/tina/types';
import { PostsFilter, PostsResult } from '@/types';
import { formatDate } from '@/utils/core';
import ease from '@/utils/eases';
import { postRoute } from '@/utils/tina';
import { motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { tinaField, useTina } from 'tinacms/dist/react';

export default function PostList(props: {
  blockProps: PageBlocksPostList;
  postsProps: PostsResult;
  filterProps: PostsFilter[];
}) {
  const { data } = useTina(props.postsProps);
  const posts = data.postConnection.edges;
  const path = usePathname();

  return (
    <section>
      <div className='layout-grid'>
        <div className='text-container col-start-4 col-end-10'>
          {!props.blockProps.hideTitle && (
            <h2 data-tina-field={tinaField(props.blockProps, 'title')}>{props.blockProps.title}</h2>
          )}
          {props.blockProps.description && (
            <div data-tina-field={tinaField(props.blockProps, 'description')}>
              <CustomMarkdown content={props.blockProps.description} />
            </div>
          )}
        </div>
      </div>

      {posts && posts?.length > 0 && props.filterProps && (
        <div className='layout-grid mt-gutter'>
          <div className='col-start-4 col-end-10'>
            <ul className='nav nav-list inline-flex'>
              {props.filterProps.map((filter, i) => {
                return (
                  <li key={i} className='relative'>
                    <PageLink
                      href={filter.url}
                      className={'nav-link relative z-10'}
                      scrollToTop={false}
                    >
                      {filter.label}
                    </PageLink>

                    {path.split('/')[2] === filter!.url.split('/')[2] && (
                      <motion.span
                        layoutId='activeFilter'
                        className='nav-active z-0'
                        transition={{
                          duration: 0.5,
                          ease: ease.inOutQuart,
                        }}
                      />
                    )}
                  </li>
                );
              })}
            </ul>
          </div>

          <ul className='col-start-2 col-end-12 mt-gutter grid grid-cols-3 gap-4'>
            {posts.map((edge) => {
              const post = edge?.node;

              if (!post) {
                return null;
              }

              return (
                <li key={post._sys.filename}>
                  <PageLink
                    href={`${postRoute}/${post._sys.filename}`}
                    className='flex h-full flex-col justify-between gap-gutter rounded-3xl border border-black/20 p-gutter transition-colors hover:border-black hover:bg-theme-prev'
                  >
                    <h3 className='' data-tina-field={tinaField(post, 'title')}>
                      {post.title}
                    </h3>
                    <div className='flex gap-16'>
                      <span className='font-bold'>{post.category.title}</span> –
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                  </PageLink>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
