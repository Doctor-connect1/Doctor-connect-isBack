import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'example.com', // Example of a domain
      'i.pinimg.com', // Pinterest
      'images.unsplash.com', // Unsplash
      'cdn.example.com', // Another example
      'mycdn.com', // Custom CDN
      'assets.example.com',
      'images.pexels.com',
      'picsum.photos', // Allowing picsum.photos for doctor images
      'via.placeholder.com', // Allowing placeholder.com for fallback images
      'th.bing.com',
    ],
  },
};

export default nextConfig;
