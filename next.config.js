/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["checkout.flutterwave.com"],
  },
  experimental: {
    esmExternals: 'loose',
    serverComponentsExternalPackages: ['@thirdweb-dev/sdk'],
  },
  env: {
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY: process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY,
  },
};

module.exports = nextConfig;
