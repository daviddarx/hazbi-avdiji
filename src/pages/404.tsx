import Metas from '@/components/layout/Metas';
import PageWrapper from '@/components/layout/PageWrapper';
import t from '@/content/translations';
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
