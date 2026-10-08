/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Local SVG product art + optional remote photos. Remote kept off by
    // default so the emailed link never shows broken images.
    unoptimized: true
  }
};

export default nextConfig;
