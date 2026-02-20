"use client";

import React, { useLayoutEffect, useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from 'lenis';
import Logo from "@/components/Logo";

gsap.registerPlugin(ScrollTrigger);

const Informacion = () => {
    const mainRef = useRef(null);
    const heroBgRef = useRef(null);
    const canvasRef = useRef(null);

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

    useLayoutEffect(() => {
        let ctx = gsap.context(() => {
            // 1. Hero 
            if (heroBgRef.current) {
                gsap.to(heroBgRef.current, {
                    yPercent: 20,
                    ease: "none",
                    scrollTrigger: {
                        trigger: heroBgRef.current.parentElement,
                        start: "top top",
                        end: "bottom top",
                        scrub: true
                    }
                });
            }

            // 2. Fade In elementos
            const fadeElements = gsap.utils.toArray('.animate-fade-up');

            fadeElements.forEach((el) => {
                gsap.fromTo(el,
                    { opacity: 0, y: 20 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 0.8,
                        ease: "power2.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 85%",
                            toggleActions: "play none none reverse"
                        }
                    }
                );
            });

            // 3. Cards
            ScrollTrigger.batch(".capability-card", {
                onEnter: batch => gsap.fromTo(batch,
                    { opacity: 0, scale: 0.95, y: 20 },
                    { opacity: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.2)", stagger: 0.1 }
                ),
                start: "top 90%"
            });

            // 4. Certificados badges
            gsap.fromTo(".cert-badge",
                { opacity: 0, y: 10, filter: "blur(5px)" },
                {
                    opacity: 1,
                    y: 0,
                    filter: "blur(0px)",
                    duration: 0.8,
                    stagger: 0.1,
                    scrollTrigger: {
                        trigger: ".certs-container",
                        start: "top 90%"
                    }
                }
            );

            // 5. Leadership 
            ScrollTrigger.batch(".leader-item", {
                onEnter: batch => gsap.fromTo(batch,
                    { opacity: 0, x: -20 },
                    { opacity: 1, x: 0, duration: 0.5, stagger: 0.1, ease: "power2.out" }
                ),
                start: "top 90%"
            });

        }, mainRef);

        return () => ctx.revert();
    }, []);

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

                <main className="relative z-10 flex-1 pt-24">
                    {/* Hero */}
                    <section className="relative mx-auto w-full max-w-7xl px-6 lg:px-3 pt-12 pb-24">
                        <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-white/10 shadow-2xl shadow-primary/10 group h-[550px] flex items-end">
                            <div
                                ref={heroBgRef}
                                className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay scale-110"
                                role="img"
                                aria-label="Visualización abstracta del núcleo digital con flujos de datos azules"
                                style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCnrH62nMNc_wHmr4h1iduQ8OvLer52hXt2BvsXaKzc7tiVrGeInOfWByXW7xLU-HS5KU0YwbK7gnBLUy0_mfXMM35qFRvDxnaPdoNp8uX2a0mEgKOzqbfA45ghAUGJRuhCD0bmV1zTzcfC-nqOLNSVPc9BUc_gXbryX6lqmIviI1K3C0grGmcoMxtUQ4reobim_hB64zgtuTFsHmuKDYracft5l2YHyvJmYxKGlxMNAjyf8MEJNhQ7tTygnwpQHVDDqsypMV02Lf0")` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-t from-[#101022] via-[#101022]/40 to-transparent"></div>
                            <div className="relative z-10 w-full px-8 pb-8 md:pb-16 md:px-16">
                                <div className="max-w-4xl">

                                    <h1 className="animate-fade-up mt-24 md:mt-0 text-3xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-8 font-['Trebuchet_MS'] leading-tight">
                                        ¿Quienes <br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">somos?</span>
                                    </h1>
                                    <p className="animate-fade-up max-w-2xl text-sm sm:text-xl text-slate-200 leading-relaxed font-light border-l-2 border-primary pl-4 md:pl-8 ml-2">
                                        En NEWTEX, somos un equipo multidisciplinar de jóvenes profesionales apasionados por la tecnología y la eficiencia operativa. NEWTEX nace de la convicción de que la digitalización no debe ser un lujo, sino una inversión con beneficios medibles ; por ello, nuestra misión es actuar como el puente tecnológico que las PYMES necesitan para liderar la era digital. No solo desarrollamos software, sino que acompañamos a nuestros clientes en su transición hacia la Industria 4.0 con soluciones robustas, escalables y diseñadas para durar.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mx-auto w-full max-w-7xl px-6 lg:px-8 pb-16 md:pb-32">
                        <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 md:grid-cols-4 gap-6">

                            {/* 1. Header */}
                            <div id="catalogo-de-servicios" className="scroll-mt-32 col-span-1 md:col-span-4 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10 animate-fade-up">
                                <div>
                                    <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-white">Catálogo de servicios</h2>
                                    <p className="mt-3 text-sm md:text-lg text-slate-400">Servicios base, soluciones 100% personalizadas.</p>
                                </div>
                                <Link className="group flex items-center gap-2 text-base font-bold text-primary hover:text-white transition-colors" href="/tecnologias">

                                    <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1"></span>
                                </Link>
                            </div>

                            {/* 1. TARJETA HERO SUPERIOR */}
                            <div className="capability-card group glass-panel relative col-span-1 md:col-span-4 overflow-hidden rounded-xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors min-h-[300px]">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50"></div>
                                <div className="relative z-10 max-w-3xl">

                                    <h3 className="text-xl md:text-3xl font-bold text-white mb-4">Consultoría de Procesos</h3>
                                    <p className="text-sm md:text-lg text-slate-300">
                                        Tecnología que se adapta a ti, auditamos tu operativa actual para diseñar un plan de acción que resuelva tus cuellos de botella específicos mediante software construido a medida .
                                    </p>
                                </div>
                            </div>

                            {/* BLOQUE 2 */}

                            {/* 1. TARJETA: Asistente virtual 24/7 */}
                            <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                                <div className="relative z-10">

                                    <h3 className="text-xl md:text-3xl font-bold text-white mb-4">Asistente virtual 24/7</h3>
                                    <p className="text-sm md:text-lg text-slate-300 leading-relaxed">Respuesta inmediata, un chatbot inteligente que captura clientes, resuelve dudas y agenda reuniones mientras tú te enfocas en lo importante.</p>
                                </div>
                            </div>

                            {/* 2. TARJETA: CRM inteligente */}
                            <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                                <div className="relative z-10">

                                    <h3 className="text-xl md:text-3xl font-bold text-white mb-4">CRM inteligente</h3>
                                    <p className="text-sm md:text-lg text-slate-300 leading-relaxed">Vende más a quienes ya te conocen, centraliza tus contactos y automatiza el seguimiento de clientes para que nunca se te escape una oportunidad.</p>
                                </div>
                            </div>

                            {/* 3. TARJETA: Centro de Control de Pedidos */}
                            <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                                <div className="relative z-10">

                                    <h3 className="text-xl md:text-3xl font-bold text-white mb-4">Gestión de Stock y Pedidos</h3>
                                    <p className="text-sm md:text-lg text-slate-300 leading-relaxed">Sincroniza tu inventario en tiempo real con todos tus canales de venta. Elimina las roturas de stock, automatiza el aprovisionamiento y garantiza la trazabilidad total de tu almacén.</p>
                                </div>
                            </div>

                            {/* 4. TARJETA: Documentación Automática */}
                            <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                                <div className="relative z-10">

                                    <h3 className="text-xl md:text-3xl font-bold text-white mb-4">Documentación Automática</h3>
                                    <p className="text-sm md:text-lg text-slate-300 leading-relaxed">De horas de papeleo a un solo clic, genera facturas, presupuestos y contratos personalizados en PDF de forma instantánea y sin errores humanos.</p>
                                </div>
                            </div>

                            {/* 4. SEPARADOR */}
                            <div id="areas-de-impacto" className="scroll-mt-32 col-span-1 md:col-span-2 flex items-end mt-24">
                                <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-white">Áreas de impacto</h2>
                            </div>
                            <div className="hidden md:block col-span-1 md:col-span-2 border-b border-white/10 mb-2 mt-24"></div>

                            {/* TARJETA "Gestión Administrativa" */}
                            <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                                <div className="relative z-10">

                                    <h3 className="text-xl md:text-3xl font-bold text-white mb-4">Gestión Administrativa</h3>
                                    <p className="text-sm md:text-lg text-slate-300 leading-relaxed">Digitalizamos el motor de tu empresa eliminando tareas manuales y papeleo. Automatizamos la creación de facturas, presupuestos y contratos en segundos, centralizando toda tu información para evitar errores humanos.</p>
                                </div>
                            </div>

                            {/* TARJETA "Operaciones y Logística" */}
                            <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                                <div className="relative z-10">

                                    <h3 className="text-xl md:text-3xl font-bold text-white mb-4">Operaciones y Logística</h3>
                                    <p className="text-sm md:text-lg text-slate-300 leading-relaxed">Unificamos tus canales de venta en un solo panel de control digital. Mediante conectores inteligentes, registramos cada pedido en tiempo real, erradicando el caos administrativo y garantizando la trazabilidad total de tu stock.</p>
                                </div>
                            </div>

                            {/* TARJETA "Atención al Cliente" */}
                            <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                                <div className="relative z-10">

                                    <h3 className="text-xl md:text-3xl font-bold text-white mb-4">Atención al Cliente</h3>
                                    <p className="text-sm md:text-lg text-slate-300 leading-relaxed">Implementamos asistentes inteligentes que capturan contactos y agendan reuniones 24/7 de forma autónoma. Automatizamos el seguimiento estratégico de clientes para aumentar tus ventas sin que tengas que intervenir.</p>
                                </div>
                            </div>

                            {/* TARJETA "Estrategia y Toma de Decisiones" */}
                            <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-white/10 hover:border-primary/50 transition-colors">
                                <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                                <div className="relative z-10">

                                    <h3 className="text-xl md:text-3xl font-bold text-white mb-4">Estrategia y Toma de Decisiones.</h3>
                                    <p className="text-sm md:text-lg text-slate-300 leading-relaxed">Detectamos ineficiencias y cuellos de botella mediante auditorías técnicas exhaustivas. Diseñamos soluciones a medida que garantizan un retorno de inversión rápido, permitiéndote gestionar tu negocio basándote en datos reales.</p>
                                </div>
                            </div>

                        </div>
                    </section>

                    {/* CertificadosStrip */}
                    <section className="w-full bg-[#0a0a18] border-y border-white/5 py-16 certs-container">
                        <div className="mx-auto max-w-7xl px-6 lg:px-8">
                            <h3 className="mb-12 text-sm font-bold uppercase tracking-[0.2em] text-slate-500 text-center animate-fade-up">Estándares de Cumplimiento Certificados</h3>
                            <div className="flex flex-wrap items-center justify-center gap-12 md:gap-24">
                                <div className="cert-badge flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                    <span className="material-symbols-outlined text-4xl text-slate-400">Eco</span>
                                    <span className="text-xl font-bold text-slate-300">Green Hosting</span>
                                </div>
                                <div className="cert-badge flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                    <span className="material-symbols-outlined text-4xl text-slate-400">shield</span>
                                    <span className="text-xl font-bold text-slate-300">Microsoft Partner</span>
                                </div>
                                <div className="cert-badge flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                    <span className="material-symbols-outlined text-4xl text-slate-400">lock_person</span>
                                    <span className="text-xl font-bold text-slate-300">IBM Data Science Certified</span>
                                </div>
                                <div className="cert-badge flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                    <span className="material-symbols-outlined text-4xl text-slate-400">local_police</span>
                                    <span className="text-xl font-bold text-slate-300">RGPD</span>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Leadership List */}
                    <section className="mx-auto w-full max-w-7xl px-6 lg:px-8 py-32">
                        <div className="max-w-3xl">
                            <h2 className="text-4xl font-bold tracking-tight text-white mb-16 animate-fade-up">Liderazgo Ejecutivo</h2>
                            <div className="divide-y divide-white/10">
                                {[
                                    {
                                        name: "Daniel Conde",
                                        role: "Co-Founder & CPO",
                                        url: "https://www.linkedin.com/in/daniel-conde-newtex/"
                                    },
                                    {
                                        name: "Lucas De Alba",
                                        role: "Co-Founder & COO",
                                        url: "https://www.linkedin.com/in/lucas-de-alba-b72427360/"
                                    },
                                    {
                                        name: "Carlos Morato",
                                        role: "Co-Founder & LSA",
                                        url: "https://www.linkedin.com/in/carlos-morato-sanguino-295518200/"
                                    },
                                ].map((leader, i) => (
                                    <a
                                        key={i}
                                        href={leader.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="leader-item group flex items-center justify-between py-8 transition-colors hover:bg-white/5 px-6 rounded-xl -mx-6 cursor-pointer"
                                    >
                                        <div>
                                            <p className="text-xl font-bold text-white group-hover:text-[#0a66c2] transition-colors">{leader.name}</p>
                                            <p className="text-base text-slate-500 mt-1 font-mono text-xs uppercase tracking-wider">{leader.role}</p>
                                        </div>
                                        <div className="size-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0 group-hover:border-[#0a66c2]/50 group-hover:bg-[#0a66c2]/10">
                                            {/* Icono SVG oficial de LinkedIn */}
                                            <svg className="w-5 h-5 text-slate-300 group-hover:text-[#0a66c2] transition-colors" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                            </svg>
                                        </div>
                                    </a>
                                ))}
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="w-full border-t border-white/10 bg-black/80 backdrop-blur-md relative z-50">
                    <div className="mx-auto max-w-7xl px-5 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-4">
                            <span className="text-sm text-gray-400">© {new Date().getFullYear()} NEWTEX — Todos los derechos reservados</span>
                        </div>
                        <div className="flex items-center gap-6 text-xs font-medium text-[#00CFFF]">
                            <span>+34 608 77 10 56</span>
                            <span>C. Río Jaranda 7, 10004, Cáceres</span>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Informacion;