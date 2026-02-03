"use client";

import { useRef, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import * as THREE from "three";
import Logo from "@/components/Logo";


const certifications = [
  {
    name: "IBM Cloud Essentials",
    image: "/badges/ibm-cloud.png",
    url: "https://www.credly.com/users/daniel-conde.3a8de20b/badges"
  },
  {
    name: "IBM Python for Data Science",
    image: "/badges/ibm-python.png",
    url: "https://www.credly.com/users/daniel-conde.3a8de20b/badges"
  }
];

export default function TecnologiasPage() {
  const mainRef = useRef(null);
  const canvasRef = useRef(null);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {
      const tl = gsap.timeline();

      // Configuración inicial GSAP
      gsap.set(".hero-title, .hero-subtitle, .monolith-container, .float-card, .stats-container", {
        opacity: 0,
        y: 30
      });

      // Animación de entrada 
      tl.fromTo(".hero-title",
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 1, ease: "power3.out" }
      )
        .fromTo(".hero-subtitle",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power3.out" },
          "-=0.6"
        )
        .fromTo(".monolith-container",
          { opacity: 0, scale: 0.9, y: 30 },
          { opacity: 1, scale: 1, y: 0, duration: 1.2, ease: "back.out(1.7)" },
          "-=0.6"
        )
        .fromTo(".float-card",
          { opacity: 0, y: 30, x: (i) => i % 2 === 0 ? -10 : 10 },
          { opacity: 1, y: 0, x: 0, duration: 0.8, ease: "power3.out", stagger: 0.1 },
          "-=0.8"
        )
        .fromTo(".stats-container",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 1, ease: "power2.out" },
          "-=0.5"
        );

    }, mainRef);

    // THREE.JS 
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });

    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.setSize(window.innerWidth, window.innerHeight);
    camera.position.setZ(10);

    function addStars() {
      const starVertices = [];
      const count = 1000;
      for (let i = 0; i < count; i++) {
        const x = (Math.random() - 0.5) * 100;
        const y = (Math.random() - 0.5) * 100;
        const z = (Math.random() - 0.5) * 100;
        starVertices.push(x, y, z);
      }
      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);
      return stars;
    }
    const stars = addStars();

    let dust;
    function addCosmicDust() {
      const dustGeometry = new THREE.BufferGeometry();
      const dustMaterial = new THREE.PointsMaterial({ color: 0x555555, size: 0.05 });
      const dustVertices = [];
      for (let i = 0; i < 2000; i++) {
        const x = (Math.random() - 0.5) * 50;
        const y = (Math.random() - 0.5) * 50;
        const z = (Math.random() - 0.5) * 50;
        dustVertices.push(x, y, z);
      }
      dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustVertices, 3));
      dust = new THREE.Points(dustGeometry, dustMaterial);
      scene.add(dust);
    }
    addCosmicDust();

    const animate = () => {
      requestAnimationFrame(animate);
      if (stars) stars.rotation.y += 0.0002;
      if (dust) dust.rotation.y += 0.0005;
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      ctx.revert();
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={mainRef} className="h-screen w-screen overflow-hidden bg-black text-white selection:bg-[#00CFFF] selection:text-black font-sans flex flex-col relative">
      <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10 h-full w-full pointer-events-none" />

      {/* Navbar Compacto */}
      <header className="fixed top-0 z-50 w-full mx-auto flex items-center justify-between px-6 py-2 transition-colors duration-300 bg-black/50 backdrop-blur-sm">
        <Logo className="w-auto h-8 text-[#00CFFF]" />
        <div className="md:flex md:flex-row flex-col items-center justify-center md:space-x-4 text-xs font-medium uppercase tracking-wider">
          <Link href="/#inicio" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors">Inicio</Link>
          <Link href="/#features" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors">Features</Link>
          <Link href="/#sectores" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors">Servicios</Link>
          <Link href="/#contacto" className="py-2 px-3 block hover:text-[#00CFFF] transition-colors">Contacto</Link>
        </div>
      </header>

      {/* Main Content - Single Viewport Centered */}
      <main className="flex-grow flex flex-col justify-center items-center relative w-full h-full scale-90 origin-center">
        {/* Fondo Atmosférico */}
        <div className="absolute inset-0 opacity-40 pointer-events-none" style={{
          backgroundImage: "radial-gradient(circle at center, #001133 0%, transparent 70%)"
        }}></div>

        {/* Títulos Compactos */}
        <div className="relative z-10 text-center mb-8 px-4 mt-8">
          <h1 className="hero-title text-4xl md:text-5xl font-extrabold leading-tight mb-2">
            El Monolito de <span className="text-[#00CFFF]">Datos</span>
          </h1>
          <p className="hero-subtitle text-[#8dc4ce] text-base md:text-lg max-w-xl mx-auto">
            Testigo de la convergencia entre redes neuronales y eficiencia automatizada.
          </p>
        </div>

        {/* Contenedor Central 3D Visual */}
        <div className="monolith-container relative flex items-center justify-center w-full max-w-4xl h-[450px]">
          {/* El Monolito */}
          <div className="absolute w-24 h-[380px] bg-gradient-to-b from-[#00CFFF]/20 via-[#00CFFF]/5 to-transparent rounded-xl border border-[#00CFFF]/30 z-20 flex items-center justify-center group overflow-hidden shadow-[0_0_50px_rgba(0,207,255,0.2)]">
            <div className="absolute inset-0 bg-[#00CFFF]/10 animate-pulse"></div>
            <div className="relative flex flex-col items-center gap-4">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="w-10 h-10 opacity-80">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" />
              </svg>
              <div className="w-[1px] h-24 bg-gradient-to-b from-transparent via-[#00CFFF] to-transparent"></div>
            </div>
          </div>

          {/* Tarjetas Flotantes (Compactas) */}
          <div className="float-card absolute left-[2%] md:left-[12%] top-[10%] p-4 rounded-xl border border-[#00CFFF]/20 bg-black/40 backdrop-blur-md w-48 z-30 hover:border-[#00CFFF]/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#00CFFF]/20 p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 2.18a14.98 14.98 0 0 0-5.84 7.38m5.84 2.58v-4.8m0 4.8a14.98 14.98 0 0 1-5.84 7.38m5.84-7.38a14.98 14.98 0 0 1 7.38-5.84m-7.38 5.84-7.38-5.84" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-white">IA Neural</h3>
            </div>
            <p className="text-xs text-gray-400">Procesamiento cognitivo avanzado en capas.</p>
          </div>

          <div className="float-card absolute right-[2%] md:right-[15%] top-[35%] p-4 rounded-xl border border-[#00CFFF]/20 bg-black/40 backdrop-blur-md w-48 z-30 hover:border-[#00CFFF]/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#00CFFF]/20 p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M12 3v1.5m0 15v1.5m3.75-18v1.5m0 15v1.5m-7.5-15h1.5m-1.5 15h1.5m-4.5-8.25h1.5m1.5 0h1.5m-1.5-3.75h1.5m-1.5 7.5h1.5m-7.5-3.75h1.5m1.5 0h1.5" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-white">RPA Core</h3>
            </div>
            <p className="text-xs text-gray-400">Precisión robótica con latencia cero.</p>
          </div>

          <div className="float-card absolute left-[8%] md:left-[20%] bottom-[15%] p-4 rounded-xl border border-[#00CFFF]/20 bg-black/40 backdrop-blur-md w-48 z-30 hover:border-[#00CFFF]/50 transition-colors">
            <div className="flex items-center gap-3 mb-2">
              <div className="bg-[#00CFFF]/20 p-1.5 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                </svg>
              </div>
              <h3 className="font-bold text-sm text-white">Integración</h3>
            </div>
            <p className="text-xs text-gray-400">Enlace neuronal de ecosistemas.</p>
          </div>

          {/* Anillos Orbitales Decorativos */}
          <div className="absolute w-[400px] h-[400px] border border-[#00CFFF]/10 rounded-full z-0 pointer-events-none"></div>
          <div className="absolute w-[600px] h-[600px] border border-[#00CFFF]/5 rounded-full z-0 pointer-events-none"></div>

        </div>

        {/* Stats Grid Compacto */}
        <div className="stats-container grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl px-4 mt-6">
          {[
            { label: "Latencia", value: "< 10ms", status: "RÁPIDO" },
            { label: "Eficiencia", value: "98.2%", status: "OPTIMIZADO" },
            { label: "Uptime", value: "99.99%", status: "GARANTIZADO" }
          ].map((stat, i) => (
            <div key={i} className="flex flex-col gap-1 rounded-lg p-3 border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <p className="text-gray-400 text-[10px] font-medium uppercase tracking-wider">{stat.label}</p>
              <div className="flex items-end justify-between">
                <p className="text-white text-xl font-bold tracking-tight">{stat.value}</p>
                <div className="flex items-center gap-1 text-[#00CFFF]">
                  <span className="text-[10px] font-bold">{stat.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer Minimalista */}
      <footer className="w-full border-t border-white/10 bg-black/80 backdrop-blur-md relative z-50 py-3 px-6 flex justify-between items-center text-[10px] text-gray-500">
        <div>© {new Date().getFullYear()} NEWTEX</div>
        <div className="flex gap-4">
          {certifications.map((cert, i) => (
            cert.url ? (
              <Link href={cert.url} key={i} target="_blank" className="opacity-70 hover:opacity-100 transition-opacity">
                {cert.name}
              </Link>
            ) : (
              <span key={i} className="opacity-50 cursor-not-allowed">
                {cert.name}
              </span>
            )
          ))}
        </div>
      </footer>
    </div>
  );
}