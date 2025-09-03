/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['bcryptjs']
  },
  async rewrites() {
    return [
      {
        source: '/site/:slug*',
        destination: '/api/site/:slug*',
      },
    ]
  }
}

module.exports = nextConfig