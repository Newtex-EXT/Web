/** @type {import('next').NextConfig} */
const nextConfig = {
  // Soluciona el error de Parameters<Fetch>
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream', 'undici'],

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            // 'self' permite tu web, los otros permiten Supabase e iconos de Google
            value: "default-src 'self'; " +
                   "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
                   "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
                   "font-src 'self' data: https://fonts.gstatic.com; " +
                   "img-src 'self' data: https:; " +
                   "connect-src 'self' https://hrmrzpkcwmfawjrkabsu.supabase.co https://*.supabase.co;"
          },
        ],
      },
    ];
  },
};

export default nextConfig;