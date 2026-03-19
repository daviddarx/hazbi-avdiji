export type Locale = 'fr' | 'en';

export type Translations = {
  logoTitle: string;
  logoSubline: string;
  metaData: {
    title: (pageTitle?: string) => string;
    description: string;
    url: string;
  };
  allPosts: string;
  post: string;
  postResults: (amount: Number) => string;
  postReadMore: string;
  errorPage: {
    title: string;
  };
  textContentMediaCloseLabel: {
    image: string;
    video: string;
  };
  mobileNavigation: {
    title: string;
  };
  darkModeSwitcher: {
    title: string;
    options: {
      light: string;
      dark: string;
    };
  };
  languageSwitcher: {
    title: string;
    options: {
      fr: string;
      en: string;
    };
  };
};

const t: Record<Locale, Translations> = {
  fr: {
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
      },
    },
    languageSwitcher: {
      title: 'Langue',
      options: {
        fr: 'Français',
        en: 'English',
      },
    },
  },
  en: {
    logoTitle: 'Dr. Hazbi Avdiji',
    logoSubline: 'Your generalist in diversity and inclusion',
    metaData: {
      title: (pageTitle?: string) =>
        `${
          pageTitle ? `${pageTitle} – ` : ''
        }Hazbi Avdiji – Your generalist in diversity and inclusion (D&I)`,
      description:
        'Consulting and support for D&I initiatives in French-speaking Switzerland, deconstructing misconceptions about D&I.',
      url: 'https://avdiji.com/',
    },
    allPosts: 'All',
    post: 'Misconception',
    postResults: (amount: Number) => (amount === 1 ? 'Misconception' : 'Misconceptions'),
    postReadMore: 'Read also',
    errorPage: {
      title: 'This page does not exist',
    },
    textContentMediaCloseLabel: {
      image: 'Close image',
      video: 'Close video',
    },
    mobileNavigation: {
      title: 'Navigation',
    },
    darkModeSwitcher: {
      title: 'Appearance',
      options: {
        light: 'Light',
        dark: 'Dark',
      },
    },
    languageSwitcher: {
      title: 'Language',
      options: {
        fr: 'Français',
        en: 'English',
      },
    },
  },
};

export default t;
