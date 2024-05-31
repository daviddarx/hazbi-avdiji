import Metas from '@/components/layout/Metas';
import PageWrapper from '@/components/layout/PageWrapper';
import t from '@/content/translations';

export default function Custom404() {
  return (
    <PageWrapper>
      <Metas title={t.errorPage.title} />
      <h1>{t.errorPage.title}</h1>
    </PageWrapper>
  );
}
