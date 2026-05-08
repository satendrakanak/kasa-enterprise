import type { NextConfig } from "next";
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
const nextConfig: NextConfig = {
  /* config options here */
  async redirects() {
    return [
      {
        source: "/admin",
        destination: "/admin/dashboard",
        permanent: false,
      },
    ];
  },
  async rewrites() {
    if (!API_BASE_URL) {
      throw new Error("NEXT_PUBLIC_API_BASE_URL is not defined");
    }

    return [
      {
        source: "/api/:path*",
        destination: `${API_BASE_URL}/:path*`,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dcd1d10dzk5nh.cloudfront.net",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "platform-lookaside.fbsbx.com",
        pathname: "/**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
