const t = {
  logoTitle: 'Dr. Hazbi Avdiji',
  logoSubline: 'Votre généraliste en diversité et inclusion',
  metaData: {
    title: (pageTitle?: string) =>
      `${
        pageTitle ? `${pageTitle} – ` : ''
      }Hazbi Avdiji – Votre généraliste en diversité et inclusion (D&I)`,
    description:
      'Accompagnement et conseil pour initiatives D&I en Suisse romande, déconstruction des idées reçues sur la D&I.',
    url: 'https://avdiji.com/',
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
  mobileNavigation: {
    title: 'Navigation',
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
