import PostCard from '@/components/content/PostCard';
import ActivePillNavigation from '@/components/ui/ActivePillNavigation';
import t from '@/content/translations';
import useStuck from '@/hooks/useStuck';
import { uiActions } from '@/store';
import { PageBlocksPostList, type Post as PostType } from '@/tina/types';
import { PostsFilter, PostsResult } from '@/types';
import { POSTS_CATEGORY_ALL_VALUE, POSTS_CATEGORY_SEARCH_PARAMS } from '@/utils/core';
import ease from '@/utils/eases';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTina } from 'tinacms/dist/react';

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
  const container = useRef<HTMLDivElement | null>(null);
  const [height, setHeight] = useState<string | number>('auto');

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

  const hideTopBar = () => {
    dispatch(uiActions.setHiddenTopBar(true));
  };

  const showTopBar = useCallback(() => {
    dispatch(uiActions.setHiddenTopBar(false));
  }, [dispatch]);

  const filterElement = useStuck<HTMLDivElement>({
    onStuck: hideTopBar,
    onUnStuck: showTopBar,
  });

  const updateContainerHeight = () => {
    setHeight(container.current ? container.current.offsetHeight : 'auto');
  };

  const handleResize = useCallback(() => {
    updateContainerHeight();
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const category = queryParams.get(POSTS_CATEGORY_SEARCH_PARAMS);
    filterlist(category || POSTS_CATEGORY_ALL_VALUE);

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      showTopBar();
    };
  }, [filterlist, handleResize, showTopBar]);

  return (
    <section>
      {posts && posts?.length > 0 && props.filterProps && (
        <React.Fragment>
          <div className='grid-layout'>
            <div className='grid-item-full top-gutter z-70 lg:sticky' ref={filterElement}>
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
          </div>
          <div className='grid-layout grid-layout--extended'>
            <div
              className='grid-item-full mt-gutter transition-[height] duration-1000'
              style={{ height }}
            >
              <AnimatePresence mode='wait' initial={false}>
                <motion.div
                  key={Math.random() * Math.random()}
                  initial='initial'
                  animate='animate'
                  exit='exit'
                  onAnimationStart={updateContainerHeight}
                  variants={motionVariants}
                >
                  <div ref={container}>
                    <div className='subtitle grid-item-full mb-gutter text-center'>
                      {filteredPosts!.length} {t.postResults(filteredPosts!.length)}
                    </div>
                    <ul className='grid gap-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-4'>
                      {filteredPosts!.map((edge) => {
                        const post = edge?.node as PostType;

                        if (!post) {
                          return null;
                        }

                        return (
                          <li key={post._sys.filename}>
                            <PostCard post={post} />
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </React.Fragment>
      )}
    </section>
  );
}
