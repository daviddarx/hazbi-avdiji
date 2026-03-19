import PageWrapper from '@/components/layout/PageWrapper';
import Post from '@/components/pages/Post';
import client from '@/tina/client';
import { CategoryConnectionEdges, PostConnectionEdges, Post as PostType } from '@/tina/types';
import { FooteNavigationResult, PostResult } from '@/types';
import {
  POSTS_CATEGORY_SEARCH_PARAMS,
  POSTS_LIST_VIEW_SEARCH_PARAMS,
  POSTS_LIST_VIEW_SEARCH_PARAMS_VALUE,
} from '@/utils/core';
import { getLocale } from '@/utils/locale';
import { formatPostTitle, sortPostsToCategories } from '@/utils/tina';

export default function BlogPage({
  footerNavigationProps,
  postProps,
  postListLink,
  prevPost,
  nextPost,
}: {
  footerNavigationProps: FooteNavigationResult;
  postProps: PostResult;
  postListLink: string;
  prevPost: PostType;
  nextPost: PostType;
}) {
  return (
    <PageWrapper footerNavigationProps={footerNavigationProps}>
      <Post
        postProps={postProps}
        postListLink={postListLink}
        prevPost={prevPost}
        nextPost={nextPost}
      />
    </PageWrapper>
  );
}

export const getStaticProps = async ({
  params,
  locale: rawLocale,
}: {
  params: { slug: string };
  locale: string;
}) => {
  const locale = getLocale(rawLocale);

  const navigationResult = await client.queries.navigation({
    relativePath: `${locale}/navigation.md`,
  });
  const footerNavigationResult = await client.queries.footerNavigation({
    relativePath: `${locale}/footer-navigation.md`,
  });

  let postResult: PostResult;

  try {
    postResult = await client.queries.post({ relativePath: `${locale}/${params.slug}.mdx` });
  } catch (error) {
    return {
      notFound: true,
    };
  }

  formatPostTitle(postResult.data.post as PostType);

  const postListLink = `${navigationResult.data.navigation.links?.find((item) => item?.isPostPage)
    ?.link}?${POSTS_LIST_VIEW_SEARCH_PARAMS}=${POSTS_LIST_VIEW_SEARCH_PARAMS_VALUE}&${POSTS_CATEGORY_SEARCH_PARAMS}=${
    postResult.data.post.category._sys.filename
  }`;

  const categoryConnectionResult = await client.queries.categoryConnection({
    sort: 'priority',
  });

  const postsResult = await client.queries.postConnection({
    filter: { published: { eq: true } },
    sort: 'createdAt',
    last: 100,
  });

  const allPosts = postsResult.data.postConnection.edges!;
  const localePosts = allPosts.filter((edge) => {
    const postPath = edge?.node?._sys.path || '';
    const pathParts = postPath.split('/');
    return pathParts[pathParts.indexOf('posts') + 1] === locale;
  });

  const allCategories = categoryConnectionResult.data.categoryConnection.edges!;
  const localeCategories = allCategories.filter((edge) => {
    const catPath = edge?.node?._sys.path || '';
    const pathParts = catPath.split('/');
    return pathParts[pathParts.indexOf('categories') + 1] === locale;
  });

  let prevPost: PostType = {} as PostType;
  let nextPost: PostType = {} as PostType;

  sortPostsToCategories(
    localePosts as PostConnectionEdges[],
    localeCategories as CategoryConnectionEdges[],
  );

  localePosts.find((edge, i) => {
    const currentPost = edge?.node?._sys.filename === postResult.data.post._sys.filename;

    if (currentPost) {
      prevPost = localePosts[i > 0 ? i - 1 : localePosts.length - 1]?.node as PostType;
      formatPostTitle(prevPost);
      nextPost = localePosts[i < localePosts.length - 1 ? i + 1 : 0]?.node as PostType;
      formatPostTitle(nextPost);
    }

    return currentPost;
  });

  let translationProps: { slug: string; locale: string; isPost: boolean } | null = null;

  if (postResult.data.post.translationOf) {
    const refPath = postResult.data.post.translationOf._sys?.path || '';
    const refParts = refPath.split('/');
    const refLocale = refParts[refParts.indexOf('posts') + 1];
    const refSlug = postResult.data.post.translationOf._sys?.filename;
    if (refLocale && refSlug) {
      translationProps = { slug: refSlug, locale: refLocale, isPost: true };
    }
  }

  return {
    props: {
      navigationProps: navigationResult,
      footerNavigationProps: { ...footerNavigationResult },
      postProps: postResult,
      postListLink,
      prevPost,
      nextPost,
      translationProps,
      locale,
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  const result = await client.queries.postConnection();

  const paths = result.data.postConnection
    .edges!.map((edge) => {
      const filePath = edge!.node!._sys.path;
      const pathParts = filePath.split('/');
      const locale = pathParts[pathParts.indexOf('posts') + 1];
      if (locale !== 'fr' && locale !== 'en') return null;
      return { params: { slug: edge!.node!._sys.filename }, locale };
    })
    .filter(Boolean);

  return {
    paths,
    fallback: 'blocking',
  };
};
