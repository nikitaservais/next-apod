/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["apod.nasa.gov"],
  },
  env: {
    APOD_API_KEY: process.env.APOD_API_KEY,
  },
};

module.exports = nextConfig;
