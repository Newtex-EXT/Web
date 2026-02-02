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
            {/* Background Decor */}
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
                    <Link href="/#sectores" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Servicios</Link>
                    <Link href="/Contacto" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors text-sm font-medium">Contacto</Link>
                    <Link href="/solicitud" className="flex h-10 px-6 items-center justify-center rounded-lg bg-primary hover:bg-[#33d9ff] text-[#0f2024] text-sm font-bold shadow-[0_0_15px_rgba(0,208,255,0.3)] transition-all">
                        Solicitar Demo
                    </Link>
                </div>
            </header>

            <main className="relative z-10 flex-1 pt-24">
                {/* Hero Section */}
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
                                <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold uppercase tracking-wider text-blue-300 animate-fade-up">
                                    <span className="relative flex h-2 w-2">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75"></span>
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-primary"></span>
                                    </span>
                                    Infraestructura Next Gen
                                </div>
                                <h1 className="animate-fade-up text-6xl font-black tracking-tighter text-white sm:text-7xl md:text-8xl lg:text-9xl mb-10 font-['Trebuchet_MS'] leading-[0.9]">
                                    El Motor <br />
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-500">Digital Central</span>
                                </h1>
                                <p className="animate-fade-up max-w-2xl text-xl text-slate-300 leading-relaxed font-light border-l-2 border-primary pl-8 ml-2">
                                    NEWTEX diseña la columna vertebral invisible de la empresa moderna. Proporcionamos la densidad computacional y la arquitectura de datos soberana requerida para la inteligencia del mañana.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Bento Grid Capabilities */}
                <section className="mx-auto w-full max-w-7xl px-6 lg:px-8 pb-32">
                    <div className="mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-8 animate-fade-up">
                        <div>
                            <h2 className="text-4xl font-bold tracking-tight text-white sm:text-5xl">Capacidades del Sistema</h2>
                            <p className="mt-3 text-lg text-slate-400">Soluciones empresariales modulares diseñadas para escalar.</p>
                        </div>
                        <Link className="group flex items-center gap-2 text-base font-bold text-primary hover:text-white transition-colors" href="/tecnologias">
                            Ver Especificaciones
                            <span className="material-symbols-outlined text-[20px] transition-transform group-hover:translate-x-1">arrow_forward</span>
                        </Link>
                    </div>

                    <div className="grid auto-rows-[minmax(280px,auto)] grid-cols-1 md:grid-cols-4 gap-8">
                        {/* Large Card 1 */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 row-span-2 overflow-hidden rounded-2xl p-10 border border-white/10 bg-white/5 hover:border-primary/50 transition-all duration-300 flex flex-col justify-between">
                            <div className="absolute right-0 top-0 h-full w-2/3 bg-gradient-to-l from-primary/10 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>
                            <div className="relative z-10">
                                <div className="mb-6 inline-flex size-14 items-center justify-center rounded-xl bg-white/5 border border-white/10 shadow-inner">
                                    <span className="material-symbols-outlined text-4xl text-white">memory</span>
                                </div>
                                <h3 className="text-3xl font-bold text-white mb-2">Unidades de Procesamiento Neuronal</h3>
                                <p className="text-lg text-slate-300 leading-relaxed max-w-md">
                                    Arquitectura de silicio propietaria optimizada para LLMs e inferencia en tiempo real en el borde. Nuestros clústeres NPU ofrecen un 40% más de eficiencia por vatio.
                                </p>
                            </div>
                            <div className="relative z-10 mt-10">
                                <div
                                    className="h-56 w-full rounded-xl bg-slate-800/50 border border-white/5 bg-cover bg-center shadow-2xl"
                                    role="img"
                                    aria-label="Primer plano de chip informático futurista"
                                    style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuDIHagUzwpt5CxKcyz0Jr0SFDdAZLWHkYrU5b67-bu7lXUy6Aop-M_5wn_jFxSkxdt1RDOkIfywWe7yF19gf0aksOqOrt-qKeBy4IIO7O2MtVuSi_fPCZQ2KEJcfH9aCqp0fZb-cj-48CdxkPHMk-9ZhteEv9KOGusFX_THOuqOs1NuGPfI5DgCDdGZnJuPmCkKKZx5zvrMdSJI1w7a3xXTQKWD-rIdfBxz9xkcREWE44SDPKiGicLd62quaysRYUoREoFZQgLq9yw")` }}
                                ></div>
                            </div>
                        </div>

                        {/* Medium Card 2 */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-1 row-span-1 overflow-hidden rounded-2xl p-8 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex flex-col h-full justify-between gap-4">
                                <span className="material-symbols-outlined text-5xl text-primary">security</span>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Grid Zero-Trust</h3>
                                    <p className="text-base text-slate-400 leading-snug">Protocolos de encriptación resistentes a cuántica integrados en hardware.</p>
                                </div>
                            </div>
                        </div>

                        {/* Medium Card 3 */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-1 row-span-1 overflow-hidden rounded-2xl p-8 border border-white/10 bg-white/5 hover:bg-white/10 transition-colors">
                            <div className="flex flex-col h-full justify-between gap-4">
                                <span className="material-symbols-outlined text-5xl text-primary">globe</span>
                                <div>
                                    <h3 className="text-xl font-bold text-white mb-2">Global Edge</h3>
                                    <p className="text-base text-slate-400 leading-snug">Latencia inferior a 5ms en centros financieros vía fibra privada.</p>
                                </div>
                            </div>
                        </div>

                        {/* Wide Card 4 */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 row-span-1 overflow-hidden rounded-2xl p-8 border border-white/10 bg-white/5 hover:border-primary/50 transition-colors flex items-center">
                            <div className="grid grid-cols-2 w-full gap-8 items-center">
                                <div>
                                    <h3 className="text-2xl font-bold text-white mb-4">Analítica Cognitiva</h3>
                                    <p className="text-slate-400 text-base mb-6 leading-relaxed">Síntesis de datos en tiempo real para sistemas de soporte a la decisión.</p>
                                    <button className="text-xs font-bold uppercase tracking-widest text-white border-b border-primary pb-1 hover:border-white transition-colors">
                                        Más Información
                                    </button>
                                </div>
                                <div
                                    className="h-full min-h-[160px] w-full rounded-xl bg-cover bg-center opacity-80 border border-white/5"
                                    role="img"
                                    aria-label="Gráfico de visualización de datos abstracto"
                                    style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCbpnETTWVn1ukDa8g9Mo2_6gsZbJqkOs8Dq--KGMM4bCc64GB22EisNaWw7Xi8FiavVfY0BdtQHDkJSl3IWqJcKXV0YSOcWDyWAAmaHh1t0B7twpzdqc_6xQ5UHTFL3vSaF0Vbn-4H3HKQLocBtHsNcDiMYL7mYyULPWFpRUlK81SSrZfmAk0J2nsgN1nDiqJIYFpu7wOCKbF8luLp8v4RYy_6nxkCyM_P0yS4Jm4uo_Zq-WgUrhstXg4xs8UAnvzGo4wci088RqY")` }}
                                ></div>
                            </div>
                        </div>

                        {/* Tall Card 5 */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-1 row-span-2 overflow-hidden rounded-2xl p-0 border border-white/10 bg-white/5 hover:border-primary/50 transition-colors">
                            <div
                                className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
                                role="img"
                                aria-label="Pasillo de racks de servidores"
                                style={{ backgroundImage: `url("https://lh3.googleusercontent.com/aida-public/AB6AXuCOqJ_FY818fnqhDkTmWsxFPiRHd_l8V59FgT2kskW7rht5-qw-8Rm5dJN12nwbnh6PX6BdwZLGugD4t1eV8aLJfQrVt3_sSGj0sj5otJr03xN5yRxDNIkstTpccENiCQjqNbHrtOEywAMJzGgc0inD77AIhW4ds_nfQsZhKy511ytWTKwEoogNGJX8gH8hIFxPulQ7rZf8cVu5urB9dWXrmvIXORkN_VT9ICaQLW_Jd69lsWRKIG9axFtw031Civ1W8jrquTBLt6I")` }}
                            >
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent"></div>
                            </div>
                            <div className="relative z-10 flex h-full flex-col justify-end p-8">
                                <h3 className="text-2xl font-bold text-white mb-3">Green Data</h3>
                                <p className="text-base text-slate-300 leading-snug">Compromiso de energía 100% renovable para todas las instalaciones Tier 4.</p>
                            </div>
                        </div>

                        {/* Small Card 6 */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-1 row-span-1 overflow-hidden rounded-2xl p-8 border border-white/10 bg-white/5 flex flex-col justify-center items-center text-center hover:bg-white/10 transition-colors">
                            <div className="text-5xl font-black text-white mb-2">99.999%</div>
                            <div className="text-xs uppercase tracking-widest text-primary font-bold">Garantía de Uptime</div>
                        </div>

                        {/* Small Card 7 */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-1 row-span-1 overflow-hidden rounded-2xl p-8 border border-white/10 bg-white/5 flex flex-col justify-center items-center text-center hover:bg-white/10 transition-colors">
                            <div className="text-5xl font-black text-white mb-2">24/7</div>
                            <div className="text-xs uppercase tracking-widest text-primary font-bold">Monitorización NOC</div>
                        </div>

                        {/* Wide Footer Card 8 */}
                        <div className="capability-card group glass-panel relative col-span-1 md:col-span-2 row-span-1 overflow-hidden rounded-2xl px-10 py-8 border border-white/10 bg-white/5 flex items-center justify-between hover:border-primary/50 transition-colors">
                            <div>
                                <div className="text-sm font-semibold text-primary uppercase tracking-wider mb-2">Caso de Estudio</div>
                                <div className="text-xl font-bold text-white">Migración Vertex Financial</div>
                            </div>
                            <div className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/5 text-white transition-transform group-hover:rotate-45 group-hover:bg-primary group-hover:border-primary group-hover:text-black">
                                <span className="material-symbols-outlined text-2xl">arrow_outward</span>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Certifications Strip */}
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