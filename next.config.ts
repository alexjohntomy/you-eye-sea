import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    globalNotFound: true,
  },
  cacheComponents: true,
  cacheLife: {
    semesterly: {
      stale: 60 * 60 * 24 * 30,
      revalidate: 60 * 60 * 24 * 90,
      expire: 60 * 60 * 24 * 180,
    },
  },
};

export default nextConfig;
