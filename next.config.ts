import type { NextConfig } from "next";

// On GitHub Pages the site lives at /byflint-studio; locally and on a custom domain it lives at /.
const basePath = process.env.PAGES_BASE_PATH || "";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  basePath,
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
