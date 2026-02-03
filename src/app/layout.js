import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat", // Añadimos esto para que Tailwind lo reconozca bien
});

export const metadata = {
  title: "NEWTEX",
  description: "Soluciones de automatización y digitalización",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* Link para los iconos */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        
        {/* POLÍTICA DE SEGURIDAD ACTUALIZADA */}
        <meta 
          httpEquiv="Content-Security-Policy" 
          content="default-src 'self'; 
                   script-src 'self' 'unsafe-eval' 'unsafe-inline'; 
                   style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; 
                   font-src 'self' data: https://fonts.gstatic.com; 
                   img-src 'self' data: https:; 
                   connect-src 'self' https://hrmrzpkcwmfawjrkabsu.supabase.co https://*.supabase.co;" 
        />
      </head>
      <body className={`${montserrat.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}