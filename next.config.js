/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async redirects() {
    return process.env.SERVE_CAMPAIGN_WEBSITE_FROM_RAILS
      ? [
          {
            source: '/kampan',
            destination: 'https://demagog.cz/kampan',
            permanent: true,
          },
        ]
      : []
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    })

    return config
  },

  eslint: {
    // TODO: linting temporarily disabled
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'demagog.cz',
        port: '',
        pathname: '/rails/active_storage/**',
      },
    ],
  },
}

module.exports = nextConfig
