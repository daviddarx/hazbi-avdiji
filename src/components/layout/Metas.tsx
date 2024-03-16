import translations from '@/content/translations';
import Head from 'next/head';

interface Props {
  title?: string;
}

const Metas = ({ title }: Props) => {
  const combinedTitle = translations.metaData.title(title);
  const description = translations.metaData.description;

  return (
    <Head>
      <title>{combinedTitle}</title>
      <meta name='description' content={description} />
      <meta property='og:description' content={description} />
      <meta property='og:url' content={translations.metaData.url} />
      <meta property='og:title' content={combinedTitle} />
      <meta property='og:image:url' content='/website-poster.jpg' />
      <meta property='og:image:secure_url' content='/website-poster.jpg' />
      <meta property='og:image:type' content='image/jpeg' />
      <meta property='og:image:width' content='1200' />
      <meta property='og:image:height' content='630' />
      <meta name='format-detection' content='telephone=no' />
      <link rel='manifest' href='/manifest.webmanifest' />
    </Head>
  );
};

export default Metas;
