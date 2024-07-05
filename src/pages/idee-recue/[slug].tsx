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

export const getStaticProps = async ({ params }: { params: { slug: string } }) => {
  const navigationResult = await client.queries.navigation({ relativePath: 'navigation.md' });
  const footerNavigationResult = await client.queries.footerNavigation({
    relativePath: 'footer-navigation.md',
  });

  let postResult: PostResult;

  try {
    postResult = await client.queries.post({ relativePath: `${params.slug}.mdx` });
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

  const posts = postsResult.data.postConnection.edges!;
  const categories = categoryConnectionResult.data.categoryConnection.edges!;
  let prevPost: PostType = {} as PostType;
  let nextPost: PostType = {} as PostType;

  sortPostsToCategories(posts as PostConnectionEdges[], categories as CategoryConnectionEdges[]);

  posts.find((edge, i) => {
    const currentPost = edge?.node?._sys.filename === postResult.data.post._sys.filename;

    if (currentPost) {
      prevPost = posts[i > 0 ? i - 1 : posts.length - 1]?.node as PostType;
      formatPostTitle(prevPost);
      nextPost = posts[i < posts.length - 1 ? i + 1 : 0]?.node as PostType;
      formatPostTitle(nextPost);
    }

    return currentPost;
  });

  return {
    props: {
      navigationProps: navigationResult,
      footerNavigationProps: { ...footerNavigationResult },
      postProps: postResult,
      postListLink,
      prevPost,
      nextPost,
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  const result = await client.queries.postConnection();

  const paths = result.data.postConnection.edges!.map((edge) => {
    return { params: { slug: edge!.node!._sys.filename } };
  });

  return {
    paths: paths,
    fallback: 'blocking',
  };
};
