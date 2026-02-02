/** @type {import('next').NextConfig} */
const nextConfig = {
    //Añado serverExternalPackages para que las librerias externas no fallen al compilar en vercel
    serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream'],
};

export default nextConfig;