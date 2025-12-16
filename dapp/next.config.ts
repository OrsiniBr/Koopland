import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove experimental.turbo - it's causing issues
  experimental: {
    // Remove 'turbo' key
  },

  // Add webpack config to exclude test files
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Exclude problematic node_modules from client bundle
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }

    // Exclude test files from bundle
    config.module.rules.push({
      test: /node_modules\/thread-stream\/(test|bench)/,
      use: "null-loader",
    });

    return config;
  },

  // Exclude problematic packages from server components
  // serverComponentsExternalPackages: ["pino", "pino-pretty", "thread-stream"],
};

export default nextConfig;
