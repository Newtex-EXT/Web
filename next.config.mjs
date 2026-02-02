/** @type {import('next').NextConfig} */
const nextConfig = {
  // Se ha movido aquí en las versiones más recientes
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
};

export default nextConfig;
