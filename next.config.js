/** @type {import('next').NextConfig} */
const nextConfig = {
  i18n: {
    locales: ['default', 'fr', 'en'],
    defaultLocale: 'default',
    localeDetection: false,
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/fr/',
        permanent: true,
        locale: false,
      },
      {
        source:
          '/:path((?!fr|en|admin|_next|api|uploads|favicon\\.ico|robots\\.txt|sitemap\\.xml|manifest\\.webmanifest|hazbi-avdiji\\.jpg).*)',
        destination: '/fr/:path',
        permanent: true,
        locale: false,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
        locale: false,
      },
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
