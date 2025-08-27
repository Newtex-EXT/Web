import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "700"]
});


export const metadata = {
  title: "NEXA S.L",
  description: "Soluciones de automatización y digitalización",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body
        className={`${montserrat.variable}  antialiased `}
      >
        {children}
      </body>
    </html>
  );
}
