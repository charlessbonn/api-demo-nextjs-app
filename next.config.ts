import type { NextConfig } from "next";
import { MyConfig } from "./lib/utils/config";

const nextConfig: NextConfig = {
  /* config options here */
  async headers() {
    return [
      {
        // matching all API routes
        source: "/api/:path*",
        headers: [
          { key: "Access-Control-Allow-Credentials", value: "true" },
          { key: "Access-Control-Allow-Origin", value: MyConfig.devMode ? (MyConfig.devWebUrl ?? "http://localhost:3000") : (MyConfig.prodWebUrl ?? "http://localhost:3000") },
          { key: "Access-Control-Allow-Methods", value: "GET,OPTIONS,PATCH,DELETE,POST,PUT" },
          { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
        ],
      }
    ]
  },
  images: {
    domains: ['chuacharlesbon.github.io'], // Add the external image domain here
  },
};

export default nextConfig;
