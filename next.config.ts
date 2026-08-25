import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: true },
  output: 'export',
  
  experimental: {
    workerThreads: false,
    cpus: 1
  }
};

export default nextConfig;
