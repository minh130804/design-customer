import type { NextConfig } from 'next';

const config: NextConfig = {
  reactStrictMode: true,

  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'cdn.podmarket.com', pathname: '/**' },
      { protocol: 'https', hostname: 'picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'fastly.picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'i.picsum.photos', pathname: '/**' },
      { protocol: 'https', hostname: 'images.unsplash.com', pathname: '/**' },
    ],
    formats: ['image/avif', 'image/webp'],
  },

  typedRoutes: true,

  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
};

export default config;
