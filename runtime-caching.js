// next-pwa custom runtime caching example (optional, for advanced control)
// See: https://github.com/shadowwalker/next-pwa/blob/master/cache.js

const runtimeCaching = [
  {
    urlPattern: /^https:\/\/images\.unsplash\.com\/.*$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'unsplash-images',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      },
    },
  },
  {
    urlPattern: /^https:\/\/plus\.unsplash\.com\/.*$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'unsplash-plus-images',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 30 * 24 * 60 * 60, // 30 Days
      },
    },
  },
];

module.exports = runtimeCaching;
