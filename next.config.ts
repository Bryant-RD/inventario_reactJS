import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    eslint: {
    // ¡Advertencia! Esto permite que la compilación de producción finalice
    // incluso si tu proyecto tiene errores de ESLint.
    ignoreDuringBuilds: true,
  },
    experimental: {
    testProxy: true,
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        // Apunta a tu servidor de backend real. Cambia el puerto 8000 si es necesario.
        destination: "http://localhost:3000/:path*",
      },
    ];
  },
};

export default nextConfig;
