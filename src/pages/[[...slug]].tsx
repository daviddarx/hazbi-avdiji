import PageWrapper from '@/components/layout/PageWrapper';
import Page from '@/components/pages/Page';
import t, { type Locale } from '@/content/translations';
import client from '@/tina/client';
import { CategoryConnectionEdges, Post, PostConnectionEdges } from '@/tina/types';
import { FooteNavigationResult, PageResult, PostsFilter, PostsResult } from '@/types/';
import { POSTS_CATEGORY_ALL_VALUE, POSTS_CATEGORY_SEARCH_PARAMS } from '@/utils/core';
import { getLocale } from '@/utils/locale';
import { formatPostTitle, sortPostsToCategories } from '@/utils/tina';

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

export const getStaticProps = async ({
  params,
  locale: rawLocale,
}: {
  params: { slug?: string[] };
  locale: string;
}) => {
  const locale = getLocale(rawLocale);

  const navigationResult = await client.queries.navigation({
    relativePath: `${locale}/navigation.md`,
  });
  const footerNavigationResult = await client.queries.footerNavigation({
    relativePath: `${locale}/footer-navigation.md`,
  });

  let pageResult: PageResult;
  let hasPostListBlock: boolean | undefined;
  let pageMdPath = params.slug ? params.slug[0] : 'home';
  let postsResult: PostsResult | null = null;
  let postsFilters: PostsFilter[] | null = null;
  let translationProps: { slug: string; locale: string } | null = null;

  if (pageMdPath === '_next') {
    return {
      notFound: true,
    }; /* debug dev mode error */
  }

  try {
    pageResult = await client.queries.page({
      relativePath: `${locale}/${pageMdPath}.mdx`,
    });
    hasPostListBlock = pageResult.data.page.blocks?.some(
      (block) => block?.__typename === 'PageBlocksPostList',
    );
  } catch (error) {
    return {
      notFound: true,
    };
  }

  if (pageResult.data.page.translationOf) {
    const refPath = pageResult.data.page.translationOf._sys?.path || '';
    const refParts = refPath.split('/');
    const refLocale = refParts[refParts.indexOf('pages') + 1];
    const refSlug = pageResult.data.page.translationOf._sys?.filename;
    if (refLocale && refSlug) {
      translationProps = {
        slug: refSlug === 'home' ? '' : refSlug,
        locale: refLocale,
      };
    }
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
      label: t[locale as Locale].allPosts,
      link: `/${pageMdPath}?${POSTS_CATEGORY_SEARCH_PARAMS}=${POSTS_CATEGORY_ALL_VALUE}`,
      category: POSTS_CATEGORY_ALL_VALUE,
    });

    postsResult = await client.queries.postConnection({
      filter: { published: { eq: true } },
      sort: 'createdAt',
      last: 100,
    });

    const posts = postsResult.data.postConnection.edges;
    const categories = categoryConnectionResult.data.categoryConnection.edges;

    if (posts && categories) {
      posts.forEach((post) => {
        if (post?.node?.title) {
          formatPostTitle(post.node as Post);
        }
      });

      sortPostsToCategories(
        posts as PostConnectionEdges[],
        categories as CategoryConnectionEdges[],
      );
    }
  }

  return {
    props: {
      navigationProps: { ...navigationResult },
      footerNavigationProps: { ...footerNavigationResult },
      pageProps: { ...pageResult },
      postsProps: { ...postsResult },
      filterProps: postsFilters,
      translationProps,
    },
    revalidate: 10,
  };
};

export const getStaticPaths = async ({ locales }: { locales: string[] }) => {
  const pageConnectionResult = await client.queries.pageConnection();
  const paths: Array<{ params: { slug: string[] }; locale: string }> = [];

  pageConnectionResult.data.pageConnection.edges!.map((edge) => {
    const fileName = edge!.node!._sys.filename;
    const filePath = edge!.node!._sys.path;
    const pathParts = filePath.split('/');
    const locale = pathParts[pathParts.indexOf('pages') + 1];

    // Skip files not in a recognized locale folder
    if (locale !== 'fr' && locale !== 'en') return;

    if (fileName === 'home') {
      paths.push({ params: { slug: [''] }, locale });
    } else {
      paths.push({ params: { slug: [fileName] }, locale });
    }
  });

  return {
    paths,
    fallback: 'blocking',
  };
};
