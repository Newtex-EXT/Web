"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from 'lenis';
import Logo from "@/components/Logo";

gsap.registerPlugin(ScrollTrigger);

const Solicitud = () => {
    const mainRef = useRef(null);

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        role: '',
        interest: ''
    });

    // Initialize Lenis
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            smooth: true,
        });

        lenis.on('scroll', ScrollTrigger.update);

        function raf(time) {
            lenis.raf(time);
            requestAnimationFrame(raf);
        }

        requestAnimationFrame(raf);

        return () => {
            lenis.destroy();
        };
    }, []);

    // GSAP Animations
    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // Animate Left Side Content
            gsap.fromTo(".animate-left > *",
                { opacity: 0, y: 20 },
                {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    stagger: 0.1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: ".animate-left",
                        start: "top 80%"
                    }
                }
            );

            // Animate Form Card
            gsap.fromTo(".animate-form-card",
                { opacity: 0, scale: 0.95, y: 20 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "back.out(1.2)",
                    scrollTrigger: {
                        trigger: ".animate-form-card",
                        start: "top 85%"
                    }
                }
            );

            // Animate Form Fields
            gsap.fromTo(".form-field",
                { opacity: 0, x: -10 },
                {
                    opacity: 1,
                    x: 0,
                    duration: 0.5,
                    stagger: 0.05,
                    delay: 0.3, // Wait for card
                    ease: "power1.out",
                    scrollTrigger: {
                        trigger: ".animate-form-card",
                        start: "top 85%"
                    }
                }
            );

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

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Formulario enviado:", formData);
        // Aquí iría la lógica de envío
    };

    return (
        <div ref={mainRef} className="relative min-h-screen flex flex-col bg-black text-white font-sans selection:bg-primary/30">
            {/* Background Decor */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* Navigation (Matching Original Design) */}
            <header className="fixed top-0 z-50 w-full mx-auto flex items-center justify-between pl-5 pr-5 py-3 transition-colors duration-300 bg-black/50 backdrop-blur-sm border-b border-white/5">
                <Link href="/">
                    <Logo className="w-auto h-12 text-blue-900 mt-2" />
                </Link>
                <div className="hidden md:flex flex-row items-center justify-center space-x-4">
                    <Link href="/#inicio" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Inicio</Link>
                    <Link href="/#features" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Features</Link>
                    <Link href="/#sectores" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Servicios</Link>
                    <Link href="/Contacto" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Contacto</Link>
                    <Link href="/solicitud" className="flex h-10 px-6 items-center justify-center rounded-lg bg-primary hover:bg-[#33d9ff] text-[#0f2024] text-sm font-bold shadow-[0_0_15px_rgba(0,208,255,0.3)] transition-all">
                        Solicitar Demo
                    </Link>
                </div>
                {/* Mobile Menu Placeholder - Optional for this view */}
                <div className="md:hidden">
                    {/* Add hamburger if needed, kept simple for now matching desktop priority */}
                </div>
            </header>

            {/* Main Content Split Screen */}
            <main className="relative z-10 flex-grow flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-6 py-28 lg:py-36 gap-16 lg:gap-24 items-start">

                {/* Left Side: Value Proposition */}
                <div className="flex-1 flex flex-col justify-center space-y-12 pt-4 animate-left">
                    {/* Headline */}
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-medium text-primary tracking-wide uppercase">Listo para Empresas</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white font-['Trebuchet_MS']">
                            Transforma tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Lógica de Negocio</span> hoy
                        </h1>
                        <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
                            Optimiza tus operaciones con nuestra plataforma de automatización impulsada por IA. Diseñada para escalar, asegurar y acelerar tu crecimiento.
                        </p>
                    </div>

                    {/* Feature List */}
                    <div className="space-y-8">
                        <div className="flex gap-6 items-start p-5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                            <div className="flex-shrink-0 size-14 rounded-lg bg-[#1a2e33] flex items-center justify-center text-primary border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">architecture</span>
                            </div>
                            <div>
                                <h3 className="text-white text-xl font-bold mb-2 group-hover:text-primary transition-colors">Arquitectura de Software</h3>
                                <p className="text-gray-400 text-base leading-relaxed">Microservicios escalables diseñados para cargas de trabajo empresariales con un SLA del 99.99%.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-start p-5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                            <div className="flex-shrink-0 size-14 rounded-lg bg-[#1a2e33] flex items-center justify-center text-primary border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">hub</span>
                            </div>
                            <div>
                                <h3 className="text-white text-xl font-bold mb-2 group-hover:text-primary transition-colors">Integraciones</h3>
                                <p className="text-gray-400 text-base leading-relaxed">Conecta sin problemas con más de 500 herramientas existentes, incluyendo Salesforce, SAP y Slack.</p>
                            </div>
                        </div>
                        <div className="flex gap-6 items-start p-5 rounded-xl hover:bg-white/5 transition-colors border border-transparent hover:border-white/5 group">
                            <div className="flex-shrink-0 size-14 rounded-lg bg-[#1a2e33] flex items-center justify-center text-primary border border-white/10 shadow-lg group-hover:scale-110 transition-transform">
                                <span className="material-symbols-outlined text-3xl">analytics</span>
                            </div>
                            <div>
                                <h3 className="text-white text-xl font-bold mb-2 group-hover:text-primary transition-colors">Analítica</h3>
                                <p className="text-gray-400 text-base leading-relaxed">Información en tiempo real y modelado predictivo impulsado por nuestro Motor Neuronal patentado.</p>
                            </div>
                        </div>
                    </div>

                    {/* Partner Badges */}
                    <div className="pt-10 border-t border-white/10">
                        <p className="text-sm text-gray-500 mb-6 uppercase tracking-wider font-bold">Confían en nosotros equipos innovadores</p>
                        <div className="flex flex-wrap gap-8 items-center opacity-50 hover:opacity-100 transition-opacity">
                            {/* Placeholders for logos */}
                            <div className="h-8 w-24 bg-white/20 rounded animate-pulse"></div>
                            <div className="h-8 w-24 bg-white/20 rounded animate-pulse delay-75"></div>
                            <div className="h-8 w-24 bg-white/20 rounded animate-pulse delay-150"></div>
                            <div className="h-8 w-24 bg-white/20 rounded animate-pulse delay-200"></div>
                        </div>
                    </div>
                </div>

                {/* Right Side: Glassmorphism Form */}
                <div className="flex-1 w-full max-w-lg lg:sticky lg:top-36 animate-form-card">
                    <div className="relative group perspective-1000">
                        {/* Glow effect behind card */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>

                        <div className="relative bg-[#132328]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl transform transition-transform duration-500 hover:scale-[1.01]">
                            <div className="mb-10 form-field">
                                <h3 className="text-3xl font-bold text-white mb-2">Solicita tu Demo</h3>
                                <p className="text-gray-300 text-base">Completa el formulario para agendar una sesión personalizada con nuestros expertos.</p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit}>
                                {/* Full Name */}
                                <div className="space-y-1 form-field">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1" htmlFor="name">Nombre Completo</label>
                                    <div className="relative group/input">
                                        <span className="absolute left-4 top-3.5 text-gray-500 group-focus-within/input:text-primary transition-colors material-symbols-outlined text-[20px]">person</span>
                                        <input
                                            className="w-full bg-[#0a1619] border border-[#2e606b] rounded-lg h-12 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Juan Pérez"
                                            type="text"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Work Email */}
                                <div className="space-y-1 form-field">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1" htmlFor="email">Email Corporativo</label>
                                    <div className="relative group/input">
                                        <span className="absolute left-4 top-3.5 text-gray-500 group-focus-within/input:text-primary transition-colors material-symbols-outlined text-[20px]">mail</span>
                                        <input
                                            className="w-full bg-[#0a1619] border border-[#2e606b] rounded-lg h-12 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="juan@empresa.com"
                                            type="email"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Company & Phone */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1 form-field">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1" htmlFor="company">Empresa</label>
                                        <input
                                            className="w-full bg-[#0a1619] border border-[#2e606b] rounded-lg h-12 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            id="company"
                                            value={formData.company}
                                            onChange={handleChange}
                                            placeholder="Tu Empresa S.L."
                                            type="text"
                                        />
                                    </div>
                                    <div className="space-y-1 form-field">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1" htmlFor="phone">Teléfono</label>
                                        <input
                                            className="w-full bg-[#0a1619] border border-[#2e606b] rounded-lg h-12 px-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                                            id="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            placeholder="+34 600 000 000"
                                            type="tel"
                                        />
                                    </div>
                                </div>

                                {/* Role & Interest (Fixed Selects) */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1 form-field">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1" htmlFor="role">Cargo / Rol</label>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-[#0a1619] border border-[#2e606b] rounded-lg h-12 px-4 text-white appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                                                id="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="" disabled>Selecciona tu Rol</option>
                                                <option value="executive">Directivo</option>
                                                <option value="manager">Gerente</option>
                                                <option value="developer">Desarrollador</option>
                                                <option value="other">Otro</option>
                                            </select>
                                            <span className="absolute right-4 top-3.5 text-gray-500 material-symbols-outlined pointer-events-none text-[20px]">expand_more</span>
                                        </div>
                                    </div>
                                    <div className="space-y-1 form-field">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1" htmlFor="interest">Interés Principal</label>
                                        <div className="relative">
                                            <select
                                                className="w-full bg-[#0a1619] border border-[#2e606b] rounded-lg h-12 px-4 text-white appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                                                id="interest"
                                                value={formData.interest}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="" disabled>Seleccionar...</option>
                                                <option value="automation">Automatización</option>
                                                <option value="analytics">Analítica</option>
                                                <option value="integration">Integración</option>
                                            </select>
                                            <span className="absolute right-4 top-3.5 text-gray-500 material-symbols-outlined pointer-events-none text-[20px]">expand_more</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="form-field">
                                    <button type="submit" className="group relative w-full h-12 bg-white text-black font-bold rounded-lg mt-6 overflow-hidden flex items-center justify-center shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:bg-[#00CFFF] hover:shadow-[0_0_30px_rgba(0,207,255,0.4)] transition-all duration-300 transform active:scale-[0.98]">
                                        <span className="relative z-10 flex items-center gap-2">
                                            Agendar Mi Demo
                                            <span className="material-symbols-outlined text-sm font-bold group-hover:translate-x-1 transition-transform">arrow_forward</span>
                                        </span>
                                    </button>
                                </div>

                                <p className="text-center text-xs text-gray-500 mt-4 leading-relaxed form-field">
                                    Al hacer clic, aceptas nuestros <Link className="text-primary hover:underline" href="#">Términos de Servicio</Link> y <Link className="text-primary hover:underline" href="#">Política de Privacidad</Link>.
                                </p>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            {/* Footer (Matching Original Design) */}
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
};

export default Solicitud;