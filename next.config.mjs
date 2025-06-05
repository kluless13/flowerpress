/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: [
      'images.unsplash.com', 
      'picsum.photos', 
      'source.unsplash.com',
      'firebasestorage.googleapis.com',
      'liyatree-bc82d.firebasestorage.app'
    ],
  },
}

export default nextConfig
