/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  async rewrites() {
    return {
      beforeFiles: [
        // These rewrites are checked after headers/redirects
        // and before all files including _next/public files which
        // allows overriding page files
        {
          source: '/diskuze/:slug/preview',
          destination: '/articles/:slug/preview',
        },
        { source: '/diskuze/:slug', destination: '/articles/:slug' },
        { source: '/diskuze', destination: '/articles' },
        { source: '/o-nas', destination: '/about-us' },
        { source: '/politici/:id', destination: '/speakers/:id' },
        { source: '/sliby/:slug', destination: '/promises/:slug' },
        { source: '/spoluprace-s-facebookem', destination: '/tags/facebook' },
        { source: '/tag/:slug', destination: '/tags/:slug' },
        { source: '/vyhledavani', destination: '/search' },
        {
          source: '/vyhledavani/politici',
          destination: '/search/search-speakers',
        },
        {
          source: '/vyhledavani/vyroky',
          destination: '/search/search-statements',
        },
        {
          source: '/vyhledavani/vystupy',
          destination: '/search/search-articles',
        },
        { source: '/vypis-recniku', destination: '/speakers' },
        {
          source: '/vyrok/:slug/redesign',
          destination: '/statements/:slug/redesign',
        },
        { source: '/vyrok/:slug', destination: '/statements/:slug' },
        { source: '/vyroky', destination: '/statements' },
        { source: '/workshopy', destination: '/workshops' },
        { source: '/zasady-zpracovani-osobnich-udaju', destination: '/terms' },
      ],
      afterFiles: [],
      fallback: [
        // These rewrites are checked after both pages/public files
        // and dynamic routes are checked
        {
          source: '/:path*',
          destination: `${process.env.NEXT_PUBLIC_MEDIA_URL}/:path*`,
        },
      ],
    }
  },

  async redirects() {
    const constantRedirects = [
      {
        source: '/stranka/workshopy-demagogcz',
        destination: '/workshopy',
        permanent: true,
      },
      {
        source: '/beta/admin',
        destination: '/beta/admin/sources',
        permanent: true,
      },
    ]

    if (process.env.SERVE_CAMPAIGN_WEBSITE_FROM_RAILS) {
      return [
        ...constantRedirects,
        {
          source: '/kampan',
          destination: 'https://demagog.cz/kampan',
          permanent: true,
        },
      ]
    }

    return constantRedirects
  },

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
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
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/rails/active_storage/**',
      },
      {
        protocol: 'https',
        hostname: 'demagog.cz',
        port: '',
        pathname: '/rails/active_storage/**',
      },
      {
        protocol: 'https',
        hostname: 'api.demagog.cz',
        port: '',
        pathname: '/rails/active_storage/**',
      },
    ],
  },
}

module.exports = nextConfig

// Injected content via Sentry wizard below

const { withSentryConfig } = require('@sentry/nextjs')

module.exports = withSentryConfig(module.exports, {
  // For all available options, see:
  // https://github.com/getsentry/sentry-webpack-plugin#options

  org: 'demagog',
  project: 'demagog-nextjs',

  // Only print logs for uploading source maps in CI
  silent: !process.env.CI,

  // For all available options, see:
  // https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/

  // Upload a larger set of source maps for prettier stack traces (increases build time)
  widenClientFileUpload: true,

  // Automatically annotate React components to show their full name in breadcrumbs and session replay
  reactComponentAnnotation: {
    enabled: true,
  },

  // Route browser requests to Sentry through a Next.js rewrite to circumvent ad-blockers.
  // This can increase your server load as well as your hosting bill.
  // Note: Check that the configured route will not match with your Next.js middleware, otherwise reporting of client-
  // side errors will fail.
  tunnelRoute: '/monitoring',

  // Hides source maps from generated client bundles
  hideSourceMaps: true,

  // Automatically tree-shake Sentry logger statements to reduce bundle size
  disableLogger: true,

  // Enables automatic instrumentation of Vercel Cron Monitors. (Does not yet work with App Router route handlers.)
  // See the following for more information:
  // https://docs.sentry.io/product/crons/
  // https://vercel.com/docs/cron-jobs
  automaticVercelMonitors: true,
})
