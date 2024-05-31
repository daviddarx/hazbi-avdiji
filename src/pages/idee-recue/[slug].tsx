import PageWrapper from '@/components/layout/PageWrapper';
import Post from '@/components/pages/Post';
import t from '@/content/translations';
import client from '@/tina/client';
import { PostResult } from '@/types';

export default function BlogPage({
  postProps,
  postListLink,
}: {
  postProps: PostResult;
  postListLink: string;
}) {
  return (
    <PageWrapper>
      <Post postProps={postProps} postListLink={postListLink} />
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

  const postListLink = `${navigationResult.data.navigation.links?.find((item) => item?.isPostPage)
    ?.link}?${t.postCategorySlug}=${postResult.data.post.category._sys.filename}`;

  return {
    props: {
      navigationProps: navigationResult,
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
