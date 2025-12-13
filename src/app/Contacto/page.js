"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import Logo from "@/components/Logo";

gsap.registerPlugin(ScrollTrigger);

export default function Contact() {
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const servicesRef = useRef(null);
  const canvasRef = useRef(null);
  const mainRef = useRef(null);

  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (servicesRef.current && !servicesRef.current.contains(event.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  
  useEffect(() => {
    let ctx = gsap.context(() => {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.position.setZ(8);
      
      const clock = new THREE.Clock();
      const nebulaGeometry = new THREE.SphereGeometry(50, 64, 64);
      const nebulaMaterial = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0.0 }, uOpacity: { value: 1.0 } },
        vertexShader: `varying vec3 vPosition; void main() { vPosition = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform float uTime; uniform float uOpacity; varying vec3 vPosition; vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);} vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;} float snoise(vec3 v){ const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0); vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx); vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy); vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy; i=mod(i,289.0); vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0)); float n_=1.0/7.0; vec3 ns=n_*D.wyz-D.xzx; vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_); vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y); vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw); vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0)); vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww; vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w); vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3))); p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w; vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m; return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3))); } void main() { vec3 pos=normalize(vPosition); float time=uTime*0.05; float f=0.0; f+=0.50*snoise(pos*0.8+time); f+=0.25*snoise(pos*2.0+time*0.5); f=(f+1.0)/2.0; vec3 color1=vec3(0.0,0.0,0.0); vec3 color2=vec3(0.1,0.0,0.2); vec3 color3=vec3(0.05,0.05,0.25); vec3 finalColor=mix(color1,color2,smoothstep(0.7,0.8,f)); finalColor=mix(finalColor,color3,smoothstep(0.85,0.9,f)); gl_FragColor=vec4(finalColor, uOpacity); }`,
        side: THREE.BackSide, transparent: true
      });
      const nebulaSphere = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
      scene.add(nebulaSphere);

      
      const starVertices = [];
      const createStarSphere = (radius, count) => {
        for (let i = 0; i < count; i++) {
          const phi = Math.acos(2 * Math.random() - 1);
          const theta = Math.random() * 2 * Math.PI;
          const x = radius * Math.cos(theta) * Math.sin(phi);
          const y = radius * Math.sin(theta) * Math.sin(phi);
          const z = radius * Math.cos(phi);
          starVertices.push(x, y, z);
        }
      };
      createStarSphere(30, 2000);
      const starGeometry = new THREE.BufferGeometry();
      starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
      const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
      const stars = new THREE.Points(starGeometry, starMaterial);
      scene.add(stars);

      const mousePosition = new THREE.Vector2();
      window.addEventListener('mousemove', (e) => {
        mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
      });

      const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        nebulaMaterial.uniforms.uTime.value = elapsedTime;
        
        const parallaxX = mousePosition.x * 0.05;
        const parallaxY = -mousePosition.y * 0.05;
        scene.rotation.y += (parallaxX - scene.rotation.y) * 0.05;
        scene.rotation.x += (parallaxY - scene.rotation.x) * 0.05;
        
        renderer.render(scene, camera);
      };
      animate();

      const handleResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', handleResize);

      
      gsap.fromTo(".contact-title", { opacity: 0, y: -50 }, { opacity: 1, y: 0, duration: 1.5, ease: "power3.out" });
      gsap.fromTo(".contact-form", { opacity: 0, x: -50 }, { opacity: 1, x: 0, duration: 1.5, delay: 0.5, ease: "power3.out" });
      gsap.fromTo(".contact-info", { opacity: 0, x: 50 }, { opacity: 1, x: 0, duration: 1.5, delay: 0.5, ease: "power3.out" });

    }, mainRef);
    
    return () => { ctx.revert(); };
  }, []);

  return (
    <div ref={mainRef}>
      <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10 h-full w-full"></canvas>
      <main className="flex min-h-screen flex-col text-white">
        {/* Header */}
        <header className={`sticky top-0 z-50 w-full mx-auto flex items-center justify-between pl-5 pr-5 py-3 transition-colors duration-300 ${isScrolled ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent'}`}>
          <Logo className="w-auto h-12 text-blue-900 mt-2" />
          <div className="md:flex md:flex-row flex-col items-center justify-center md:space-x-4">
            <Link href="/#inicio" className="py-2 px-3 block hover:text-[#00CFFF]">Inicio</Link>
            <Link href="/#features" className="py-2 px-3 block hover:text-[#00CFFF]">Features</Link>
            <div className="relative" ref={servicesRef}>
              <button type="button" className="dropdown-toggle py-2 px-3 flex items-center gap-2 rounded" onClick={() => setServicesOpen((v) => !v)}>
                <span>Servicios</span>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`h-5 w-5 transition-transform ${servicesOpen ? "rotate-180" : ""}`}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                </svg>
              </button>
              <div className={`${servicesOpen ? "block" : "hidden"} absolute left-0 z-20 mt-2 w-48 rounded-lg bg-gray-900 text-white shadow-lg`}>
                <Link href="/servicios/automatizacion" className="block px-6 py-2 hover:bg-gray-800" onClick={() => setServicesOpen(false)}>Automatización</Link>
                <Link href="/servicios/digitalizacion" className="block px-6 py-2 hover:bg-gray-800" onClick={() => setServicesOpen(false)}>Digitalización</Link>
              </div>
            </div>
            <Link href="/#contacto" className="py-2 px-3 block hover:text-[#00CFFF]">Contacto</Link>
          </div>
        </header>

        {/* Contact Section */}
        <section className="flex-grow flex items-center justify-center py-20 px-4">
          <div className="max-w-6xl w-full grid md:grid-cols-2 gap-12 items-start">
            
            {/* Form */}
            <div className="contact-form bg-white/5 p-8 rounded-lg backdrop-blur-sm border border-white/10">
              <h1 className="text-4xl font-bold mb-6 contact-title">Contáctanos</h1>
              <p className="text-gray-300 mb-8">
                ¿Tienes un proyecto en mente? Completa el formulario y nos pondremos en contacto contigo lo antes posible.
              </p>
              <form className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Nombre</label>
                  <input type="text" id="name" className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00CFFF] transition-colors" placeholder="Tu nombre" />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input type="email" id="email" className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00CFFF] transition-colors" placeholder="tu@email.com" />
                </div>
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Mensaje</label>
                  <textarea id="message" rows="4" className="w-full bg-white/10 border border-white/20 rounded px-4 py-3 text-white focus:outline-none focus:border-[#00CFFF] transition-colors" placeholder="¿Cómo podemos ayudarte?"></textarea>
                </div>
                <button type="submit" className="w-full bg-[#00CFFF] text-black font-bold py-3 rounded hover:bg-[#00b8e6] transition-colors">
                  Enviar Mensaje
                </button>
              </form>
            </div>

            {/* Info */}
            <div className="contact-info space-y-8 mt-10 md:mt-0">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-[#00CFFF]">Información de Contacto</h2>
                <p className="text-gray-300">Estamos aquí para resolver tus dudas y ayudarte a dar el siguiente paso en la automatización de tu negocio.</p>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-3 rounded-full text-[#00CFFF]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 0 0 2.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 0 1-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 0 0-1.091-.852H4.5A2.25 2.25 0 0 0 2.25 4.5v2.25Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Teléfono</h3>
                  <p className="text-gray-400">+34 608 77 10 56</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-3 rounded-full text-[#00CFFF]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Email</h3>
                  <p className="text-gray-400">info@nexaext.com</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div className="bg-white/10 p-3 rounded-full text-[#00CFFF]">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Dirección</h3>
                  <p className="text-gray-400">C. Roa Bastos, 10005 Cáceres</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="w-full border-t border-white/10 mt-auto">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 text-sm">
            <div>© {new Date().getFullYear()} NEWTEX — Todos los derechos reservados</div>
            <div className="flex gap-6">
              <span>Teléfono corporativo — +34 608 77 10 56</span>
              <span>Dirección: C. Roa Bastos, 10005 Cáceres</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}
