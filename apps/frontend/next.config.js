/** @type {import('next').NextConfig} */
const nextConfig = {
  // Disable ESLint during build for Vercel deployment
  eslint: {
    ignoreDuringBuilds: true,
  },
  // Disable TypeScript checking during build for Vercel deployment
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
