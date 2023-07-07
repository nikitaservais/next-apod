/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  reactStrictMode: true,
  images: {
    domains: ['apod.nasa.gov'],
  },
  env: {
    APOD_API_KEY: process.env.APOD_API_KEY,
  },
}

module.exports = nextConfig
