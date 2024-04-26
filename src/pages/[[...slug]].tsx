import PageWrapper from '@/components/layout/PageWrapper';
import Page from '@/components/pages/Page';
import client from '@/tina/client';
import { CategoryFilter } from '@/tina/types';
import { PageResult, PostsFilter, PostsResult } from '@/types/';
import t from '@/utils/translations';

export default function PageComponent({
  pageProps,
  postsProps,
  filterProps,
}: {
  pageProps: PageResult;
  postsProps?: PostsResult;
  filterProps?: PostsFilter[];
}) {
  return (
    <PageWrapper>
      <Page pageProps={pageProps} postsProps={postsProps} filterProps={filterProps} />
    </PageWrapper>
  );
}

export const getStaticProps = async ({ params }: { params: { slug?: string[] } }) => {
  const navigationResult = await client.queries.navigation({ relativePath: 'navigation.md' });

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
    const categoryParams = params.slug![1];
    const categoryConnectionResult = await client.queries.categoryConnection({
      sort: 'priority',
    });

    postsFilters = [
      {
        label: t.allPosts,
        link: `/${pageMdPath}`,
        category: '',
      },
    ];

    postsFilters = postsFilters.concat(
      categoryConnectionResult.data.categoryConnection.edges!.map((edge) => {
        const node = edge!.node!;
        return {
          label: node.title,
          link: `/${params.slug![0]}?categorie=${node._sys.filename}`,
          category: node._sys.filename,
        };
      }),
    );

    postsResult = await client.queries.postConnection({
      filter: { published: { eq: true } },
      sort: 'createdAt',
      last: 100,
    });
  }

  return {
    props: {
      navigationProps: { ...navigationResult },
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
