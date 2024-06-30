import PageWrapper from '@/components/layout/PageWrapper';
import Page from '@/components/pages/Page';
import t from '@/content/translations';
import client from '@/tina/client';
import { FooteNavigationResult, PageResult, PostsFilter, PostsResult } from '@/types/';
import {
  POSTS_CATEGORY_ALL_VALUE,
  POSTS_CATEGORY_SEARCH_PARAMS,
  formatPostTitle,
} from '@/utils/core';

export default function PageComponent({
  footerNavigationProps,
  pageProps,
  postsProps,
  filterProps,
}: {
  footerNavigationProps: FooteNavigationResult;
  pageProps: PageResult;
  postsProps?: PostsResult;
  filterProps?: PostsFilter[];
}) {
  return (
    <PageWrapper footerNavigationProps={footerNavigationProps}>
      <Page pageProps={pageProps} postsProps={postsProps} filterProps={filterProps} />
    </PageWrapper>
  );
}

export const getStaticProps = async ({ params }: { params: { slug?: string[] } }) => {
  const navigationResult = await client.queries.navigation({ relativePath: 'navigation.md' });
  const footerNavigationResult = await client.queries.footerNavigation({
    relativePath: 'footer-navigation.md',
  });

  let pageResult: PageResult;
  let hasPostListBlock: boolean | undefined;
  let pageMdPath = params.slug ? params.slug[0] : 'home';
  let postsResult: PostsResult | null = null;
  let postsFilters: PostsFilter[] | null = null;

  if (pageMdPath === '_next') {
    return {
      notFound: true,
    }; /* debug dev mode error */
  }

  try {
    pageResult = await client.queries.page({
      relativePath: `${pageMdPath}.mdx`,
    });
    hasPostListBlock = pageResult.data.page.blocks?.some(
      (block) => block?.__typename === 'PageBlocksPostList',
    );
  } catch (error) {
    return {
      notFound: true,
    };
  }

  if (hasPostListBlock) {
    const categoryConnectionResult = await client.queries.categoryConnection({
      sort: 'priority',
    });

    postsFilters = [];
    postsFilters = postsFilters.concat(
      categoryConnectionResult.data.categoryConnection.edges!.map((edge) => {
        const node = edge!.node!;
        return {
          label: node.title,
          link: `/${params.slug![0]}?${POSTS_CATEGORY_SEARCH_PARAMS}=${node._sys.filename}`,
          category: node._sys.filename,
        };
      }),
    );
    postsFilters.push({
      label: t.allPosts,
      link: `/${pageMdPath}?${POSTS_CATEGORY_SEARCH_PARAMS}=${POSTS_CATEGORY_ALL_VALUE}`,
      category: POSTS_CATEGORY_ALL_VALUE,
    });

    postsResult = await client.queries.postConnection({
      filter: { published: { eq: true } },
      sort: 'createdAt',
      last: 100,
    });

    postsResult.data.postConnection.edges?.forEach((post) => {
      if (post?.node?.title) {
        post.node.title = formatPostTitle(post.node.title);
      }
    });
  }

  return {
    props: {
      navigationProps: { ...navigationResult },
      footerNavigationProps: { ...footerNavigationResult },
      pageProps: { ...pageResult },
      postsProps: { ...postsResult },
      filterProps: postsFilters,
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async () => {
  const pageConnectionResult = await client.queries.pageConnection();

  const paths = [{ params: { slug: [''] } }];

  await Promise.all(
    pageConnectionResult.data.pageConnection.edges!.map(async (edge) => {
      const fileName = edge!.node!._sys.filename;

      paths.push({ params: { slug: [fileName] } });

      const pageResult = await client.queries.page({
        relativePath: `${fileName}.mdx`,
      });
    }),
  );

  return {
    paths: paths,
    fallback: 'blocking',
  };
};
