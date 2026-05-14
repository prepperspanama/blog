import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    unoptimized: true,
    maximumDiskCacheSize: 256 * 1024 * 1024,
  },
  trailingSlash: true,
  experimental: {
    sri: {
      algorithm: 'sha384',
    },
    serverActions: {
      bodySizeLimit: '1mb',
    },
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
