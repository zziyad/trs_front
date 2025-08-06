import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    '10.101.46.112',
    '::1'
  ]
};

export default nextConfig;
