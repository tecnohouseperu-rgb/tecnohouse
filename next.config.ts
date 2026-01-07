// next.config.ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      // ✅ Cloudflare R2 con custom domain
      {
        protocol: "https",
        hostname: "cdn.tecnohouseperu.com",
        pathname: "/**",
      },

      // (Opcional) mantener Supabase mientras migras todo
      {
        protocol: "https",
        hostname: "nelyvuxwskmqwtcmystn.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },

      // (Opcional) si aún tienes algunas URLs r2.dev guardadas
      {
        protocol: "https",
        hostname: "pub-060e2f29cf544718ba7c53345f2ab55a.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
