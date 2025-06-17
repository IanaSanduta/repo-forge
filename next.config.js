/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Configure for GitHub Pages
  basePath: process.env.NODE_ENV === 'production' ? '/repo-forge' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/repo-forge/' : '',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'avatars.githubusercontent.com',
        port: '',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;
