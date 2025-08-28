"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Contacto() {
  const [servicesOpen, setServicesOpen] = useState(false);
    const servicesRef = useRef(null);
  
    
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
      
       <header className="w-full mx-auto flex items-center justify-between px-5 py-5 object-contain">
      <Link href="/">
        <Image 
        src="/logo.svg" 
        alt="NEXA - Nueva era de automatización"
        width={200}
        height={70}
        priority>
        </Image>
        </Link>
        
        <div className="md:flex md:flex-row flex-col items-center justify-center md:space-x-4 pb-3 md:pb-0 navigation-menu">
          <Link href="/" className="py-2 px-3 block hover:text-yellow-500">
            Inicio
          </Link>
          <Link href="/sobre-nosotros" className="py-2 px-3 block hover:text-yellow-500">
            Sobre Nosotros
          </Link>

          
          <div className="relative" ref={servicesRef}>
            <button
              type="button"
              className="dropdown-toggle py-2 px-3 hover:bg-sky-800 hover:text-yellow-500 flex items-center gap-2 rounded"
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

      
      <section className="flex-1">
        <form
          action=""
          method="get"
          className="mx-auto mt-10 max-w-3xl mb-10  space-y-6 rounded-xl bg-black/30 p-8 shadow-lg backdrop-blur"
        >
          <h2 className="text-2xl font-bold text-center">Contáctanos</h2>

          
          <div className="flex flex-col gap-2">
            <label htmlFor="txtNombre" className="text-sm font-medium text-gray-200">
              Nombre <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="txtNombre"
              id="txtNombre"
              placeholder="Escriba aquí su nombre"
              required
              className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring focus:ring-yellow-300"
            />
          </div>

          
          <div className="flex flex-col gap-2">
            <label htmlFor="txtDireccion" className="text-sm font-medium text-gray-200">
              Correo electrónico <span className="text-red-400">*</span>
            </label>
            <input
              type="email"
              name="txtDireccion"
              id="txtDireccion"
              placeholder="correo@ejemplo.com"
              required
              className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring focus:ring-yellow-300"
            />
          </div>

          
          <div className="flex flex-col gap-2">
            <label htmlFor="sugerencias" className="text-sm font-medium text-gray-200">
              Cuéntanos tu caso
            </label>
            <textarea
              name="sugerencias"
              id="sugerencias"
              rows="5"
              placeholder="Escriba aquí..."
              className="rounded-lg border border-gray-600 bg-gray-800 px-4 py-2 text-white placeholder-gray-400 focus:border-yellow-400 focus:outline-none focus:ring focus:ring-yellow-300"
            ></textarea>
          </div>

          {/* Botón */}
          <button
            type="submit"
            className="w-full rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-gray-900 transition hover:bg-yellow-400"
          >
            Enviar
          </button>
        </form>
      </section>

      
      <footer className="w-full border-t">

      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 text-sm">
    
        <div>
      © {new Date().getFullYear()} NEXA S.L — Todos los derechos reservados
        </div>

    
        <div className="flex gap-6">
          <span>Teléfono corporativo — +34 XXX XX XX XX</span>
          <span>Dirección: C/ Canutillo Nº420</span>
        </div>

      </div>
      </footer>

    </main>
  );
}
