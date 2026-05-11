import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    unoptimized: true,
    maximumDiskCacheSize: 256 * 1024 * 1024,
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
