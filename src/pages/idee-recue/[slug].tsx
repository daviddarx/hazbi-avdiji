import PageWrapper from '@/components/layout/PageWrapper';
import Post from '@/components/pages/Post';
import client from '@/tina/client';
import { PostResult } from '@/types';

export default function BlogPage({ postProps }: { postProps: PostResult }) {
  return (
    <PageWrapper>
      <Post {...postProps} />
    </PageWrapper>
  );
}

export const getStaticProps = async ({ params }: { params: { slug: string } }) => {
  const navigationResult = await client.queries.navigation({ relativePath: 'navigation.md' });

  let postResult: PostResult;

  try {
    postResult = await client.queries.post({ relativePath: `${params.slug}.mdx` });
  } catch (error) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      navigationProps: navigationResult,
      postProps: postResult,
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
