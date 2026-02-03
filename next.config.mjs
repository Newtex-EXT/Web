/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream', 'undici'],

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: 
              "default-src 'self'; " +
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://vercel.live https://*.vercel.live; " +
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
              "font-src 'self' data: https://fonts.gstatic.com; " +
              "img-src 'self' data: https:; " +
              // Aseguramos que connect-src permita a Vercel y a Supabase
              "connect-src 'self' https://hrmrzpkcwmfawjrkabsu.supabase.co https://*.supabase.co https://vercel.live https://*.vercel.live; " +
              "frame-src 'self' https://vercel.live https://*.vercel.live;"
          },
        ],
      },
    ];
  },
};

export default nextConfig;