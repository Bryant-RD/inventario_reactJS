import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    experimental: {
    testProxy: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://84.247.191.214:4000/:path*",
      },
    ];
  },
};

export default nextConfig;
