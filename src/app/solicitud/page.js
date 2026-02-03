//src/app/solicitud/page.js
import SolicitudClient from "./SolicitudClient";

//Esto le dice a Vercel que no intente hacer Prerendering de esta página
//Es la clave para que no falle con Supabase durante el build
export const dynamic = 'force-dynamic';

export default function Page() {
    //Aquí llamamos a tu componente con todo el GSAP y la lógica
    return <SolicitudClient />;
}