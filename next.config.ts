import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/blog",
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    unoptimized: true,
    maximumDiskCacheSize: 256 * 1024 * 1024,
  },
  trailingSlash: true,
  experimental: {
    turbo: {
      resolveAlias: {
        "@": "./src",
      },
    },
  },
  // Note: headers() only works on server-side hosts (Vercel, Netlify, etc.)
  // GitHub Pages is static and ignores this.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
