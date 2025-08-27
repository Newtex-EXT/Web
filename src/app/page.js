import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="bg-gradient-to-r from-[#000428] to-[#004e92]">
      {/* Navbar */}
      <header className="w-full mx-auto flex  items-center justify-between px-5 py-5 object-contain">
        <Image 
        src="/logo.svg" 
        alt="NEXA - Nueva era de automatización"
        width={200}
        height={70}
        priority>
        </Image>
        
        <nav className="flex gap-6 px-6 py-10 text-sm">
          <div className="rounded-xs p-2 flex items-center justify-center border yellow-500 ">
            <Link href="/servicios" className=" text-lg  hover:text-yellow-500">Servicios</Link>
          </div>
          <div className="rounded-xs p-2 flex items-center justify-center border yellow-500">
            <Link href="/Contacto" className="text-lg hover:text-yellow-500">Contacto</Link>
          </div>
          
        </nav>
      </header>

      {/* Hero */}
      <section className="bg-blue">
        <div className="mx-auto max-w-6xl px-4 py-20 text-white">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Automatizamos tus procesos.<br/>Más rápido, menos errores.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-300">
            Implementamos soluciones a medida para digitalizar tu negocio, agilizar procesos y ahorrar tiempo en tareas repetitivas.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contacto"
              className="rounded-xs bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-yellow-500 hover:text-black"
            >
              Solicitar propuesta
            </Link>
            <Link
              href="/servicios"
              className="rounded-xs px-5 py-3 font-semibold ring-1 ring-white/30  hover:bg-yellow-500 hover:text-black"
            >
              Ver servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold">Servicios</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {[
            { t: "Ahorro de tiempo", d: "Automatizamos tareas repetitivas para liberar a tu equipo" },
            { t: "Reducción de errores", d: "Estandariza procesos y minimiza la intervención manual" },
            { t: "Escalabilidad", d: "Herramientas que crecen con tu negocio" },
          ].map((s) => (
            <div key={s.t} className="rounded-xs border p-6">
              <h3 className="font-semibold text-yellow-500">{s.t}</h3>
              <p className="mt-2 text-sm text-white">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full border-t">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 text-sm">
    {/* Izquierda */}
        <div>
      © {new Date().getFullYear()} NEXA S.L — Todos los derechos reservados
        </div>

    {/* Derecha */}
        <div className="flex gap-6">
          <span>Teléfono corporativo — +34 XXX XX XX XX</span>
          <span>Dirección: C/ Canutillo Nº420</span>
        </div>
      </div>
    </footer>

    </main>
  );
}
