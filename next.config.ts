import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // mengizinkan url gambar dari pihak eksternal
    unoptimized: true,
  },
};

export default nextConfig;
