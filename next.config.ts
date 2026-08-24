import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // Dish photography is served from Sanity's image CDN once the Studio is
    // populated; the local masters under /public need no entry here.
    remotePatterns: [{ protocol: "https", hostname: "cdn.sanity.io" }],
  },
};

export default nextConfig;
