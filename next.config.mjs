/** @type {import('next').NextConfig} */
const nextConfig = {
  serverExternalPackages: ['pino', 'pino-pretty', 'thread-stream', 'undici'],

  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' data: https://fonts.gstatic.com; img-src 'self' data: https://www.newtex.es https://api.newtex.es https://grainy-gradients.vercel.app; connect-src 'self' https://api.newtex.es https://*.supabase.co; object-src 'none'; base-uri 'self'; form-action 'self'; frame-ancestors 'self';"
          },
        ],
      },
    ];
  },
};

export default nextConfig;