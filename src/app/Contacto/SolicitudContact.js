"use client";

import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import Logo from "@/components/Logo";
import { supabase } from '@/utils/supabase';
import DOMPurify from 'dompurify';
import { ArrowRight, AlertCircle } from 'lucide-react';

export default function SolicitudContact() {
  const mainRef = useRef(null);

  // 1. Estado del Formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '', 
    company: '',
    phone: ''
  });
  
  const [status, setStatus] = useState({ loading: false, type: '', message: '' });

  useEffect(() => {
    let ctx = gsap.context(() => {
      // animaciones
      gsap.fromTo(".contact-title", { opacity: 0, y: -30 }, { opacity: 1, y: 0, duration: 1, ease: "power3.out" });
      gsap.fromTo(".contact-form", { opacity: 0, x: -30 }, { opacity: 1, x: 0, duration: 1, delay: 0.3, ease: "power3.out" });
      gsap.fromTo(".contact-info", { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 1, delay: 0.3, ease: "power3.out" });
    }, mainRef);

    return () => ctx.revert();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
  };
  
  const handleSubmit = async (e) => {
  e.preventDefault();
  setStatus({ loading: true, type: '', message: '' });

  try {
    const sanitizedData = {
      name: DOMPurify.sanitize(formData.name),
      email: DOMPurify.sanitize(formData.email),
      message: DOMPurify.sanitize(formData.message)
    };

    //Inserción en Supabase
    const { error: dbError } = await supabase
      .from('CLIENTES_CONTACTO')
      .insert([
        {
          nombre: sanitizedData.name,
          correo_electronico: sanitizedData.email,
          mensaje: sanitizedData.message,
        }
      ]);

    if (dbError) throw dbError;

    
    await fetch('/api/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        nombre: sanitizedData.name,
        email: sanitizedData.email,
        mensaje: sanitizedData.message,
        tipoFormulario: 'Contacto Web'
      }),
    });

    setStatus({ loading: false, type: 'success', message: '¡Solicitud enviada correctamente!' });
    setFormData({ name: '', email: '', message: '', company: '', phone: '' });

    }   catch (error) {
    console.error("Error en el proceso:", error);
    setStatus({
      loading: false,
      type: 'error',
      message: 'Hubo un problema. Por favor intenta de nuevo.'
        });
    }
    };

  return (
    <div ref={mainRef} className="min-h-screen w-full bg-[#101022] text-white selection:bg-[#00CFFF] selection:text-black font-sans flex flex-col relative overflow-hidden">

      {/* Navbar */}
      <header className="fixed top-0 z-50 w-full mx-auto flex items-center justify-between pl-5 pr-5 py-3 transition-colors duration-300 bg-black/50 backdrop-blur-sm">
        <Link href="/">
          <Logo className="w-auto h-12 text-blue-900 mt-2" />
        </Link>
        <div className="hidden md:flex flex-row items-center justify-center space-x-4">
          <Link href="/#inicio" className="py-2 px-3 block hover:text-[#00CFFF]">Inicio</Link>
          <Link href="/#features" className="py-2 px-3 block hover:text-[#00CFFF]">Features</Link>
          <Link href="/#tecnologias" className="py-2 px-3 block hover:text-[#00CFFF]">Conócenos</Link>
          <Link href="/#proceso" className="py-2 px-3 block hover:text-[#00CFFF]">Proceso</Link>
          <Link href="/Contacto" className="py-2 px-3 block hover:text-[#00CFFF]">Contacto</Link>
          <Link href="/solicitud" className="flex h-10 px-6 items-center justify-center rounded-lg bg-primary hover:bg-[#33d9ff] text-[#0f2024] text-sm font-bold shadow-[0_0_15px_rgba(0,208,255,0.3)] transition-all">
            Solicitar Demo
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center pt-24 pb-12 px-4 relative">
        {/* Subtle */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "radial-gradient(circle at 50% 50%, #0a162bff 0%, #04040aff 70%)"
        }}></div>

        <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-start relative z-10">

          {/* Form */}
          <div className="contact-form bg-white/5 p-8 rounded-xl backdrop-blur-md border border-white/10 shadow-2xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-6 contact-title text-white">Contáctanos</h1>
            <p className="text-gray-400 mb-8 text-sm leading-relaxed">
              ¿Tienes un proyecto en mente? Completa el formulario y nos pondremos en contacto contigo lo antes posible para analizar tus necesidades.
            </p>
            <form className="space-y-5" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="name" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Nombre</label>
                <input type="text" id="name" className="w-full bg-[#101022]/80 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00CFFF] focus:ring-1 focus:ring-[#00CFFF] transition-all placeholder-gray-600 text-sm" placeholder="Tu nombre completo" value={formData.name} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="email" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Email</label>
                <input type="email" id="email" className="w-full bg-[#101022]/80 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00CFFF] focus:ring-1 focus:ring-[#00CFFF] transition-all placeholder-gray-600 text-sm" placeholder="tu@empresa.com" value={formData.email} onChange={handleChange} />
              </div>
              <div>
                <label htmlFor="message" className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Mensaje</label>
                <textarea id="message" rows="4" className="w-full bg-[#101022]/80 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#00CFFF] focus:ring-1 focus:ring-[#00CFFF] transition-all placeholder-gray-600 text-sm resize-none" placeholder="Cuéntanos brevemente sobre tu proyecto..." value={formData.message} onChange={handleChange} ></textarea>
              </div>
              <button  
                type="submit"
                disabled={status.loading}
                className="w-full bg-[#00CFFF] hover:bg-[#33d9ff] text-black font-bold py-3.5 rounded-lg transition-all flex items-center justify-center shadow-[0_0_20px_rgba(0,207,255,0.2)] hover:shadow-[0_0_30px_rgba(0,207,255,0.4)] uppercase text-xs tracking-widest mt-2"
                >

                <span className="flex items-center gap-2">
                    {status.loading ? 'Procesando...' : 'Solicitar información'}
                    <ArrowRight size={18} />
                </span>

              </button>

                {status.type === 'success' && (
                <div className="flex items-center justify-center gap-2 text-green-400 font-bold animate-pulse" role="alert">
                <p>{status.message}</p>
                </div>
                )}
                {status.type === 'error' && (
                <div className="flex items-center justify-center gap-2 text-red-400 font-bold" role="alert">
                <AlertCircle size={18} />
                <p>{status.message}</p>
                </div>
                )}
            </form>
          </div>

          {/* Info */}
          <div className="contact-info space-y-10 mt-4 md:mt-10 pl-0 md:pl-8">
            <div>
              <h2 className="text-2xl font-bold mb-4 text-[#00CFFF]">Información de Contacto</h2>
              <p className="text-gray-400 leading-relaxed">Estamos aquí para resolver tus dudas y ayudarte a dar el siguiente paso en la automatización de tu negocio.</p>
            </div>

            <div className="space-y-8">
              <div className="flex items-start gap-5 group">
                <div className="bg-white/5 p-3 rounded-lg text-[#00CFFF] group-hover:bg-[#00CFFF]/20 transition-colors border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wide text-white mb-1">Teléfono</h3>
                  <p className="text-gray-400 font-mono text-sm">+34 608 77 10 56</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="bg-white/5 p-3 rounded-lg text-[#00CFFF] group-hover:bg-[#00CFFF]/20 transition-colors border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wide text-white mb-1">Email</h3>
                  <p className="text-gray-400 font-mono text-sm">info@nexaext.com</p>
                </div>
              </div>

              <div className="flex items-start gap-5 group">
                <div className="bg-white/5 p-3 rounded-lg text-[#00CFFF] group-hover:bg-[#00CFFF]/20 transition-colors border border-white/10">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-sm uppercase tracking-wide text-white mb-1">Dirección</h3>
                  <p className="text-gray-400 text-sm">C. Roa Bastos, 10005 Cáceres</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full border-t border-white/10 bg-black/80 backdrop-blur-md relative z-50">
        <div className="mx-auto max-w-7xl px-5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-400">© {new Date().getFullYear()} NEWTEX — Todos los derechos reservados</span>
          </div>
          <div className="flex items-center gap-6 text-xs font-medium text-[#00CFFF]">
            <span>+34 608 77 10 56</span>
            <span>C. Roa Bastos, 10005 Cáceres</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
