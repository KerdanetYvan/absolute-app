const withPWA = require('@ducanh2912/next-pwa').default;
const runtimeCaching = require('./runtime-caching');

const nextConfig = {
  images: {
    domains: [
      'images.unsplash.com',
      'plus.unsplash.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
        port: '',
        pathname: '/',
      }
    ],
    unoptimized: true // Pour les images locales
  },
  pwa: {
    dest: 'public',
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === 'development',
    runtimeCaching,
    buildExcludes: [/middleware-manifest\.json$/],
    fallbacks: {
      // If a page or route is not available offline, fallback to this page
      // This must match the path of your offline page
      document: '/offline',
      // Optionally, you can add image or font fallbacks here
    },
  }
};

module.exports = withPWA(nextConfig);