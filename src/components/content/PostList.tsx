import PostCard from '@/components/content/PostCard';
import ActivePillNavigation from '@/components/ui/ActivePillNavigation';
import t from '@/content/translations';
import useStuck from '@/hooks/useStuck';
import { uiActions } from '@/store';
import { PageBlocksPostList, type Post as PostType } from '@/tina/types';
import { PostsFilter, PostsResult } from '@/types';
import {
  POSTS_CATEGORY_ALL_VALUE,
  POSTS_CATEGORY_SEARCH_PARAMS,
  POSTS_LIST_VIEW_SEARCH_PARAMS,
  POSTS_LIST_VIEW_SEARCH_PARAMS_VALUE,
} from '@/utils/core';
import { reducedMotion } from '@/utils/core';
import { cubicBezier, ease } from '@/utils/eases';
import smoothScrollTo, { getScrollMarginTop, getScrollTop } from '@/utils/smooth-scroll';
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

const containerHeightAnimationDuration = 700;

export default function PostList(props: {
  blockProps: PageBlocksPostList;
  postsProps: PostsResult;
  filterProps: PostsFilter[];
}) {
  const { data } = useTina(props.postsProps);
  const posts = data.postConnection.edges;
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const defaultCategory = props.filterProps[0].category;
  const [currentCategory, setCurrentCategory] = useState(defaultCategory);
  const dispatch = useDispatch();
  const container = useRef<HTMLElement | null>(null);
  const postContainer = useRef<HTMLDivElement | null>(null);
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

  const updatePostsContainerHeight = () => {
    setHeight(postContainer.current ? postContainer.current.offsetHeight : 'auto');
  };

  const handleResize = useCallback(() => {
    updatePostsContainerHeight();
  }, []);

  const getContainerPosY = () => {
    return container.current
      ? getScrollTop(container.current, getScrollMarginTop(container.current) - 2) // -2 to be sure the onStuck in triggered to hide the main navigation.
      : 0;
  };

  const scrollToFiltersWhileFiltering = () => {
    if (container.current && !reducedMotion()) {
      const containerPosY = getContainerPosY();

      if (window.scrollY > containerPosY) {
        smoothScrollTo(window, containerPosY, 500, 'scrollTop', cubicBezier(ease.inOutSine));
      } else {
        setTimeout(() => {
          smoothScrollTo(window, containerPosY, 500, 'scrollTop', cubicBezier(ease.inOutSine));
        }, containerHeightAnimationDuration);
      }
    }
  };

  const scrollToFilterOnMount = useCallback(() => {
    if (container.current) {
      const containerPosY = getContainerPosY();

      setTimeout(() => {
        smoothScrollTo(window, containerPosY, 0, 'scrollTop', cubicBezier(ease.inOutQuart));
      }, 100);
    }
  }, []);

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const category = queryParams.get(POSTS_CATEGORY_SEARCH_PARAMS);
    const listView = queryParams.get(POSTS_LIST_VIEW_SEARCH_PARAMS);

    filterlist(category || defaultCategory);

    if (listView === POSTS_LIST_VIEW_SEARCH_PARAMS_VALUE) {
      scrollToFilterOnMount();
    }

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      showTopBar();
    };
  }, [filterlist, defaultCategory, handleResize, showTopBar, scrollToFilterOnMount]);

  return (
    <section ref={container} className='scroll-mt-gutter '>
      {posts && posts?.length > 0 && props.filterProps && (
        <React.Fragment>
          <div className='grid-layout top-gutter z-70 lg:sticky' ref={filterElement}>
            <ActivePillNavigation
              title={'Navigation'}
              currentActiveValue={currentCategory}
              className='grid-item-full'
            >
              {props.filterProps.map((filter) => (
                <button
                  key={filter.link}
                  onClick={() => {
                    filterlist(filter.category);
                    scrollToFiltersWhileFiltering();
                    dispatch(uiActions.changeCurrentColors(Math.random()));
                  }}
                  data-active-value={filter.category}
                >
                  {filter.label}
                </button>
              ))}
            </ActivePillNavigation>
          </div>
          <div
            className='grid-layout grid-layout--extended mt-spacer-48 transition-[height]'
            style={{ height, transitionDuration: `${containerHeightAnimationDuration}ms` }}
          >
            <AnimatePresence mode='wait' initial={false}>
              <motion.div
                key={Math.random() * Math.random()}
                initial='initial'
                animate='animate'
                exit='exit'
                onAnimationStart={updatePostsContainerHeight}
                variants={
                  typeof window === 'undefined' || !reducedMotion() ? motionVariants : undefined
                }
                className='grid-item-full'
              >
                <div ref={postContainer}>
                  <div className='subtitle grid-item-full mb-spacer-48 text-center'>
                    {filteredPosts!.length} {t.postResults(filteredPosts!.length)}
                  </div>
                  <ul className='grid gap-8 md:grid-cols-2 lg:gap-4 xl:grid-cols-3'>
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
        </React.Fragment>
      )}
    </section>
  );
}
