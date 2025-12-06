import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable static export for Electron
  output: 'export',
  
  // Make asset paths relative for Electron file:// protocol
  assetPrefix: './',
  
  // Disable image optimization (not supported in static export)
  images: {
    unoptimized: true,
  },
  
  // Ensure trailing slashes for static file serving
  trailingSlash: true,
  
  // Allow build to complete even with TypeScript errors (optional)
  typescript: {
    ignoreBuildErrors: false,
  },
};

export default nextConfig;
