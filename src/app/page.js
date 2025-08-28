"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef(null);

  // Cerrar dropdown al click fuera y con ESC
  useEffect(() => {
    function onClickOutside(e) {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    }
    function onEsc(e) {
      if (e.key === "Escape") {
        setServicesOpen(false);
      }
    }
    document.addEventListener("click", onClickOutside);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("click", onClickOutside);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col bg-gradient-to-r from-[#000428] to-[#004e92] text-white">
      {/* Navbar */}
      <header className="w-full mx-auto flex items-center justify-between px-5 py-5 object-contain">
        <Image
          src="/logo.svg"
          alt="NEXA - Nueva era de automatización"
          width={200}
          height={70}
          priority
        />

        {/* Menú principal */}
        <div className="md:flex md:flex-row flex-col items-center justify-center md:space-x-4 pb-3 md:pb-0 navigation-menu">
          <Link href="/" className="py-2 px-3 block hover:text-yellow-500">
            Inicio
          </Link>
          <Link href="/sobre-nosotros" className="py-2 px-3 block hover:text-yellow-500">
            Sobre Nosotros
          </Link>

          {/* Dropdown Servicios */}
          <div className="relative" ref={servicesRef}>
            <button
              type="button"
              className="dropdown-toggle py-2 px-3 hover:bg-sky-800 flex items-center gap-2 rounded"
              onClick={() => setServicesOpen((v) => !v)}
            >
              <span>Servicios</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`h-5 w-5 transition-transform ${servicesOpen ? "rotate-180" : ""}`}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
              </svg>
            </button>
            <div
              className={`${
                servicesOpen ? "block" : "hidden"
              } absolute left-0 z-20 mt-2 w-48 rounded-lg bg-sky-700 text-white shadow-lg`}
            >
              <Link
                href="/servicios/automatizacion"
                className="block px-6 py-2 hover:bg-sky-800"
                onClick={() => setServicesOpen(false)}
              >
                Automatización
              </Link>
              <Link
                href="/servicios/digitalizacion"
                className="block px-6 py-2 hover:bg-sky-800"
                onClick={() => setServicesOpen(false)}
              >
                Digitalización
              </Link>
            </div>
          </div>

          <Link href="/Contacto" className="py-2 px-3 block hover:text-yellow-500">
            Contacto
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section>
        <div className="mx-auto max-w-6xl px-4 py-20">
          <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
            Automatizamos tus procesos.<br />Más rápido, menos errores.
          </h1>
          <p className="mt-4 max-w-2xl text-lg text-gray-200">
            Implementamos soluciones a medida para digitalizar tu negocio, agilizar procesos y ahorrar tiempo en tareas repetitivas.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/contacto"
              className="rounded bg-white px-5 py-3 font-semibold text-gray-900 hover:bg-yellow-500 hover:text-black"
            >
              Solicitar propuesta
            </Link>
            <Link
              href="/servicios"
              className="rounded px-5 py-3 font-semibold ring-1 ring-white/30 hover:bg-yellow-500 hover:text-black"
            >
              Ver servicios
            </Link>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-2xl font-bold">Servicios</h2>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            { t: "Ahorro de tiempo", d: "Automatizamos tareas repetitivas para liberar a tu equipo" },
            { t: "Reducción de errores", d: "Estandariza procesos y minimiza la intervención manual" },
            { t: "Escalabilidad", d: "Herramientas que crecen con tu negocio" },
          ].map((s) => (
            <div key={s.t} className="rounded border p-6">
              <h3 className="font-semibold text-yellow-500">{s.t}</h3>
              <p className="mt-2 text-sm text-white">{s.d}</p>
            </div>
          ))}
        </div>
      </section>

      
      <footer className="w-full border-t">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 text-sm">
          <div>© {new Date().getFullYear()} NEXA S.L — Todos los derechos reservados</div>
          <div className="flex gap-6">
            <span>Teléfono corporativo — +34 XXX XX XX XX</span>
            <span>Dirección: C/ Canutillo Nº420</span>
          </div>
        </div>
      </footer>
    </main>
  );
}

