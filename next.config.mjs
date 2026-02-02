/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    // Esto evita que Turbopack intente procesar los archivos internos de pino
    serverComponentsExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
  },
};

export default nextConfig;
