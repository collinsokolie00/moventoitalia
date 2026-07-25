import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "172.21.159.185",
  ],
};

export default nextConfig;