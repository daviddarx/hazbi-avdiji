import Metas from '@/components/layout/Metas';
import PageWrapper from '@/components/layout/PageWrapper';
import t from '@/content/translations';
import client from '@/tina/client';
import { FooteNavigationResult } from '@/types/';

export default function Custom404({
  footerNavigationProps,
}: {
  footerNavigationProps: FooteNavigationResult;
}) {
  return (
    <PageWrapper footerNavigationProps={footerNavigationProps}>
      <Metas title={t.errorPage.title} />
      <h1>{t.errorPage.title}</h1>
    </PageWrapper>
  );
}

export const getStaticProps = async ({ params }: { params: { slug?: string[] } }) => {
  const footerNavigationResult = await client.queries.footerNavigation({
    relativePath: 'footer-navigation.md',
  });

  return {
    props: {
      footerNavigationProps: { ...footerNavigationResult },
    },
    revalidate: 10,
  };
};
