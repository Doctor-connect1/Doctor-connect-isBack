import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      "example.com", // Example of a domain
      "i.pinimg.com", // Pinterest
      "images.unsplash.com", // Unsplash
      "cdn.example.com", // Another example
      "mycdn.com", // Custom CDN
      "assets.example.com", 
      "images.pexels.com",
    ],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
  webpack: (config, { isServer }) => {
    // Add externals if needed
    config.externals = [...(config.externals || []), { "socket.io-client": "socket.io-client" }];

    // Add a rule for custom media files (pdf, doc, docx, mp4, mp3)
    config.module.rules.push({
      test: /\.(pdf|doc|docx|mp4|mp3)$/i,
      use: [
        {
          loader: "file-loader",
          options: {
            publicPath: "/_next/static/media/",
            outputPath: "static/media/",
            name: "[name]-[hash].[ext]",
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig;





// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   images: {
//     domains: [ 'example.com', // Example of a domain
//       'i.pinimg.com', // Pinterest
//       'images.unsplash.com', // Unsplash
//       'cdn.example.com', // Another example
//       'mycdn.com', // Custom CDN
//       'assets.example.com', 
//       'images.pexels.com',
//     ],
//   },
//   experimental: {
//     serverActions: {
//       bodySizeLimit: '2mb'
//     },
//   },
//   webpack: (config) => {
//     config.externals = [...config.externals, { "socket.io-client": "socket.io-client" }];
//     return config;
//   },

// };

// export default nextConfig;
