import ActivePillNavigation from '@/components/ui/ActivePillNavigation';
import PageLink from '@/components/ui/PageLink';
import { uiActions } from '@/store';
import { PageBlocksPostList } from '@/tina/types';
import { PostsFilter, PostsResult } from '@/types';
import { POSTS_CATEGORY_ALL_VALUE, POSTS_CATEGORY_SEARCH_PARAMS } from '@/utils/core';
import ease from '@/utils/eases';
import { postRoute } from '@/utils/tina';
import t from '@/utils/translations';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { tinaField, useTina } from 'tinacms/dist/react';

const motionVariants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: ease.outQuart,
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.15,
      ease: ease.outQuart,
    },
  },
};

export default function PostList(props: {
  blockProps: PageBlocksPostList;
  postsProps: PostsResult;
  filterProps: PostsFilter[];
}) {
  const { data } = useTina(props.postsProps);
  const posts = data.postConnection.edges;
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [currentCategory, setCurrentCategory] = useState(POSTS_CATEGORY_ALL_VALUE);
  const dispatch = useDispatch();

  const filterlist = useCallback(
    (category: string) => {
      const queryParams = new URLSearchParams(window.location.search);
      queryParams.set(POSTS_CATEGORY_SEARCH_PARAMS, category);

      const newUrl = category
        ? `${window.location.pathname}?${queryParams.toString()}`
        : window.location.pathname;

      // https://github.com/vercel/next.js/discussions/18072#discussioncomment-109059
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);

      const updatedFilteredPosts = posts!.filter((post) => {
        return category === POSTS_CATEGORY_ALL_VALUE || !category
          ? true
          : post?.node?.category._sys.filename === category;
      });

      setFilteredPosts(updatedFilteredPosts);
      setCurrentCategory(category);
    },
    [posts, setFilteredPosts],
  );

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const category = queryParams.get(POSTS_CATEGORY_SEARCH_PARAMS);
    filterlist(category || POSTS_CATEGORY_ALL_VALUE);
  }, [filterlist]);

  return (
    <section>
      {posts && posts?.length > 0 && props.filterProps && (
        <div className='layout-grid mt-gutter'>
          <div className='col-start-4 col-end-10'>
            <ActivePillNavigation title={'Navigation'} currentActiveValue={currentCategory}>
              {props.filterProps.map((filter) => (
                <button
                  key={filter.link}
                  onClick={() => {
                    filterlist(filter.category);
                    dispatch(uiActions.changeCurrentColors(Math.random()));
                  }}
                  data-active-value={filter.category}
                >
                  {filter.label}
                </button>
              ))}
            </ActivePillNavigation>
          </div>

          <AnimatePresence mode='wait' initial={false}>
            <motion.div
              key={Math.random() * Math.random()}
              className='col-start-2 col-end-12 mt-gutter'
              initial='initial'
              animate='animate'
              exit='exit'
              variants={motionVariants}
            >
              <div className='col-start-2 col-end-12 mb-gutter text-base'>
                {filteredPosts!.length} {t.postResults(filteredPosts!.length)}
              </div>
              <ul className='grid grid-cols-3 gap-4'>
                {filteredPosts!.map((edge) => {
                  const post = edge?.node;

                  if (!post) {
                    return null;
                  }

                  return (
                    <li key={post._sys.filename}>
                      <PageLink
                        href={`${postRoute}/${post._sys.filename}`}
                        className='border-semi-transparent flex h-full flex-col justify-between gap-gutter rounded-cards p-gutter transition-colors hover:border-black hover:bg-theme-prev'
                      >
                        <h3 className='' data-tina-field={tinaField(post, 'title')}>
                          {post.title}
                        </h3>
                        <div className='sr-only flex gap-16'>
                          <span className='font-bold'>{post.category.title}</span>
                        </div>
                      </PageLink>
                    </li>
                  );
                })}
              </ul>
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </section>
  );
}
