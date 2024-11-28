/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // Allows all domains (bad idea will fix it later)
      },
    ],
  },
  reactStrictMode: false,
};

export default nextConfig;
