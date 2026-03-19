/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['fr', 'en'],
    defaultLocale: 'fr',
    localeDetection: false,
  },
  async rewrites() {
    return [
      {
        source: '/misconception/:slug',
        destination: '/idee-recue/:slug',
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'assets.tina.io',
      },
    ],
  },
};

module.exports = nextConfig;
