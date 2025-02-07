import { NextConfig } from 'next';

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,  // ✅ Ignore TypeScript build errors
  },
  eslint: {
    ignoreDuringBuilds: true, // ✅ Ignore ESLint errors during build
  },
};

export default nextConfig;
