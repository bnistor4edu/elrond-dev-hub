/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'peerme-mainnet.s3.eu-central-1.amazonaws.com',
      'peerme-testnet.s3.eu-central-1.amazonaws.com', // Adding testnet domain as well for future use
      'tools.multiversx.com', // Adding MultiversX tools domain for token icons
      'assets.elrond.com', // Elrond assets domain for token icons
      'drrvwekofcaixwojhpoq.supabase.co', // Supabase storage domain for resource images
      'pbs.twimg.com', // Twitter profile images
      'media.elrond.com', // MultiversX media CDN for NFTs and assets
    ],
  },
}

module.exports = nextConfig
