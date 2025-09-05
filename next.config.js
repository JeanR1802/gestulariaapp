/** @type {import('next').NextConfig} */
const nextConfig = {
  // CORRECCIÓN: 'experimental.serverComponentsExternalPackages' se ha renombrado a 'serverExternalPackages'
  serverExternalPackages: ['bcryptjs'],
  
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