import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@rainbow-me/rainbowkit",
    "@wagmi/core",
    "@wagmi/connectors",
    "@walletconnect/ethereum-provider",
    "@walletconnect/universal-provider",
  ],

  webpack: (config) => {
    // Prevent Node-only modules from being bundled on the client
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      worker_threads: false,
    };
    return config;
  },
};

export default nextConfig;
