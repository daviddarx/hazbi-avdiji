import useTranslations from '@/hooks/useTranslations';
import { getLocale } from '@/utils/locale';
import Head from 'next/head';
import { useRouter } from 'next/router';

interface Props {
  title?: string;
  translationPath?: string;
}

const BASE_URL = 'https://avdiji.com';

const Metas = ({ title, translationPath }: Props) => {
  const t = useTranslations();
  const { locale, asPath } = useRouter();
  const currentLocale = getLocale(locale);
  const alternateLocale = currentLocale === 'fr' ? 'en' : 'fr';
  const combinedTitle = t.metaData.title(title);
  const description = t.metaData.description;
  const localePath = currentLocale === 'fr' ? '' : `/${currentLocale}`;
  const canonicalUrl = `${BASE_URL}${localePath}${asPath === '/' ? '' : asPath}`;

  return (
    <Head>
      <title>{combinedTitle}</title>
      <meta name='description' content={description} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={canonicalUrl} />
      <meta property='og:title' content={combinedTitle} />
      <meta property='og:image:url' content='/hazbi-avdiji.jpg' />
      <meta property='og:image:secure_url' content='/hazbi-avdiji.jpg' />
      <meta property='og:image:type' content='image/jpeg' />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta name='format-detection' content='telephone=no' />
      <link rel='manifest' href='/manifest.webmanifest' />
      <link rel='canonical' href={canonicalUrl} />
      <link rel='alternate' hrefLang={currentLocale} href={canonicalUrl} />
      {translationPath && (
        <link rel='alternate' hrefLang={alternateLocale} href={`${BASE_URL}${translationPath}`} />
      )}
    </Head>
  );
};

export default Metas;
