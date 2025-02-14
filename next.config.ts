import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [ 'example.com', // Example of a domain
      'i.pinimg.com', // Pinterest
      'images.unsplash.com', // Unsplash
      'cdn.example.com', // Another example
      'mycdn.com', // Custom CDN
      'assets.example.com', 
      'images.pexels.com',
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    },
  },
  webpack: (config) => {
    config.externals = [...config.externals, { "socket.io-client": "socket.io-client" }];
    return config;
  },
};

export default nextConfig;
