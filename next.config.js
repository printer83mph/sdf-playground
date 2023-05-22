/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.module.rules.push({
      test: /\.(frag|vert)$/,
      type: 'asset/source',
    })
    return config
  },
}

module.exports = nextConfig
