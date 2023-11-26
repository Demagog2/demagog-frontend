/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },

  eslint: {
    // TODO: linting temporarily disabled
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
