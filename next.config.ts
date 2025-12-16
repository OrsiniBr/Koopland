import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@rainbow-me/rainbowkit",
    "@wagmi/core",
    "@wagmi/connectors",
    "@walletconnect/ethereum-provider",
    "@walletconnect/universal-provider",
  ],


};

export default nextConfig;
