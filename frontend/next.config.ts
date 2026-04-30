import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: ["100.67.246.96", "192.168.29.76"],
  turbopack: {
    root: "/home/human/indian-trading-agent/frontend",
  },
};

export default nextConfig;
