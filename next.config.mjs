/** @type {import('next').NextConfig} */
const nextConfig = {
  // Silence the Turbopack/webpack config conflict warning
  turbopack: {},
  webpack: (config) => {
    // Ignore missing optional @x402 dependencies from @coinbase/cdp-sdk
    config.externals.push("pino-pretty", "encoding");
    config.resolve.alias = {
      ...config.resolve.alias,
      "@x402/core/client": false,
      "@x402/evm": false,
      "@x402/evm/exact/client": false,
      "@x402/evm/upto/client": false,
      "@x402/svm/exact/client": false,
    };
    return config;
  },
};

export default nextConfig;
