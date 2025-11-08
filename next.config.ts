import type { NextConfig } from "next";

const BASE = "/sapporo-inbound-map";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: BASE,
  assetPrefix: BASE,
  turbopack: {},
};

export default nextConfig;
