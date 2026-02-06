"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import DOMPurify from 'dompurify';
import { User, Mail, Building, Phone, ChevronDown, ArrowRight, Activity } from 'lucide-react';
import 'animate.css';

import Logo from "@/components/Logo";
import { supabase } from '@/utils/supabase';

gsap.registerPlugin(ScrollTrigger);

const FormIcon = ({ icon: Icon }) => (
    <div className="absolute left-4 top-3.5 text-gray-500 group-focus-within/input:text-primary transition-colors pointer-events-none">
        <Icon size={20} />
    </div>
);

const SolicitudClient = () => {
    const mainRef = useRef(null);

    // 1. Estado del Formulario
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        phone: '',
        service: ''
    });

    const [status, setStatus] = useState({ loading: false, type: '', message: '' });

    useEffect(() => {

        let ctx = gsap.context(() => {
            const leftElements = document.querySelectorAll(".animate-left > *");
            leftElements.forEach((el) => {
                gsap.set(el, { opacity: 0 });

                ScrollTrigger.create({
                    trigger: el,
                    start: "top 85%",
                    onEnter: () => {
                        gsap.set(el, { opacity: 1 });
                        el.classList.add('animate__animated', 'animate__fadeInUp');
                    },
                    once: true
                });
            });

            gsap.fromTo(".animate-form-card",
                { opacity: 0, scale: 0.95, y: 20 },
                {
                    opacity: 1, scale: 1, y: 0,
                    duration: 0.8, ease: "back.out(1.2)",
                    delay: 0.2
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, type: '', message: '' });

        try {
            const sanitizedData = {
                name: DOMPurify.sanitize(formData.name),
                company: DOMPurify.sanitize(formData.company),
                email: DOMPurify.sanitize(formData.email),
                phone: DOMPurify.sanitize(formData.phone),
                service: DOMPurify.sanitize(formData.service)
            };

            const { error: dbError } = await supabase
                .from('CLIENTES_DEMO')
                .insert([
                    {
                        nombre: sanitizedData.name,
                        nombre_empresa: sanitizedData.company,
                        correo_electronico: sanitizedData.email,
                        telefono: sanitizedData.phone,
                        servicio: sanitizedData.service
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
                nombre_empresa: formData.company,
                correo_electronico: sanitizedData.email,
                telefono: formData.phone,
                servicio: formData.service,
                tipoFormulario: 'Solicitud Demo'
            }),
            });

            setStatus({ loading: false, type: 'success', message: '¡Demo agendada con éxito!' });
            setFormData({ name: '', email: '', company: '', phone: '', service: '' });

        } catch (dbError) {

            console.error("Error al enviar formulario:", dbError);
            setStatus({
                loading: false,
                type: 'error',
                message: 'Hubo un problema al procesar tu solicitud. Por favor intenta de nuevo.'
            });
        }
    };

    return (
        <div ref={mainRef} className="relative min-h-screen flex flex-col bg-black text-white font-sans selection:bg-primary/30">
            {/* Background elements */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            <header className="fixed top-0 z-50 w-full mx-auto flex items-center justify-between pl-5 pr-5 py-3 bg-black/50 backdrop-blur-sm border-b border-white/5">
                <Link href="/">
                    <Logo className="w-auto h-12 text-blue-900 mt-2" />
                </Link>
                <div className="hidden md:flex flex-row items-center justify-center space-x-4">
                    <Link href="/#inicio" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Inicio</Link>
                    <Link href="/#features" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Features</Link>
                    <Link href="/#sectores" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Conócenos</Link>
                    <Link href="/#proceso" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Proceso</Link>
                    <Link href="/Contacto" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Contacto</Link>
                    <Link href="/solicitud" className="flex h-10 px-6 items-center justify-center rounded-lg bg-primary hover:bg-[#33d9ff] text-[#0f2024] text-sm font-bold shadow-[0_0_15px_rgba(0,208,255,0.3)] transition-all">
                        Solicitar Demo
                    </Link>
                </div>
            </header>

            <main className="relative z-10 flex-grow flex flex-col lg:flex-row max-w-7xl mx-auto w-full px-6 py-28 lg:py-36 gap-16 lg:gap-24 items-start">

                {/* Visual Content (Left Column) */}
                <div className="flex-1 flex flex-col justify-center space-y-12 pt-4 animate-left">
                    <div className="space-y-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 w-fit backdrop-blur-sm">
                            <span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
                            <span className="text-xs font-medium text-primary tracking-wide uppercase">Listo para Empresas</span>
                        </div>
                        <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-white font-['Trebuchet_MS']">
                            Transforma tu <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-400">Lógica de Negocio</span> hoy
                        </h1>
                        <p className="text-xl text-gray-300 max-w-xl leading-relaxed">
                            Optimiza tus operaciones con nuestra plataforma de automatización impulsada por IA.
                        </p>
                    </div>

                    <div className="space-y-8">
                        <div className="flex gap-6 items-start group">
                            <div className="flex-shrink-0 size-14 rounded-lg bg-[#1a2e33] flex items-center justify-center text-primary border border-white/10 group-hover:scale-110 transition-transform">
                                <Activity size={32} />
                            </div>
                            <div>
                                <h3 className="text-white text-xl font-bold group-hover:text-primary transition-colors">Arquitectura de Software</h3>
                                <p className="text-gray-400 text-base">Escalabilidad diseñada para el mundo real.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column */}
                <div className="flex-1 w-full max-w-lg lg:sticky lg:top-32 self-start animate-form-card">
                    <div className="relative group perspective-1000">
                        <div className="absolute -inset-1 bg-gradient-to-r from-primary to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                        <div className="relative bg-[#132328]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-10 shadow-2xl">
                            <div className="mb-10 form-field">
                                <h3 className="text-3xl font-bold text-white mb-2">Solicita tu Demo</h3>
                                <p className="text-gray-300 text-base">Agenda una sesión personalizada con nuestros expertos.</p>
                            </div>

                            <form className="space-y-6" onSubmit={handleSubmit} noValidate>
                                <div className="space-y-1 form-field">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1" htmlFor="name">Nombre Completo</label>
                                    <div className="relative group/input">
                                        <FormIcon icon={User} />
                                        <input
                                            className="w-full bg-[#0a1619] border border-[#2e606b] rounded-lg h-12 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all"
                                            id="name"
                                            value={formData.name}
                                            onChange={handleChange}
                                            placeholder="Juan Pérez"
                                            type="text"
                                            required
                                            aria-label="Nombre Completo"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1 form-field">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1" htmlFor="email">Email Corporativo</label>
                                    <div className="relative group/input">
                                        <FormIcon icon={Mail} />
                                        <input
                                            className="w-full bg-[#0a1619] border border-[#2e606b] rounded-lg h-12 pl-11 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-primary transition-all"
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            placeholder="juan@empresa.com"
                                            type="email"
                                            required
                                            aria-label="Email Corporativo"
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1 form-field">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1" htmlFor="company">Empresa</label>
                                        <div className="relative group/input">
                                            <input
                                                className="w-full bg-[#0a1619] border border-[#2e606b] rounded-lg h-12 px-4 text-white focus:outline-none focus:border-primary"
                                                id="company"
                                                value={formData.company}
                                                onChange={handleChange}
                                                placeholder="Tu Empresa S.L."
                                                type="text"
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1 form-field">
                                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1" htmlFor="phone">Teléfono</label>
                                        <div className="relative group/input">
                                            <input
                                                className="w-full bg-[#0a1619] border border-[#2e606b] rounded-lg h-12 px-4 text-white focus:outline-none focus:border-primary"
                                                id="phone"
                                                value={formData.phone}
                                                onChange={handleChange}
                                                placeholder="+34 600..."
                                                type="tel"
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-1 form-field">
                                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wide ml-1" htmlFor="service">Servicio de Interés</label>
                                    <div className="relative">
                                        <select
                                            className="w-full bg-[#0a1619] border border-[#2e606b] rounded-lg h-12 px-4 text-white appearance-none focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all cursor-pointer"
                                            id="service"
                                            value={formData.service}
                                            onChange={handleChange}
                                            required
                                            aria-label="Servicio de Interés"
                                        >
                                            <option value="" disabled>¿En qué servicio estás interesado?</option>
                                            <option value="automatizacion">Automatización de Procesos</option>
                                            <option value="ia_consultoria">Consultoría IA</option>
                                            <option value="desarrollo_web">Desarrollo Web / App</option>
                                            <option value="otros">Otros</option>
                                        </select>
                                        <div className="absolute right-4 top-3.5 text-gray-500 pointer-events-none">
                                            <ChevronDown size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-field">
                                    <button
                                        type="submit"
                                        disabled={status.loading}
                                        className="group relative w-full h-12 bg-white text-black font-bold rounded-lg mt-6 flex items-center justify-center hover:bg-[#00CFFF] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="flex items-center gap-2">
                                            {status.loading ? 'Procesando...' : 'Agendar Mi Demo'}
                                            <ArrowRight size={18} />
                                        </span>
                                    </button>
                                </div>
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
                    </div>
                </div>
            </main>

            <footer className="w-full border-t border-white/10 bg-black/80 backdrop-blur-md relative z-50">
                <div className="mx-auto max-w-7xl px-5 py-6 flex flex-col md:flex-row items-center justify-between">
                    <span className="text-sm text-gray-400">© {new Date().getFullYear()} NEWTEX</span>
                    <div className="flex gap-6 text-xs font-medium text-[#00CFFF]">
                        <span>+34 608 77 10 56</span>
                        <span>C. Roa Bastos, Cáceres</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default SolicitudClient;