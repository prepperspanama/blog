import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    maximumDiskCacheSize: 256 * 1024 * 1024,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
