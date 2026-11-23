/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",        // fully static HTML: fastest, crawlable, host anywhere
  trailingSlash: true,     // /ar/transport/ -> out/ar/transport/index.html
  images: { unoptimized: true },
  reactStrictMode: true,
};
export default nextConfig;
