/* eslint-disable unicorn/prefer-module */

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(frag|vert)$/,
      use: 'raw-loader',
    })
    return config
  },
}

module.exports = nextConfig
