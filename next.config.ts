// next.config.js
const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Pin the workspace root so Next never infers it from a stray parent
  // lockfile (e.g. ~/package-lock.json). A wrong root makes the production
  // server resolve .next manifests from the wrong place, which surfaces as
  // "Cannot read properties of undefined (reading 'map')" on startup.
  turbopack: {
    root: __dirname,
  },
  // output: 'standalone',
  productionBrowserSourceMaps: false,
  outputFileTracingRoot: path.join(__dirname),
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
};
// push main

module.exports = nextConfig;