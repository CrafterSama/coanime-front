module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'coanime.s3.us-east-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 's3.us-east-2.amazonaws.com',
      },
      {
        protocol: 'https',
        hostname: 'www.coanime.net',
      },
      {
        protocol: 'https',
        hostname: 'api.coanime.net',
      },
      {
        protocol: 'https',
        hostname: 'images.coanime.net',
      },
      {
        protocol: 'https',
        hostname: 'coanime.net',
      },
      {
        protocol: 'https',
        hostname: 'cdn.myanimelist.net',
      },
    ],
  },
  experimental: {
    largePageDataBytes: 128 * 100000,
  },
};
