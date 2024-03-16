/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/admin',
        destination: '/admin/index.html',
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
  async redirects() {
    return [
      {
        source: '/',
        destination: '/posts',
        permanent: false,
      },
    ];
  },
};

module.exports = nextConfig;
