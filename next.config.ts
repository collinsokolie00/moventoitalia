import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  devIndicators: false,

  serverExternalPackages: [
    "firebase-admin",
    "jwks-rsa",
  ],

  allowedDevOrigins: [
    "127.0.0.1",
    "localhost",
    "10.208.67.145",
    "172.21.159.185",
  ],
};

export default nextConfig;
