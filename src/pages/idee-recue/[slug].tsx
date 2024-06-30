import PageWrapper from '@/components/layout/PageWrapper';
import Post from '@/components/pages/Post';
import client from '@/tina/client';
import { FooteNavigationResult, PostResult } from '@/types';
import {
  POSTS_CATEGORY_SEARCH_PARAMS,
  POSTS_LIST_VIEW_SEARCH_PARAMS,
  POSTS_LIST_VIEW_SEARCH_PARAMS_VALUE,
  formatPostTitle,
} from '@/utils/core';

export default function BlogPage({
  footerNavigationProps,
  postProps,
  postListLink,
}: {
  footerNavigationProps: FooteNavigationResult;
  postProps: PostResult;
  postListLink: string;
}) {
  return (
    <PageWrapper footerNavigationProps={footerNavigationProps}>
      <Post postProps={postProps} postListLink={postListLink} />
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

  postResult.data.post.title = formatPostTitle(postResult.data.post.title);

  const postListLink = `${navigationResult.data.navigation.links?.find((item) => item?.isPostPage)
    ?.link}?${POSTS_LIST_VIEW_SEARCH_PARAMS}=${POSTS_LIST_VIEW_SEARCH_PARAMS_VALUE}&${POSTS_CATEGORY_SEARCH_PARAMS}=${
    postResult.data.post.category._sys.filename
  }`;

  return {
    props: {
      navigationProps: navigationResult,
      footerNavigationProps: { ...footerNavigationResult },
      postProps: postResult,
      postListLink: postListLink,
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
