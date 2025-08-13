import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    turbo: {},
  },
  // Allow loading local JSON content files from /content
  // Serve /content as static files via publicFiles in dev; in prod, Next will bundle it
};

export default nextConfig;
