/** @type {import('next').NextConfig} */
const nextConfig = {
  allowedDevOrigins: [
    '*.janeway.replit.dev',
    '*.replit.dev',
    '*.replit.app',
    'localhost',
  ],
  experimental: {
    serverActions: {
      allowedOrigins: ['*.replit.dev', '*.replit.app', 'localhost:5000'],
    },
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
    ],
  },
};

module.exports = nextConfig;
