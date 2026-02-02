"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Lenis from 'lenis';
import dynamic from 'next/dynamic';
import Logo from "@/components/Logo";
import PhoneMockup from "@/components/PhoneMockup";
import logger from "@/utils/logger";

const ThreeCanvas = dynamic(() => import('@/components/ThreeCanvas'), {
  ssr: false,
  loading: () => <div className="fixed top-0 left-0 -z-10 h-full w-full bg-black" />
});

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const brands = [
  { name: "Empresa A", color: "#00CFFF" },
  { name: "Empresa B", color: "#FF0055" },
  { name: "Empresa C", color: "#00FFaa" },
  { name: "Empresa D", color: "#FFaa00" },
  { name: "Empresa E", color: "#aa00FF" },
  { name: "Empresa F", color: "#00CFFF" },
];

export default function Home() {
  const pathname = usePathname();
  const isContactPage = pathname === "/Contacto";
  const mainRef = useRef(null);

  const [threeCtx, setThreeCtx] = useState(null);

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smooth: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleScrollTo = (id) => {
    if (id.startsWith("#")) {
      const triggerId = id.replace("#", "");
      const trigger = ScrollTrigger.getById(triggerId);
      if (trigger) {
        gsap.to(window, {
          duration: 1.5,
          scrollTo: { y: trigger.start, offsetY: 0 },
          ease: "power3.inOut"
        });
        return;
      }
    }

    const element = document.querySelector(id);
    if (element) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: element, offsetY: 0 },
        ease: "power3.inOut"
      });
    }
  };

  useLayoutEffect(() => {
    if (!threeCtx) return;

    logger.info("Initializing GSAP Timeline with Three.js Context");

    if (typeof window !== "undefined") {
      window.scrollTo(0, 0);
      setTimeout(() => {
        window.scrollTo(0, 0);
        ScrollTrigger.refresh();
      }, 50);
      if (window.history) {
        window.history.scrollRestoration = 'manual';
      }
    }
    ScrollTrigger.getAll().forEach(trigger => trigger.kill());

    let ctx = gsap.context(() => {
      const {
        planetGroup, rimUniforms, distantGlow, globePoints, constellation,
        connectionsGrid, gridMaterial, nebulaMaterial,
        setGlowInTransit, initialGlowPosition
      } = threeCtx;

      if (window.scrollY > 0) {
        gsap.set(".hero-title, .hero-subtitle", { opacity: 0, visibility: "hidden", overwrite: "auto" });
      } else {
        gsap.set(".hero-title, .hero-subtitle", { opacity: 1, visibility: "visible", y: 0 });
      }
      ScrollTrigger.refresh();

      const handleResize = () => {
      };
      window.addEventListener('resize', handleResize);

      const pinConfig = { start: "top top", scrub: 1, pin: true, anticipatePin: 1 };

      gsap.timeline({ scrollTrigger: { trigger: ".hero-section", end: "+=600%", ...pinConfig, id: "inicio" } });
      gsap.timeline({ scrollTrigger: { trigger: ".features-section", end: "+=1200%", ...pinConfig, id: "features" } });
      gsap.timeline({ scrollTrigger: { trigger: ".tech-section", end: "+=1200%", ...pinConfig, id: "tecnologias" } });
      gsap.timeline({ scrollTrigger: { trigger: ".process-section", end: "+=1200%", ...pinConfig, id: "proceso" } });
      gsap.timeline({ scrollTrigger: { trigger: ".sectors-section", end: "+=1400%", ...pinConfig, id: "sectores" } });
      gsap.timeline({ scrollTrigger: { trigger: ".cta-section", end: "+=100%", ...pinConfig, id: "contacto" } });

      const introTl = gsap.timeline();
      gsap.set(".hero-title, .hero-subtitle, .fade-in, .sector-card, .tech-card", {
        rotation: 0.01, z: 0.1, force3D: true
      });
      introTl
        .fromTo(".hero-section .hero-title",
          { opacity: 0, scale: 0.8, y: 50 },
          { opacity: 1, scale: 1, y: 0, duration: 1.5, ease: "power3.out", force3D: true }
        )
        .fromTo(".hero-section .hero-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out", force3D: true },
          "-=1"
        );

      gsap.set(".features-section .fade-in", { opacity: 0, y: 50, rotation: 0.01 });
      gsap.set(".phone-image", { opacity: 0, x: 100 });
      gsap.set(".tech-section .fade-in", { opacity: 0, rotation: 0.01 });
      gsap.set(".tech-card", { opacity: 0, y: 50, rotation: 0.01 });
      gsap.set(".process-section .fade-in", { opacity: 0, y: 50, rotation: 0.01 });
      gsap.set(".sectors-section .fade-in", { opacity: 0, rotation: 0.01 });
      gsap.set(".sector-card", { opacity: 0, y: 50, rotation: 0.01 });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: mainRef.current, start: "top top", end: "bottom bottom", scrub: 1 }
      });

      tl.to({}, { duration: 0.5 })
        // 1. Hero Out / Features In
        .to(".hero-section .text-center > *", { opacity: 0, duration: 2, ease: "power2.in", force3D: true, overwrite: "auto" })
        .to(planetGroup.position, { x: -4, y: 0, duration: 3, ease: "power2.inOut", force3D: true }, "<")
        .to(planetGroup.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 3, ease: "power2.inOut", force3D: true }, "<")
        .to(rimUniforms.uRimColor.value, {
          r: 0.05, g: 0.03, b: 0.005,
          duration: 3,
          ease: "power2.inOut",
          onReverseComplete: () => {
            rimUniforms.uRimColor.value.setRGB(0.85, 0.45, 0.1);
          }
        }, "<")
        .to(".features-section .fade-in", { opacity: 1, y: 0, rotation: 0.01, stagger: 0.2, duration: 3, force3D: true }, "-=2")
        .to(".phone-image", { opacity: 1, x: 0, duration: 3, ease: "power2.out", force3D: true }, "-=2")
        .fromTo(planetGroup.rotation, { y: -Math.PI / 4, z: -Math.PI / 3 }, { y: Math.PI / 4, z: Math.PI / 3, duration: 3, ease: "power3.inOut" }, "-=2")

        .to({}, { duration: 25 })

        // 2. Features Out / Tecnologias In 
        .to(".features-section .fade-in", { opacity: 0, stagger: -0.1, duration: 2, force3D: true })
        .to(".phone-image", { opacity: 0, x: 100, duration: 2, ease: "power2.in", force3D: true }, "<")
        .to(planetGroup.rotation, { z: 0, y: 0, duration: 0.1 }, "<")
        .to(planetGroup.scale, { x: 0, y: 0, z: 0, duration: 2, ease: "power2.in", force3D: true })

        // Grid tecnologias
        .call(() => { connectionsGrid.visible = true; })
        .fromTo(connectionsGrid.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 3, ease: "power2.out", force3D: true }, "<")
        .fromTo(connectionsGrid.position, { z: -20 }, { z: -5, duration: 3, ease: "power2.out", force3D: true }, "<")
        .to(gridMaterial.uniforms.uOpacity, { value: 0.3, duration: 2 }, "<")

        // Tecnologias Content In
        .to(".tech-section .fade-in", { opacity: 1, duration: 3, rotation: 0.01, force3D: true }, "<")
        .to(".tech-card", { opacity: 1, y: 0, rotation: 0.01, stagger: 0.2, duration: 3, force3D: true }, "<")

        .to({}, { duration: 25 })

        // 3. Tecnologias Out / Proceso In
        .to(".tech-section .fade-in", { opacity: 0, duration: 1, force3D: true })
        .to(".tech-card", { opacity: 0, stagger: -0.05, duration: 1, force3D: true }, "<")

        .to(gridMaterial.uniforms.uOpacity, { value: 0, duration: 1.5 }, "<")
        .to(connectionsGrid.scale, { x: 0, y: 0, z: 0, duration: 1.5, onComplete: () => { connectionsGrid.visible = false; } }, "<")

        // Constelacion
        .to(distantGlow.position, { x: 0, y: 0, z: -5, duration: 4, ease: "power2.inOut", onStart: () => { setGlowInTransit(true); } })
        .to(distantGlow.scale, { x: 6, y: 6, z: 6, duration: 4, ease: "power2.inOut" }, "<")
        .to(distantGlow.material, { opacity: 0.6, duration: 4, ease: "power2.in" }, "<")

        // Proceso content
        .to(".process-section .fade-in", { opacity: 1, y: 0, rotation: 0.01, stagger: 0.2, duration: 3, force3D: true }, "-=2")

        .to({}, { duration: 15 })

        // Transicion glow
        .to(distantGlow.material, { opacity: 0, duration: 2, ease: "power2.out" })
        .set(globePoints, { visible: true }, "<")
        .set(constellation, { visible: true }, "<")
        .fromTo(globePoints.scale, { x: 0, y: 0, z: 0 }, { x: 0.65, y: 0.65, z: 0.65, duration: 3, ease: "power3.out", force3D: true }, "<")
        .fromTo(constellation.scale, { x: 0, y: 0, z: 0 }, { x: 0.8, y: 0.8, z: 0.8, duration: 3, ease: "power3.out", force3D: true }, "<")
        .fromTo(constellation.children[0].material, { opacity: 0 }, { opacity: 0.5, duration: 2, ease: "power2.out" }, "<0.5")
        .fromTo(constellation.children[1].material, { opacity: 0 }, { opacity: 0.3, duration: 2, ease: "power2.out" }, "<0.5")

        .to({}, { duration: 15 })

        // 4. Proceso Out / Sectores In 
        .to(".process-section .fade-in", { opacity: 0, stagger: -0.1, duration: 2, force3D: true })
        .to(globePoints.scale, { x: 0, y: 0, z: 0, duration: 2, ease: "power2.in", force3D: true }, "<")
        .to(constellation.scale, { x: 0, y: 0, z: 0, duration: 2, ease: "power2.in", force3D: true }, "<")
        .to(constellation.children[0].material, { opacity: 0, duration: 2 }, "<")
        .to(constellation.children[1].material, { opacity: 0, duration: 2 }, "<")
        .call(() => {
          globePoints.visible = false;
          constellation.visible = false;
          distantGlow.position.set(initialGlowPosition.x, initialGlowPosition.y, initialGlowPosition.z);
          distantGlow.scale.set(1.5, 1.5, 1.5);
          distantGlow.material.opacity = 0.2;
          setGlowInTransit(false);
        })

        .to(".sectors-section .fade-in", { opacity: 1, rotation: 0.01, duration: 2, force3D: true })
        .to(".sector-card", { opacity: 1, y: 0, rotation: 0.01, stagger: 0.2, duration: 2, force3D: true }, "<")

        //5. Sectores Out / CTA In 
        .to({}, { duration: 25 })

        .to(".sectors-section .fade-in", { opacity: 0, duration: 1.5, force3D: true })
        .to(".sector-card", { opacity: 0, stagger: -0.1, duration: 1.5, force3D: true }, "<")

        .to({}, { duration: 15 });

      const tlCTA = gsap.timeline({
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top 80%",
          end: "+=100%",
          toggleActions: "play none none reverse"
        }
      });

      tlCTA
        .fromTo(".cta-title",
          { opacity: 0, scale: 0.9, rotation: 0.01 },
          { opacity: 1, scale: 1, duration: 1, rotation: 0.01, force3D: true }
        )
        .fromTo(".cta-text",
          { opacity: 0, y: 20, rotation: 0.01 },
          { opacity: 1, y: 0, duration: 1, rotation: 0.01, force3D: true },
          "-=0.5"
        )
        .fromTo(".cta-brands-slider",
          { opacity: 0, y: 30, rotation: 0.01 },
          { opacity: 1, y: 0, duration: 1, rotation: 0.01, force3D: true },
          "-=0.5"
        )
        .fromTo(".cta-button",
          { opacity: 0, scale: 0.8, rotation: 0.01 },
          { opacity: 1, scale: 1, duration: 0.5, rotation: 0.01, ease: "back.out(1.7)", force3D: true },
          "-=0.5"
        );

      gsap.to(".logo-track", {
        xPercent: -50,
        ease: "none",
        duration: 50,
        repeat: -1,
        force3D: true
      });

    }, mainRef);

    return () => { ctx.revert(); };
  }, [isContactPage, threeCtx]);

  return (
    <div ref={mainRef}>
      <ThreeCanvas onContextCreated={setThreeCtx} isContactPage={isContactPage} />

      <main className="flex min-h-screen flex-col text-white">

        <header className="fixed top-0 z-50 w-full mx-auto flex items-center justify-between pl-5 pr-5 py-3 transition-colors duration-300 bg-black/50 backdrop-blur-sm">
          <Logo className="w-auto h-12 text-blue-900 mt-2" />
          <div className="md:flex md:flex-row flex-col items-center justify-center md:space-x-4">
            <button onClick={() => handleScrollTo("#inicio")} className="py-2 px-3 block hover:text-[#00CFFF]">Inicio</button>
            <button onClick={() => handleScrollTo("#features")} className="py-2 px-3 block hover:text-[#00CFFF]">Features</button>
            <button onClick={() => handleScrollTo("#tecnologias")} className="py-2 px-3 block hover:text-[#00CFFF]">Tecnología</button>
            <button onClick={() => handleScrollTo("#proceso")} className="py-2 px-3 block hover:text-[#00CFFF]">Proceso</button>
            <button onClick={() => handleScrollTo("#sectores")} className="py-2 px-3 block hover:text-[#00CFFF]">Servicios</button>
            <button onClick={() => handleScrollTo("#contacto")} className="py-2 px-3 block hover:text-[#00CFFF]">Contacto</button>
            <Link href="/solicitud" className="flex h-10 px-6 items-center justify-center rounded-lg bg-primary hover:bg-[#33d9ff] text-[#0f2024] text-sm font-bold shadow-[0_0_15px_rgba(0,208,255,0.3)] transition-all">
              Solicitar Demo
            </Link>
          </div>
        </header>

        <section id="inicio" className="hero-section min-h-screen relative w-full overflow-hidden">
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center z-10">
            <h1 className="text-6xl font-extrabold hero-title will-change-transform" style={{ fontFamily: "'Trebuchet MS', sans-serif", backfaceVisibility: 'hidden' }}>NEWTEX</h1>
            <p className="mt-4 text-lg text-gray-200 hero-subtitle will-change-transform" style={{ backfaceVisibility: 'hidden' }}>Automatización a Medida</p>
          </div>
        </section>

        <section id="features" className="features-section min-h-screen flex items-center overflow-hidden">
          <div className="mx-auto max-w-6xl w-full px-4 grid md:grid-cols-2 items-center gap-12">
            <div className="max-w-md">
              <h2 className="text-4xl font-bold fade-in will-change-transform" style={{ backfaceVisibility: 'hidden' }}>Rápido. Fiable. Seguro.</h2>
              <p className="mt-4 text-lg text-gray-300 fade-in will-change-transform" style={{ backfaceVisibility: 'hidden' }}>Soluciones diseñadas para optimizar tus procesos sin comprometer la seguridad ni la calidad.</p>
              <div className="mt-8 fade-in will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                <button onClick={() => handleScrollTo("#proceso")} className="rounded px-5 py-3 font-semibold ring-1 ring-white/30 hover:bg-[#00CFFF] hover:text-black">
                  Nuestro Proceso
                </button>
              </div>
            </div>
            <div className="phone-image opacity-0 will-change-transform flex justify-center scale-[0.85] origin-center translate-y-[-20px]" style={{ backfaceVisibility: 'hidden' }}>
              <PhoneMockup />
            </div>
          </div>
        </section>

        <section id="tecnologias" className="tech-section min-h-screen flex items-center overflow-hidden">
          <div className="mx-auto max-w-6xl w-full px-4">
            <h2 className="text-center text-4xl font-bold fade-in mb-16 will-change-transform" style={{ backfaceVisibility: 'hidden' }}>Tecnologías Clave</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="tech-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm will-change-transform" style={{ backfaceVisibility: 'hidden', transform: 'translate3d(0,0,0)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M12 3v1.5m0 15v1.5m3.75-18v1.5m0 15v1.5m-7.5-15h1.5m-1.5 15h1.5m-4.5-8.25h1.5m1.5 0h1.5m-1.5-3.75h1.5m-1.5 7.5h1.5m-7.5-3.75h1.5m1.5 0h1.5" />
                </svg>
                <h3 className="text-2xl font-semibold mt-4">Inteligencia Artificial</h3>
                <p className="mt-2 text-gray-400">Utilizamos algoritmos de Machine Learning para crear sistemas que aprenden, se adaptan y toman decisiones inteligentes.</p>
              </div>
              <div className="tech-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm will-change-transform" style={{ backfaceVisibility: 'hidden', transform: 'translate3d(0,0,0)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 2.18a14.98 14.98 0 0 0-5.84 7.38m5.84 2.58v-4.8m0 4.8a14.98 14.98 0 0 1-5.84 7.38m5.84-7.38a14.98 14.98 0 0 1 7.38-5.84m-7.38 5.84-7.38-5.84" />
                </svg>
                <h3 className="text-2xl font-semibold mt-4">Automatización (RPA)</h3>
                <p className="mt-2 text-gray-400">Desplegamos 'robots' de software para ejecutar tareas repetitivas y manuales, liberando a tu equipo para trabajos de mayor valor.</p>
              </div>
              <div className="tech-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm will-change-transform" style={{ backfaceVisibility: 'hidden', transform: 'translate3d(0,0,0)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                </svg>
                <h3 className="text-2xl font-semibold mt-4">Integración de Sistemas</h3>
                <p className="mt-2 text-gray-400">Conectamos tus herramientas existentes (ERPs, CRMs) a través de APIs robustas para un flujo de datos sin fisuras.</p>
              </div>
            </div>
            {/* Added Quiénes Somos button */}
            <div className="mt-16 text-center fade-in will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
              <Link href="/informacion" className="rounded px-5 py-3 font-semibold ring-1 ring-white/30 hover:bg-[#00CFFF] hover:text-black transition-colors duration-300">
                Quiénes Somos
              </Link>
            </div>
          </div>
        </section>

        <section id="proceso" className="process-section min-h-screen flex items-center overflow-hidden">
          <div className="mx-auto max-w-6xl w-full px-4">
            <h2 className="text-center text-4xl font-bold fade-in mb-16 will-change-transform" style={{ backfaceVisibility: 'hidden' }}>Nuestro Proceso</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center fade-in will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                <p className="text-6xl font-bold text-[#00CFFF]">01</p>
                <h3 className="text-2xl font-semibold mt-4">Análisis y Diagnóstico</h3>
                <p className="mt-2 text-gray-400">Estudiamos a fondo tus flujos de trabajo para diseñar una solución a medida que resuelva tus cuellos de botella.</p>
              </div>
              <div className="text-center fade-in will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                <p className="text-6xl font-bold text-[#00CFFF]">02</p>
                <h3 className="text-2xl font-semibold mt-4">Implementación a Medida</h3>
                <p className="mt-2 text-gray-400">Desarrollamos e integramos las herramientas de automatización directamente en tus sistemas existentes sin interrupciones.</p>
              </div>
              <div className="text-center fade-in will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                <p className="text-6xl font-bold text-[#00CFFF]">03</p>
                <h3 className="text-2xl font-semibold mt-4">Soporte y Optimización</h3>
                <p className="mt-2 text-gray-400">Monitorizamos el rendimiento y ofrecemos soporte continuo para asegurar que la solución evoluciona con tu negocio.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="sectores" className="sectors-section min-h-screen flex items-center overflow-hidden">
          <div className="mx-auto max-w-6xl w-full px-4">
            <h2 className="text-center text-4xl font-bold fade-in mb-16 will-change-transform" style={{ backfaceVisibility: 'hidden' }}>Sectores que Impulsamos</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="sector-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 2.25 12v-1.5a1.125 1.125 0 0 1 1.125-1.125H5.25m17.25 9V14.25a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 0-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125H18.75m-9-9v-1.875a3.375 3.375 0 0 1 3.375-3.375h1.5A1.125 1.125 0 0 1 15 5.25v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a3.375 3.375 0 0 1-3.375-3.375Z" />
                </svg>
                <h3 className="text-2xl font-semibold mt-4">Logística y Almacenamiento</h3>
                <p className="mt-2 text-gray-400">Optimización de inventario, rutas de entrega y gestión de almacenes para una eficiencia máxima.</p>
              </div>
              <div className="sector-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a.75.75 0 0 0 .75-.75V7.5h-.75A.75.75 0 0 0 21 6.75v.75m0 3.75-3 3m0 0-3-3m3 3V3.75" />
                </svg>
                <h3 className="text-2xl font-semibold mt-4">Finanzas y Banca</h3>
                <p className="mt-2 text-gray-400">Automatización de informes, análisis de riesgos y procesamiento de transacciones para reducir errores y costes.</p>
              </div>
              <div className="sector-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3m-16.5 0h16.5m-16.5 0H3.75m16.5 0H20.25m0 0h-3.75m-12.75 0h3.75m-3.75 0V1.5m16.5 1.5V1.5m-12.75 3H12m-3.75 3H12m-3.75 3H12" />
                </svg>
                <h3 className="text-2xl font-semibold mt-4">Manufactura e Industria</h3>
                <p className="mt-2 text-gray-400">Implementación de robótica y sistemas de control para optimizar la cadena de producción y la calidad.</p>
              </div>
            </div>
            <div className="mt-16 text-center fade-in will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
              <Link href="/tecnologias" className="rounded bg-primary/20 px-6 py-3 text-lg font-semibold text-primary ring-1 ring-primary/50 hover:bg-primary hover:text-black transition-colors duration-300">
                Ver Arquitectura Tecnológica
              </Link>
            </div>
          </div>
        </section>

        <section id="contacto" className="cta-section min-h-screen flex flex-col justify-center items-center text-center overflow-hidden">
          <div className="mx-auto max-w-5xl px-4 relative z-10">

            <h2 className="cta-title text-4xl md:text-6xl font-bold opacity-0 will-change-transform" style={{ backfaceVisibility: 'hidden' }}>¿Listo para transformar tu negocio?</h2>
            <p className="cta-text mt-4 text-lg text-gray-300 opacity-0 will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
              Hablemos de cómo la automatización puede llevar tu empresa al siguiente nivel.
            </p>

            <div className="cta-brands-slider w-full mt-16 mb-16 overflow-hidden relative opacity-0 translate-y-8 will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
              <p className="text-sm font-semibold text-[#00CFFF] tracking-widest uppercase mb-6">Confían en nosotros</p>
              <div className="logo-track flex items-center gap-16 w-max">
                {[...brands, ...brands, ...brands].map((brand, i) => (
                  <div key={i} className="flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-opacity" aria-label={brand.name}>
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={brand.color} className="w-8 h-8" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 0 1-3-3m3 3a3 3 0 1 0 0 6h13.5a3 3 0 1 0 0-6m-16.5-3a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3m-19.5 0a4.5 4.5 0 0 1 .9-2.7L5.737 5.1a3.375 3.375 0 0 1 2.7-1.35h7.126c1.072 0 2.041.518 2.7 1.35l3.712 5.05a4.5 4.5 0 0 1 .9 2.7" />
                      </svg>
                    </div>
                    <span className="mt-2 text-xs font-semibold text-gray-400">{brand.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="cta-button mt-8 opacity-0 will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
              <Link href="/Contacto" className="rounded bg-white px-5 py-3 text-lg font-semibold text-gray-900 hover:bg-[#00CFFF] hover:text-black">
                Contáctanos
              </Link>
            </div>
          </div>
        </section>

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
      </main>
    </div>
  );
}