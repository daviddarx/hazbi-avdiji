import Metas from '@/components/layout/Metas';
import PageWrapper from '@/components/layout/PageWrapper';
import useTranslations from '@/hooks/useTranslations';
import client from '@/tina/client';
import { FooteNavigationResult } from '@/types/';
import { getLocale } from '@/utils/locale';

export default function Custom404({
  footerNavigationProps,
}: {
  footerNavigationProps: FooteNavigationResult;
}) {
  const t = useTranslations();

  return (
    <PageWrapper footerNavigationProps={footerNavigationProps}>
      <Metas title={t.errorPage.title} />
      <div className='grid-layout'>
        <h1 className='grid-item-full'>{t.errorPage.title}</h1>
      </div>
    </PageWrapper>
  );
}

export const getStaticProps = async ({ locale: rawLocale }: { locale: string }) => {
  const locale = getLocale(rawLocale);
  const navigationResult = await client.queries.navigation({
    relativePath: `${locale}/navigation.md`,
  });
  const footerNavigationResult = await client.queries.footerNavigation({
    relativePath: `${locale}/footer-navigation.md`,
  });

  return {
    props: {
      navigationProps: { ...navigationResult },
      footerNavigationProps: { ...footerNavigationResult },
    },
    revalidate: 10,
  };
};
