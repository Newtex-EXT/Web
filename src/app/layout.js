import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});

export const metadata = {
  title: "NEWTEX",
  description: "Soluciones de automatización y digitalización",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <head>
        {/* --- INICIO DE LA CORRECCIÓN --- */}
        {/* Esta línea carga la fuente de iconos de Google para toda la aplicación */}
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
        <meta httpEquiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self';" />
        {/* --- FIN DE LA CORRECCIÓN --- */}
      </head>
      <body
        className={`${montserrat.variable} antialiased`} // He quitado un espacio extra aquí para limpiar
      >
        {children}
      </body>
    </html>
  );
}