import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    // Handle PDF.js worker and polyfills for browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false,
        fs: false,
        path: false,
      };
    }
    
    // Exclude problematic modules from server-side rendering
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'react-pdf': 'commonjs react-pdf',
        'pdfjs-dist': 'commonjs pdfjs-dist',
        'canvas': 'commonjs canvas',
      });
    }
    
    return config;
  },
};

export default nextConfig;
