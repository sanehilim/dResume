import type { NextConfig } from "next";
import path from "node:path";

const loaderPath = require.resolve('orchids-visual-edits/loader.js');

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      },
    ],
  },
  // Removed custom outputFileTracingRoot to avoid duplicated path issues on Vercel
  // (caused errors like '/vercel/path0/vercel/path0/.next/...').
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'pino-pretty': false,
        'porto/internal': false,
        // Prevent bundling React Native async-storage in browser build by aliasing to a shim
      };
    }
    // Alias react-native async-storage to a small shim to avoid module not found during build
    if (!config.resolve) config.resolve = {};
    if (!config.resolve.alias) config.resolve.alias = {};
    config.resolve.alias['@react-native-async-storage/async-storage'] = path.resolve(__dirname, 'src/shims/async-storage.js');

    // Prevent server bundling of browser-only MetaMask SDK which references `location` global
    if (isServer) {
      config.resolve.alias['@metamask/sdk'] = false;
      // Also alias the distributed browser entry path that some bundles import directly
      config.resolve.alias['@metamask/sdk/dist/browser/es/metamask-sdk.js'] = false;
    }

    config.externals.push('pino-pretty', 'porto/internal');
    return config;
  },
  turbopack: {
    rules: {
      "*.{jsx,tsx}": {
        loaders: [loaderPath]
      }
    }
  }
} as NextConfig;

export default nextConfig;