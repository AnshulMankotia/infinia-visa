import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Pin the workspace root; a stray package-lock.json sits above this directory.
  turbopack: { root: import.meta.dirname },
  images: {
    // Country photography and flags served by the live Infinia Visa stack.
    remotePatterns: [
      {
        protocol: "https",
        hostname: "mhsaogeziwsujxvkycno.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "flagcdn.com" },
    ],
    // Next 16 ships `qualities: [75]` by default; 85 is used for the large hero art.
    qualities: [75, 85],
  },
};

export default nextConfig;
