const translations = {
  metaData: {
    title: (pageTitle?: string) =>
      `${pageTitle ? `${pageTitle} – ` : ''}Boilerplate NextJS & TinaCMS`,
    description: 'Boilerplate for Next.js website with TinaCMS',
    url: 'https://boilerplate-nextjs-page-tinacms.vercel.app',
  },
  errorPage: {
    title: "This page doesn't exist",
  },
};

export default translations;
