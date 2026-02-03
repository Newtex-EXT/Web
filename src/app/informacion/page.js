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
        <div ref={mainRef} className="relative flex min-h-screen w-full flex-col overflow-x-hidden bg-black text-white font-sans selection:bg-primary/30">
            {/* Background */}
            <div className="fixed inset-0 pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-blue-900/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40vw] h-[40vw] bg-primary/10 rounded-full blur-[100px]"></div>
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
            </div>

            {/* Navigation */}
            <header className="fixed top-0 z-50 w-full mx-auto flex items-center justify-between pl-5 pr-5 py-3 transition-colors duration-300 bg-black/50 backdrop-blur-sm border-b border-white/5">
                <Link href="/">
                    <Logo className="w-auto h-12 text-blue-900 mt-2" />
                </Link>
                <div className="hidden md:flex flex-row items-center justify-center space-x-4">
                    <Link href="/#inicio" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Inicio</Link>
                    <Link href="/#features" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Features</Link>
                    <Link href="/#tecnologias" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Tecnologias</Link>
                    <Link href="/#proceso" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Proceso</Link>
                    <Link href="/Contacto" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Contacto</Link>
                    <Link href="/solicitud" className="flex h-10 px-6 items-center justify-center rounded-lg bg-primary hover:bg-[#33d9ff] text-[#0f2024] text-sm font-bold shadow-[0_0_15px_rgba(0,208,255,0.3)] transition-all">
                        Solicitar Demo
                    </Link>
                </div>
            </header>

            <main className="relative z-10 flex-1 pt-24">
                {/* Hero */}
                <section className="relative mx-auto w-full max-w-7xl px-6 lg:px-8 pt-12 pb-24">
                    <div className="relative overflow-hidden rounded-2xl bg-slate-900 border border-white/10 shadow-2xl shadow-primary/10 group h-[650px] flex items-end">
                        <div
                            ref={heroBgRef}
                            className="absolute inset-0 bg-cover bg-center opacity-60 mix-blend-overlay scale-110"
                            role="img"
                            aria-label="Visualización abstracta del núcleo digital con flujos de datos azules"
                            style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCnrH62nMNc_wHmr4h1iduQ8OvLer52hXt2BvsXaKzc7tiVrGeInOfWByXW7xLU-HS5KU0YwbK7gnBLUy0_mfXMM35qFRvDxnaPdoNp8uX2a0mEgKOzqbfA45ghAUGJRuhCD0bmV1zTzcfC-nqOLNSVPc9BUc_gXbryX6lqmIviI1K3C0grGmcoMxtUQ4reobim_hB64zgtuTFsHmuKDYracft5l2YHyvJmYxKGlxMNAjyf8MEJNhQ7tTygnwpQHVDDqsypMV02Lf0")` }}
                        ></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#101022] via-[#101022]/40 to-transparent"></div>
                        <div className="relative z-10 w-full px-8 pb-16 md:px-16">
                            <div className="max-w-4xl">

                                <h1 className="animate-fade-up text-6xl font-black tracking-tighter text-white sm:text-7xl md:text-8xl lg:text-9xl mb-10 font-['Trebuchet_MS'] leading-[0.9]">
                                    ¿Quienes <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">somos?</span>
                                </h1>
                                <p className="animate-fade-up max-w-2xl text-xl text-slate-200 leading-relaxed font-light border-l-2 border-primary pl-8 ml-2">
                                    En NEWTEX, somos un equipo multidisciplinar de jóvenes profesionales apasionados por la tecnología y la eficiencia operativa. NEWTEX nace de la convicción de que la digitalización no debe ser un lujo, sino una inversión con beneficios medibles ; por ello, nuestra misión es actuar como el puente tecnológico que las PYMES necesitan para liderar la era digital. No solo desarrollamos software, sino que acompañamos a nuestros clientes en su transición hacia la Industria 4.0 con soluciones robustas, escalables y diseñadas para durar.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-7xl px-6 lg:px-8 pb-32">
                    <div className="grid auto-rows-[minmax(180px,auto)] grid-cols-1 md:grid-cols-4 gap-6">

                        {/* 1. Header */}
                        <div id="catalogo-de-servicios" className="col-span-1 md:col-span-4 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/10 animate-fade-up">
                            <div>
                                <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Catálogo de servicios</h2>
                                <p className="mt-3 text-lg text-slate-400">Servicios base, soluciones 100% personalizadas.</p>
                            </div>
                            <Link className="group flex items-center gap-2 text-base font-bold text-primary hover:text-white transition-colors" href="/tecnologias">

                                <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1"></span>
                            </Link>
                        </div>

                        {/* 1. TARJETA HERO SUPERIOR */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-4 overflow-hidden rounded-xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors min-h-[300px]">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50"></div>
                            <div className="relative z-10 max-w-3xl">

                                <h3 className="text-3xl font-bold text-white mb-4">Consultoría de Procesos</h3>
                                <p className="text-lg text-slate-300">
                                    Nuestra plataforma elimina los silos de datos conectando tu ERP, CRM y sistemas legacy en una única fuente de verdad en tiempo real. Diseñada para soportar cargas de trabajo críticas sin latencia.
                                </p>
                            </div>
                        </div>

                        {/* BLOQUE 2 */}

                        {/* 1. TARJETA: Asistente virtual 24/7 */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                            <div className="relative z-10">

                                <h3 className="text-3xl font-bold text-white mb-4">Asistente virtual 24/7</h3>
                                <p className="text-lg text-slate-300 leading-relaxed">Respuesta inmediata, un chatbot inteligente que captura clientes, resuelve dudas y agenda reuniones mientras tú te enfocas en lo importante.</p>
                            </div>
                        </div>

                        {/* 2. TARJETA: CRM inteligente */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                            <div className="relative z-10">

                                <h3 className="text-3xl font-bold text-white mb-4">CRM inteligente</h3>
                                <p className="text-lg text-slate-300 leading-relaxed">Vende más a quienes ya te conocen, centraliza tus contactos y automatiza el seguimiento de clientes para que nunca se te escape una oportunidad.</p>
                            </div>
                        </div>

                        {/* 3. TARJETA: Centro de Control de Pedidos */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                            <div className="relative z-10">

                                <h3 className="text-3xl font-bold text-white mb-4">Centro de Control de Pedidos</h3>
                                <p className="text-lg text-slate-300 leading-relaxed">Adiós al caos administrativo. Unificamos todos tus canales de venta en un solo panel para eliminar errores manuales y agilizar toda tu logística.</p>
                            </div>
                        </div>

                        {/* 4. TARJETA: Documentación Automática */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                            <div className="relative z-10">

                                <h3 className="text-3xl font-bold text-white mb-4">Documentación Automática</h3>
                                <p className="text-lg text-slate-300 leading-relaxed">De horas de papeleo a un solo clic, genera facturas, presupuestos y contratos personalizados en PDF de forma instantánea y sin errores humanos.</p>
                            </div>
                        </div>

                        {/* 4. SEPARADOR */}
                        <div id="areas-de-impacto" className="col-span-1 md:col-span-2 flex items-end mt-24">
                            <h2 className="text-3xl font-bold tracking-tight text-white">Áreas de impacto</h2>
                        </div>
                        <div className="hidden md:block col-span-1 md:col-span-2 border-b border-white/10 mb-2 mt-24"></div>

                        {/* TARJETA "Gestión Administrativa" */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                            <div className="relative z-10">

                                <h3 className="text-3xl font-bold text-white mb-4">Gestión Administrativa</h3>
                                <p className="text-lg text-slate-300 leading-relaxed">Digitalizamos el motor de tu empresa eliminando tareas manuales y papeleo. Automatizamos la creación de facturas, presupuestos y contratos en segundos, centralizando toda tu información para evitar errores humanos.</p>
                            </div>
                        </div>

                        {/* TARJETA "Operaciones y Logística" */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                            <div className="relative z-10">

                                <h3 className="text-3xl font-bold text-white mb-4">Operaciones y Logística</h3>
                                <p className="text-lg text-slate-300 leading-relaxed">Unificamos tus canales de venta en un solo panel de control digital. Mediante conectores inteligentes, registramos cada pedido en tiempo real, erradicando el caos administrativo y garantizando la trazabilidad total de tu stock.</p>
                            </div>
                        </div>

                        {/* TARJETA "Atención al Cliente" */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-primary/20 hover:border-primary/50 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                            <div className="relative z-10">

                                <h3 className="text-3xl font-bold text-white mb-4">Atención al Cliente</h3>
                                <p className="text-lg text-slate-300 leading-relaxed">Implementamos asistentes inteligentes que capturan contactos y agendan reuniones 24/7 de forma autónoma. Automatizamos el seguimiento estratégico de clientes para aumentar tus ventas sin que tengas que intervenir.</p>
                            </div>
                        </div>

                        {/* TARJETA "Estrategia y Toma de Decisiones" */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 overflow-hidden rounded-2xl p-8 md:p-10 flex flex-col justify-center border border-white/10 hover:border-primary/50 transition-colors">
                            <div className="absolute inset-0 bg-gradient-to-r from-primary/10 via-transparent to-transparent opacity-50 pointer-events-none"></div>
                            <div className="relative z-10">

                                <h3 className="text-3xl font-bold text-white mb-4">Estrategia y Toma de Decisiones.</h3>
                                <p className="text-lg text-slate-300 leading-relaxed">Detectamos ineficiencias y cuellos de botella mediante auditorías técnicas exhaustivas. Diseñamos soluciones a medida que garantizan un retorno de inversión rápido, permitiéndote gestionar tu negocio basándote en datos reales.</p>
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
                                <span className="material-symbols-outlined text-4xl text-slate-400">verified_user</span>
                                <span className="text-xl font-bold text-slate-300">ISO 27001</span>
                            </div>
                            <div className="cert-badge flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <span className="material-symbols-outlined text-4xl text-slate-400">shield</span>
                                <span className="text-xl font-bold text-slate-300">SOC 2 Type II</span>
                            </div>
                            <div className="cert-badge flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <span className="material-symbols-outlined text-4xl text-slate-400">lock_person</span>
                                <span className="text-xl font-bold text-slate-300">GDPR Compliant</span>
                            </div>
                            <div className="cert-badge flex items-center gap-3 grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                                <span className="material-symbols-outlined text-4xl text-slate-400">local_police</span>
                                <span className="text-xl font-bold text-slate-300">FedRAMP High</span>
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
                                { name: "Daniel Conde", role: "CEO" },
                                { name: "Lucas De Alba", role: "CEO" },
                                { name: "Carlos Morato", role: "CEO" },
                            ].map((leader, i) => (
                                <div key={i} className="leader-item group flex items-center justify-between py-8 transition-colors hover:bg-white/5 px-6 rounded-xl -mx-6 cursor-default">
                                    <div>
                                        <p className="text-xl font-bold text-white group-hover:text-primary transition-colors">{leader.name}</p>
                                        <p className="text-base text-slate-500 mt-1">{leader.role}</p>
                                    </div>
                                    <div className="size-10 rounded-full border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all transform translate-x-4 group-hover:translate-x-0">
                                        <span className="material-symbols-outlined text-slate-300">chevron_right</span>
                                    </div>
                                </div>
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
                        <span>C. Roa Bastos, 10005 Cáceres</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default Informacion;