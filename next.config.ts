import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    const backend = process.env.MATA_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8087";
    return {
      beforeFiles: [
        { source: "/api/backend/:path*", destination: `${backend}/api/v1/:path*` },
      ],
    };
  },
};

export default nextConfig;
