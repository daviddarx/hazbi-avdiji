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
  postResults: (amount: Number) => (amount === 1 ? 'Idée reçue' : 'Idées reçues'),
  postReadMore: 'A lire aussi',
  errorPage: {
    title: "Cette page n'existe pas",
  },
  textContentMediaCloseLabel: {
    image: "Fermer l'image",
    video: 'Fermer la vidéo',
  },
  darkModeSwitcher: {
    title: 'Apparence',
    options: {
      light: 'Clair',
      dark: 'Sombre',
      system: 'Auto',
    },
  },
};

export default t;
