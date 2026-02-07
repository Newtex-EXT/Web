"use client";

import React, { useState, useRef } from 'react';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DOMPurify from 'dompurify';
import { User, Mail, Building, Phone, ChevronDown, ArrowRight, CheckCircle, AlertCircle, MousePointer, Monitor } from 'lucide-react';
import Logo from "@/components/Logo";
import Link from "next/link";

import { supabase } from '@/utils/supabase';

gsap.registerPlugin(ScrollTrigger);

const FormIcon = ({ icon: Icon }) => (
    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none group-focus-within/input:text-primary transition-colors">
        <Icon size={18} />
    </div>
);

const SolicitudPage = () => {
    const [status, setStatus] = useState({ loading: false, type: '', message: '' });
    const mainRef = useRef(null);
    const canvasRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, type: '', message: '' });

        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());

        if (!data.name || !data.email || !data.service) {
            setStatus({ loading: false, type: 'error', message: 'Nombre, email y servicio son obligatorios.' });
            return;
        }

        const sanitizedData = {
            name: DOMPurify.sanitize(data.name),
            email: DOMPurify.sanitize(data.email),
            company: DOMPurify.sanitize(data.company),
            phone: DOMPurify.sanitize(data.phone),
            service: DOMPurify.sanitize(data.service)
        };

        try {
            const { error } = await supabase
                .from('CLIENTES_DEMO')
                .insert([{
                    nombre: sanitizedData.name,
                    nombre_empresa: sanitizedData.company,
                    correo_electronico: sanitizedData.email,
                    telefono: sanitizedData.phone,
                    servicio: sanitizedData.service
                }]);

            if (error) throw error;

            setStatus({ loading: false, type: 'success', message: '¡Solicitud recibida! Revisa tu correo.' });
            e.target.reset();

        } catch (error) {
            console.error("Supabase Submission Error:", error);
            setStatus({ loading: false, type: 'error', message: 'Error al enviar. Inténtalo de nuevo más tarde.' });
        }
    };

    return (
            <div className="relative min-h-screen w-full flex flex-col bg-black text-white font-sans selection:bg-primary/30 overflow-x-hidden">
                <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[50vw] h-[50vw] bg-blue-900/10 rounded-full blur-[150px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[40vw] h-[40vw] bg-primary/5 rounded-full blur-[120px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>
            <div ref={mainRef} className="min-h-screen w-full overflow-x-hidden bg-black text-white selection:bg-[#00CFFF] selection:text-black font-sans flex flex-col relative">
            <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10 h-full w-full pointer-events-none" />

            <header className="fixed top-0 z-50 w-full mx-auto flex items-center justify-between pl-5 pr-5 py-3 transition-colors duration-300 bg-black/50 backdrop-blur-sm">
                <Link href="/">
                    <Logo className="w-auto h-8 md:h-12 text-[#00CFFF] mt-2" />
                </Link>
                <div className="hidden md:flex flex-row items-center justify-center space-x-4">
                    <Link href="/#inicio" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors">Inicio</Link>
                    <Link href="/#features" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors">Features</Link>
                    <Link href="/#tecnologias" className="py-2 px-3 block hover:text-[#00CFFF]">Conócenos</Link>
                    <Link href="/#process" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors">Proceso</Link>
                    <Link href="/Contacto" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors">Contacto</Link>
                    <Link href="/solicitud" className="flex h-10 px-6 items-center justify-center rounded-lg bg-primary hover:bg-[#33d9ff] text-[#0f2024] text-sm font-bold shadow-[0_0_15px_rgba(0,208,255,0.3)] transition-all">
                        Solicitar Demo
                    </Link>
                </div>
                {/* Mobile Button - ONLY Solicitar Demo */}
                <div className="md:hidden z-50 relative">
                     <Link href="/solicitud" className="flex h-9 px-4 items-center justify-center rounded-lg bg-primary hover:bg-[#33d9ff] text-[#0f2024] text-xs font-bold shadow-[0_0_10px_rgba(0,208,255,0.3)] transition-all">
                      Solicitar Demo
                    </Link>
                </div>
            </header>

            <main className="relative z-10 mx-auto w-full max-w-7xl px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center py-24 pb-12 lg:py-20 flex-grow">

                <div className="flex flex-col gap-6 justify-center">
                    <div>
                        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-[1.1] mb-4 font-['Trebuchet_MS']">
                            Transforma tu <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Lógica de Negocio</span> hoy
                        </h1>
                        <p className="text-lg text-slate-300 leading-relaxed font-light max-w-xl">
                            ¿Buscas optimizar tus procesos? Solicita una demo gratuita sin compromiso.
                        </p>
                    </div>

                    <div className="space-y-6 mt-2">
                        <div className="flex gap-4 items-start group">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-105 transition-transform">
                                <MousePointer size={20} />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-white mb-1">1. Selecciona tu solución</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Elige el área a automatizar según tus necesidades.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start group">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                                <Mail size={20} />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-white mb-1">2. Revisa tu bandeja</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Recibirás un acceso temporal a la demo base.
                                </p>
                            </div>
                        </div>

                        <div className="flex gap-4 items-start group">
                            <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                                <Monitor size={20} />
                            </div>
                            <div>
                                <h4 className="text-base font-bold text-white mb-1">3. Explora la herramienta</h4>
                                <p className="text-slate-400 text-sm leading-relaxed">
                                    Comprueba el potencial de la automatización real.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-lg p-3 mt-2 max-w-md">
                        <p className="text-primary font-medium text-center italic text-sm">
                            "No adaptamos tu empresa al software; construimos el software que se adapta a ti."
                        </p>
                    </div>
                </div>

                <div className="w-full relative z-20 flex justify-center lg:justify-end">
                    <div className="relative w-full max-w-md rounded-2xl bg-slate-900/90 border border-white/10 shadow-2xl backdrop-blur-xl p-6 lg:p-8">
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-primary/20 rounded-full blur-[50px] pointer-events-none"></div>

                        <div className="mb-6 relative z-10 text-center lg:text-left">
                            <h2 className="text-2xl font-bold text-white mb-1">Solicita tu Demo</h2>
                            <p className="text-slate-400 text-sm">Agenda una sesión con nuestros expertos.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4 relative z-10" noValidate>
                            <div>
                                <label htmlFor="name" className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Nombre Completo</label>
                                <div className="relative group/input">
                                    <FormIcon icon={User} />
                                    <input
                                        type="text" id="name" name="name" required placeholder="Juan Pérez"
                                        className="block w-full bg-black/50 border border-white/10 rounded-lg h-10 pl-10 pr-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        aria-label="Nombre Completo"
                                    />
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Email Corporativo</label>
                                <div className="relative group/input">
                                    <FormIcon icon={Mail} />
                                    <input
                                        type="email" id="email" name="email" required placeholder="juan@empresa.com"
                                        className="block w-full bg-black/50 border border-white/10 rounded-lg h-10 pl-10 pr-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                        aria-label="Email Corporativo"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label htmlFor="company" className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Empresa</label>
                                    <div className="relative group/input">
                                        <FormIcon icon={Building} />
                                        <input
                                            type="text" id="company" name="company" placeholder="Empresa S.L."
                                            className="block w-full bg-black/50 border border-white/10 rounded-lg h-10 pl-10 pr-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            aria-label="Empresa"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label htmlFor="phone" className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Teléfono</label>
                                    <div className="relative group/input">
                                        <FormIcon icon={Phone} />
                                        <input
                                            type="tel" id="phone" name="phone" placeholder="+34 600..."
                                            className="block w-full bg-black/50 border border-white/10 rounded-lg h-10 pl-10 pr-4 text-white text-sm placeholder-slate-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            aria-label="Teléfono"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="service" className="block text-[10px] font-bold text-slate-500 mb-1 uppercase tracking-wider">Servicio de Interés</label>
                                <div className="relative">
                                    <select
                                        id="service" name="service" required
                                        className="block w-full bg-black/50 border border-white/10 rounded-lg h-10 pl-3 pr-8 text-white text-sm appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                                        defaultValue=""
                                        aria-label="Servicio de Interés"
                                    >
                                        <option value="" disabled>Selecciona una opción...</option>
                                        <option value="Consultoría">Consultoría de Procesos</option>
                                        <option value="RPA">Automatización y RPA</option>
                                        <option value="Desarrollo">Desarrollo a Medida</option>
                                        <option value="Otro">Otro</option>
                                    </select>
                                    <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none">
                                        <ChevronDown size={16} />
                                    </div>
                                </div>
                            </div>

                            {status.message && (
                                <div className={`flex items-center justify-center gap-2 p-2 rounded-lg text-xs font-bold ${status.type === 'error' ? 'text-red-400 bg-red-900/20 border border-red-900/30' : 'text-green-400 bg-green-900/20 border border-green-900/30'}`} role="alert">
                                    {status.type === 'success' ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                    <p>{status.message}</p>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={status.loading}
                                className="group w-full h-11 bg-white hover:bg-primary text-black font-bold rounded-lg mt-2 flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:shadow-[0_0_25px_rgba(0,208,255,0.4)] disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                            >
                                {status.loading ? 'Procesando...' : 'Agendar Demo'}
                                {!status.loading && <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />}
                            </button>
                        </form>
                    </div>
                </div>

            </main>
        </div>
        </div>
    );
};

export default SolicitudPage;