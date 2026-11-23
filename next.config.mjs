const basePath = (process.env.NEXT_PUBLIC_BASE_PATH ?? "").replace(/\/$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",        // fully static HTML: fastest, crawlable, host anywhere
  trailingSlash: true,     // /ar/transport/ -> out/ar/transport/index.html
  images: { unoptimized: true },
  reactStrictMode: true,
  basePath,                // "/astool-fly" on GitHub Pages; "" for a custom domain
  outputFileTracingRoot: process.cwd(),
};
export default nextConfig;
