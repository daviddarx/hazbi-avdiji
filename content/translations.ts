const t = {
  metaData: {
    title: (pageTitle?: string) =>
      `${pageTitle ? `${pageTitle} – ` : ''}Boilerplate NextJS & TinaCMS`,
    description: 'Boilerplate for Next.js website with TinaCMS',
    url: 'https://boilerplate-nextjs-page-tinacms.vercel.app',
  },
  allPosts: 'Tout',
  post: 'Idée reçue',
  postResults: (amount: Number) => (amount === 1 ? 'Idée reçue' : 'Idées reçues'),
  errorPage: {
    title: "This page doesn't exist",
  },
};

export default t;
