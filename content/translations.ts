const t = {
  logoTitle: 'Dr. Hazbi Avdiji',
  logoSubline: 'Votre généraliste en diversité et inclusion',
  metaData: {
    title: (pageTitle?: string) =>
      `${pageTitle ? `${pageTitle} – ` : ''}Boilerplate NextJS & TinaCMS`,
    description: 'Boilerplate for Next.js website with TinaCMS',
    url: 'https://boilerplate-nextjs-page-tinacms.vercel.app',
  },
  allPosts: 'Tout',
  post: 'Idée reçue',
  postCategorySlug: 'categorie',
  postResults: (amount: Number) => (amount === 1 ? 'Idée reçue' : 'Idées reçues'),
  errorPage: {
    title: "This page doesn't exist",
  },
  darkModeSwitcher: {
    title: 'Apparence',
    options: {
      light: 'Clair',
      dark: 'Sombre',
      system: 'Système',
    },
  },
};

export default t;
