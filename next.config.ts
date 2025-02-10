import { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // ✅ Ignore TypeScript build errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors during build
  },
  reactStrictMode: true,       // 🔒 Enable React strict mode
  experimental: {
    optimizeCss: true,         // 🎯 Optimize CSS
  },
  images: {
    unoptimized: !isProd,      // 🖼️ Optimize images in production only
  },
};

export default nextConfig;
