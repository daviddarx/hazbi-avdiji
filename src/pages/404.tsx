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
      <div className='grid-layout'>
        <h1 className='grid-item-full'>{t.errorPage.title}</h1>
      </div>
    </PageWrapper>
  );
}

export const getStaticProps = async ({ params }: { params: { slug?: string[] } }) => {
  const navigationResult = await client.queries.navigation({ relativePath: 'navigation.md' });

  const footerNavigationResult = await client.queries.footerNavigation({
    relativePath: 'footer-navigation.md',
  });

  return {
    props: {
      navigationProps: { ...navigationResult },
      footerNavigationProps: { ...footerNavigationResult },
    },
    revalidate: 10,
  };
};
