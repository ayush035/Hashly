/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence the Turbopack/webpack config conflict warning
  turbopack: {},

  // Mark Node-only packages as server-external so they aren't bundled by Webpack
  serverExternalPackages: ["@coinbase/cdp-sdk"],

  webpack: (config, { isServer }) => {
    // Ignore missing optional @x402 / @solana dependencies from @coinbase/cdp-sdk
    config.externals.push("pino-pretty", "encoding");

    // Stub out all @x402/* and @solana/kit imports that cdp-sdk tries to resolve
    config.resolve.alias = {
      ...config.resolve.alias,
      "@x402/core/client": false,
      "@x402/evm": false,
      "@x402/evm/exact/client": false,
      "@x402/evm/upto/client": false,
      "@x402/svm/exact/client": false,
      "@solana/kit": false,
    };

    // Suppress critical dependency warnings from dynamic imports in cdp-sdk
    config.module = {
      ...config.module,
      exprContextCritical: false,
    };

    return config;
  },
};

export default nextConfig;
