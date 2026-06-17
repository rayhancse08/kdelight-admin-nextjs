/** @type {import("next").NextConfig} */
const backend = (process.env.NEXT_PUBLIC_API_URL ?? "https://kdelight.info").replace(/\/$/, "");

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/django/:path*",
        destination: `${backend}/api/:path*/`,
      },
    ];
  },
  images: {
    qualities: [100, 75],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "kdelight.info",
        port: "",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "pub-b7fd9c30cdbf439183b75041f5f71b92.r2.dev",
        port: "",
      },
    ],
  },
};

export default nextConfig;
