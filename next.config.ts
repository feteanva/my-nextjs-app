import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Clean configuration - using custom API route instead of rewrites
  experimental: {
    viewTransition: true,
  },
};

export default nextConfig;
