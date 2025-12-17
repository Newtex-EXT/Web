"use client";

import { useState, useRef, useEffect, useLayoutEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import Lenis from 'lenis';
import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

import Logo from "@/components/Logo";

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
  const [isScrolled, setIsScrolled] = useState(false);
  const canvasRef = useRef(null);
  const mainRef = useRef(null);

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

    // gsap.ticker.add((time) => {
    //   lenis.raf(time * 1000);
    // });
    // gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, []);

  const handleScrollTo = (id) => {
    const element = document.querySelector(id);
    if (element) {
      gsap.to(window, {
        duration: 1.5,
        scrollTo: { y: element, offsetY: 0 },
        ease: "power3.inOut"
      });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useLayoutEffect(() => {
    let ctx = gsap.context(() => {

      // CONFIGURACIÓN THREE
      const scene = new THREE.Scene();
      const overlayScene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true, antialias: true });

      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.position.setZ(8);

      const clock = new THREE.Clock();
      const electricBlue = 0x00CFFF;

      const nebulaGeometry = new THREE.SphereGeometry(50, 64, 64);
      const nebulaMaterial = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0.0 }, uOpacity: { value: 1.0 } },
        vertexShader: `varying vec3 vPosition; void main() { vPosition = position; gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `uniform float uTime; uniform float uOpacity; varying vec3 vPosition; vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);} vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;} float snoise(vec3 v){ const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0); vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx); vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy); vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy; i=mod(i,289.0); vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0)); float n_=1.0/7.0; vec3 ns=n_*D.wyz-D.xzx; vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_); vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y); vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw); vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0)); vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww; vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w); vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3))); p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w; vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m; return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3))); } void main() { vec3 pos=normalize(vPosition); float time=uTime*0.05; float f=0.0; f+=0.50*snoise(pos*0.8+time); f+=0.25*snoise(pos*2.0+time*0.5); f=(f+1.0)/2.0; vec3 color1=vec3(0.0,0.0,0.0); vec3 color2=vec3(0.1,0.0,0.2); vec3 color3=vec3(0.05,0.05,0.25); vec3 finalColor=mix(color1,color2,smoothstep(0.7,0.8,f)); finalColor=mix(finalColor,color3,smoothstep(0.85,0.9,f)); gl_FragColor=vec4(finalColor, uOpacity); }`,
        side: THREE.BackSide, transparent: true
      });
      const nebulaSphere = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
      scene.add(nebulaSphere);
      const planetGroup = new THREE.Group();
      scene.add(planetGroup);
      const planetGeometry = new THREE.SphereGeometry(2, 64, 64);
      const planetMaterial = new THREE.ShaderMaterial({
        vertexShader: `varying vec3 vNormal; void main() { vNormal = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0); }`,
        fragmentShader: `varying vec3 vNormal; void main() { float intensity = pow(0.9 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0); vec3 color = vec3(0.02, 0.02, 0.03); gl_FragColor = vec4(color, intensity); }`,
        blending: THREE.AdditiveBlending, transparent: true
      });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planetGroup.add(planet);
      const createGlowTexture = () => {
        const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0.1, 'rgba(170, 240, 255, 1)'); gradient.addColorStop(0.4, 'rgba(0, 207, 255, 0.6)'); gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
        context.fillStyle = gradient; context.fillRect(0, 0, 256, 256);
        return new THREE.CanvasTexture(canvas);
      };
      const flareMaterial = new THREE.SpriteMaterial({ map: createGlowTexture(), blending: THREE.AdditiveBlending, transparent: true, depthWrite: false });
      const flare = new THREE.Sprite(flareMaterial);
      flare.scale.set(0.35, 0.35, 1.0); flare.position.set(2.2, 0, 0); planetGroup.add(flare); flare.visible = false;
      let distantGlow;
      let isGlowInTransit = false;
      const initialGlowPosition = { x: 15, y: 8, z: -20 };
      function addDistantGlow() {
        const glowMaterial = new THREE.SpriteMaterial({
          map: createGlowTexture(), blending: THREE.AdditiveBlending, transparent: true,
          opacity: 0.2, color: electricBlue, depthWrite: false
        });
        distantGlow = new THREE.Sprite(glowMaterial);
        distantGlow.scale.set(1.5, 1.5, 1.5);
        distantGlow.position.set(initialGlowPosition.x, initialGlowPosition.y, initialGlowPosition.z);
        overlayScene.add(distantGlow);
      }
      addDistantGlow();
      function createConstellation() {
        const constellationGroup = new THREE.Group();
        const starColor = 0x00CFFF; const starPositions = [-3, 2, 2, 0, 3, 2, 3, 2, 2, 0, 0, 2, -4, -2, 2, 4, -2, 2, 0, -3.5, 2];
        const pointsGeometry = new THREE.BufferGeometry();
        pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
        const pointsMaterial = new THREE.PointsMaterial({ color: starColor, size: 0.1, blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false });
        const constellationPoints = new THREE.Points(pointsGeometry, pointsMaterial);
        const lineIndices = [0, 1, 1, 2, 2, 5, 5, 6, 6, 4, 4, 0, 1, 3, 2, 3, 4, 3, 5, 3];
        const linePositions = [];
        lineIndices.forEach(index => { linePositions.push(starPositions[index * 3], starPositions[index * 3 + 1], starPositions[index * 3 + 2]); });
        const lineGeometry = new THREE.BufferGeometry();
        lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
        const lineMaterial = new THREE.LineBasicMaterial({ color: starColor, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false });
        const constellationLines = new THREE.LineSegments(lineGeometry, lineMaterial);
        constellationGroup.add(constellationPoints);
        constellationGroup.add(constellationLines);
        constellationGroup.visible = false;
        return constellationGroup;
      }
      const constellation = createConstellation();
      scene.add(constellation);
      function createGlobe() {
        const globeVertexShader = `uniform float uRadius; uniform vec3 lightPosition; varying float vIntensity; varying float vAlpha; void main() { vec3 vertexNormal = normalize(position); vec3 lightDirection = normalize(lightPosition - position); vIntensity = max(dot(vertexNormal, lightDirection), 0.2); vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0); vAlpha = smoothstep(-uRadius, uRadius * 0.8, modelViewPosition.z); gl_Position = projectionMatrix * modelViewPosition; gl_PointSize = 1.8; }`;
        const globeFragmentShader = `varying float vIntensity; varying float vAlpha; void main() { vec3 baseColor = vec3(0.0, 0.81, 1.0); vec3 finalColor = baseColor * vIntensity; gl_FragColor = vec4(finalColor, vAlpha * vIntensity); }`;
        const positions = []; const radius = 2.0; const NUM_POINTS = 5000;
        for (let i = 0; i < NUM_POINTS; i++) {
          const theta = Math.random() * 2 * Math.PI; const phi = Math.acos(2 * Math.random() - 1);
          const x = radius * Math.sin(phi) * Math.cos(theta); const y = radius * Math.sin(phi) * Math.sin(theta); const z = radius * Math.cos(phi);
          positions.push(x, y, z);
        }
        const globeGeometry = new THREE.BufferGeometry();
        globeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const globeMaterial = new THREE.ShaderMaterial({ vertexShader: globeVertexShader, fragmentShader: globeFragmentShader, uniforms: { lightPosition: { value: new THREE.Vector3(3, 1, 4) }, uRadius: { value: radius } }, blending: THREE.AdditiveBlending, depthWrite: false, transparent: true });
        return new THREE.Points(globeGeometry, globeMaterial);
      }
      const globePoints = createGlobe();
      globePoints.scale.set(0, 0, 0);
      globePoints.visible = false;
      scene.add(globePoints);
      const gridGeometry = new THREE.PlaneGeometry(12, 12, 80, 80);
      const gridMaterial = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0.0 }, uOpacity: { value: 0.0 } },
        vertexShader: `uniform float uTime; varying float vNoise; vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; } vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; } vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); } float snoise(vec2 v) { const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439); vec2 i  = floor(v + dot(v, C.yy) ); vec2 x0 = v - i + dot(i, C.xx); vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0); vec2 x1 = x0.xy + C.xx - i1; vec2 x2 = x0.xy + C.zz; i = mod289(i); vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 )); vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0); m = m*m; m = m*m; vec3 x = 2.0 * fract(p * C.www) - 1.0; vec3 h = abs(x) - 0.5; vec3 ox = floor(x + 0.5); vec3 a0 = x - ox; m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h ); vec3 g; g.x  = a0.x  * x0.x  + h.x  * x0.y; g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y); return 130.0 * dot(m, g); } void main() { vec3 pos = position; float noise = snoise(vec2(pos.x * 0.2 + uTime * 0.1, pos.y * 0.2)); pos.z += noise * 0.1; vNoise = noise; vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0); gl_PointSize = 1.0 * (10.0 / -modelViewPosition.z); gl_Position = projectionMatrix * modelViewPosition; }`,
        fragmentShader: `uniform float uOpacity; varying float vNoise; void main() { vec3 color = mix(vec3(0.02, 0.1, 0.3), vec3(0.2, 0.5, 0.8), (vNoise + 1.0) / 2.0); gl_FragColor = vec4(color, uOpacity); }`,
        transparent: true, depthWrite: false,
      });
      const connectionsGrid = new THREE.Points(gridGeometry, gridMaterial);
      connectionsGrid.rotation.x = -Math.PI / 2.5; connectionsGrid.scale.set(0, 0, 0); connectionsGrid.visible = false; scene.add(connectionsGrid);
      function addStars() {
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
        createStarSphere(30, 2000); createStarSphere(60, 2000); createStarSphere(90, 2000);
        const starGeometry = new THREE.BufferGeometry();
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.05 });
        const stars = new THREE.Points(starGeometry, starMaterial);
        scene.add(stars);
      }
      addStars();
      let dust;
      function addCosmicDust() {
        const dustGeometry = new THREE.BufferGeometry();
        const dustMaterial = new THREE.PointsMaterial({ color: 0x555555, size: 0.005 });
        const dustVertices = [];
        for (let i = 0; i < 20000; i++) {
          const x = (Math.random() - 0.5) * 50; const y = (Math.random() - 0.5) * 50; const z = (Math.random() - 0.5) * 50;
          dustVertices.push(x, y, z);
        }
        dustGeometry.setAttribute('position', new THREE.Float32BufferAttribute(dustVertices, 3));
        dust = new THREE.Points(dustGeometry, dustMaterial);
        scene.add(dust);
      }
      addCosmicDust();
      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.4, 0.8);
      bloomPass.threshold = 0.8; bloomPass.strength = 1.2; bloomPass.radius = 0.4;
      composer.addPass(bloomPass);
      const mousePosition = new THREE.Vector2();
      window.addEventListener('mousemove', (e) => {
        mousePosition.x = (e.clientX / window.innerWidth) * 2 - 1;
        mousePosition.y = -(e.clientY / window.innerHeight) * 2 + 1;
      });
      const animate = () => {
        requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        nebulaMaterial.uniforms.uTime.value = elapsedTime;
        gridMaterial.uniforms.uTime.value = elapsedTime;
        if (dust) dust.position.x += 0.001;
        if (distantGlow && !isGlowInTransit) {
          const angle = elapsedTime * 0.2;
          distantGlow.position.x = initialGlowPosition.x + Math.cos(angle) * 2;
          distantGlow.position.y = initialGlowPosition.y + Math.sin(angle) * 2;
        }
        const parallaxX = mousePosition.x * 0.07;
        const parallaxY = -mousePosition.y * 0.07;
        scene.rotation.y += (parallaxX - scene.rotation.y) * 0.05;
        scene.rotation.x += (parallaxY - scene.rotation.x) * 0.05;
        composer.render();
        renderer.autoClear = false;
        renderer.clearDepth();
        renderer.render(overlayScene, camera);
        renderer.autoClear = true;
      };
      animate();
      const handleResize = () => {
        renderer.setSize(window.innerWidth, window.innerHeight); composer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight; camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', handleResize);

      // CONFIGURACIÓN DE PINES
      const pinConfig = { start: "top top", scrub: 1, pin: true, anticipatePin: 1 };

      gsap.timeline({ scrollTrigger: { trigger: ".hero-section", end: "+=300%", ...pinConfig } });
      gsap.timeline({ scrollTrigger: { trigger: ".features-section", end: "+=400%", ...pinConfig } });
      gsap.timeline({ scrollTrigger: { trigger: ".process-section", end: "+=400%", ...pinConfig } });
      gsap.timeline({ scrollTrigger: { trigger: ".sectors-section", end: "+=400%", ...pinConfig } });
      gsap.timeline({ scrollTrigger: { trigger: ".globe-section", end: "+=500%", ...pinConfig } });
      gsap.timeline({ scrollTrigger: { trigger: ".tech-section", end: "+=1000%", ...pinConfig } });
      gsap.timeline({ scrollTrigger: { trigger: ".cta-section", end: "+=100%", ...pinConfig } });

      const introTl = gsap.timeline();

      gsap.set(".hero-title, .hero-subtitle, .fade-in, .sector-card, .tech-card", {
        rotation: 0.01,
        z: 0.1,
        force3D: true
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

      // ANIMACIÓN PRINCIPAL 
      const tl = gsap.timeline({
        scrollTrigger: { trigger: mainRef.current, start: "top top", end: "bottom bottom", scrub: 1 }
      });

      tl.to({}, { duration: 0.5 })
        .to(".hero-section .text-center > *", { opacity: 0, duration: 2, ease: "power2.in", force3D: true })
        .to(planetGroup.position, { x: -4, y: 0, duration: 3, ease: "power2.inOut", force3D: true }, "<")
        .to(planetGroup.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 3, ease: "power2.inOut", force3D: true }, "<")

        // FEATURES 
        .fromTo(".features-section .fade-in", { opacity: 0, y: 50, rotation: 0.01 }, { opacity: 1, y: 0, rotation: 0.01, stagger: 0.2, duration: 3, force3D: true }, "-=2")
        .fromTo(".phone-image", { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 3, ease: "power2.out", force3D: true }, "-=2")
        .fromTo(planetGroup.rotation, { y: -Math.PI / 4, z: -Math.PI / 3 }, { y: Math.PI / 4, z: Math.PI / 3, duration: 3, ease: "power3.inOut", onStart: () => { flare.visible = true; }, onReverseComplete: () => { flare.visible = false; } }, "-=2")

        .to({}, { duration: 15 })

        .to(".features-section .fade-in", { opacity: 0, stagger: -0.1, duration: 2, force3D: true })
        .to(".phone-image", { opacity: 0, x: 100, duration: 2, ease: "power2.in", force3D: true }, "<")
        .to(planetGroup, { onStart: () => { flare.visible = false; planetGroup.rotation.z = 0; planetGroup.rotation.y = 0; } }, "<")
        .to(planetGroup.scale, { x: 0, y: 0, z: 0, duration: 2, ease: "power2.in", force3D: true })

        // PROCESS 
        .fromTo(".process-section .fade-in", { opacity: 0, y: 50, rotation: 0.01 }, { opacity: 1, y: 0, rotation: 0.01, stagger: 0.2, duration: 3, force3D: true })

        .to({}, { duration: 15 })

        .to(".process-section .fade-in", { opacity: 0, stagger: -0.1, duration: 2, force3D: true })

        // SECTORS 
        .fromTo(".sectors-section .fade-in", { opacity: 0, rotation: 0.01 }, { opacity: 1, rotation: 0.01, duration: 3, force3D: true })
        .fromTo(".sector-card", { opacity: 0, y: 50, rotation: 0.01 }, { opacity: 1, y: 0, rotation: 0.01, stagger: 0.2, duration: 3, force3D: true }, "<")
        .to(distantGlow.position, { x: 0, y: 0, z: 0, duration: 3, ease: "power2.inOut", onStart: () => { isGlowInTransit = true; } }, "+=0.5")
        .to(distantGlow.scale, { x: 8, y: 8, z: 8, duration: 3, ease: "power2.inOut" }, "<")
        .to(distantGlow.material, { opacity: 1.0, duration: 3, ease: "power2.in" }, "<")

        .to({}, { duration: 15 })

        .to(".sectors-section .fade-in", { opacity: 0, duration: 2, force3D: true })
        .to(".sector-card", { opacity: 0, stagger: -0.1, duration: 2, force3D: true }, "<")

        // GLOBE 
        .to(distantGlow.material, { opacity: 0, duration: 2, ease: "power2.out" })
        .set(globePoints, { visible: true }, "<")
        .set(constellation, { visible: true }, "<")
        .fromTo(globePoints.scale, { x: 0, y: 0, z: 0 }, { x: 0.8, y: 0.8, z: 0.8, duration: 3, ease: "power3.out", force3D: true }, "<")
        .fromTo(constellation.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 3, ease: "power3.out", force3D: true }, "<")
        .to(constellation.children[0].material, { opacity: 1.0, duration: 2 }, "<0.5")
        .to(constellation.children[1].material, { opacity: 0.3, duration: 2 }, "<0.5")
        .fromTo(".globe-section .fade-in", { opacity: 0, rotation: 0.01 }, { opacity: 1, stagger: 0.3, duration: 3, rotation: 0.01, force3D: true }, "<0.5")

        .to({}, { duration: 15 })

        .to(".globe-section .fade-in", { opacity: 0, stagger: -0.1, duration: 2, force3D: true })
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
          isGlowInTransit = false;
        })

        // --- TECH ---
        .to(nebulaMaterial.uniforms.uOpacity, { value: 0.2, duration: 2 })
        .call(() => { connectionsGrid.visible = true; })
        .fromTo(connectionsGrid.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 3, ease: "power2.out", force3D: true }, "<")
        .fromTo(connectionsGrid.position, { z: -20 }, { z: -5, duration: 3, ease: "power2.out", force3D: true }, "<")
        .to(gridMaterial.uniforms.uOpacity, { value: 0.3, duration: 2 }, "<")
        .fromTo(".tech-section .fade-in", { opacity: 0, rotation: 0.01 }, { opacity: 1, duration: 3, rotation: 0.01, force3D: true }, "<")
        .fromTo(".tech-card", { opacity: 0, y: 50, rotation: 0.01 }, { opacity: 1, y: 0, rotation: 0.01, stagger: 0.2, duration: 3, force3D: true }, "-=1")

        .to({}, { duration: 15 })

        .to(".tech-section .fade-in", { opacity: 0, duration: 1, force3D: true })
        .to(".tech-card", { opacity: 0, stagger: -0.05, duration: 1, force3D: true }, "<")
        .to(gridMaterial.uniforms.uOpacity, { value: 0, duration: 1.5 }, "<")
        .to(connectionsGrid.scale, { x: 0, y: 0, z: 0, duration: 1.5, onComplete: () => { connectionsGrid.visible = false; } }, "<")
        .to(nebulaMaterial.uniforms.uOpacity, { value: 1, duration: 2 }, "<")

        .to({}, { duration: 10 });

      const tlCTA = gsap.timeline({
        scrollTrigger: {
          trigger: ".cta-section",
          start: "top center",
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
  }, []);

  return (
    <div ref={mainRef}>
      <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10 h-full w-full"></canvas>
      <main className="flex min-h-screen flex-col text-white">

        <header className={`fixed top-0 z-50 w-full mx-auto flex items-center justify-between pl-5 pr-5 py-3 transition-colors duration-300 ${isScrolled ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent'}`}>
          <Logo className="w-auto h-12 text-blue-900 mt-2" />
          <div className="md:flex md:flex-row flex-col items-center justify-center md:space-x-4">
            <button onClick={() => handleScrollTo("#inicio")} className="py-2 px-3 block hover:text-[#00CFFF]">Inicio</button>
            <button onClick={() => handleScrollTo("#features")} className="py-2 px-3 block hover:text-[#00CFFF]">Features</button>
            <button onClick={() => handleScrollTo("#sectores")} className="py-2 px-3 block hover:text-[#00CFFF]">Servicios</button>
            <button onClick={() => handleScrollTo("#contacto")} className="py-2 px-3 block hover:text-[#00CFFF]">Contacto</button>
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
              <p className="mt-4 text-lg text-gray-300 fade-in will-change-transform" style={{ backfaceVisibility: 'hidden' }}>Nuestras soluciones están diseñadas para optimizar tus procesos sin comprometer la seguridad ni la calidad.</p>
              <div className="mt-8 fade-in will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                <button onClick={() => handleScrollTo("#proceso")} className="rounded px-5 py-3 font-semibold ring-1 ring-white/30 hover:bg-[#00CFFF] hover:text-black">
                  Nuestro Proceso
                </button>
              </div>
            </div>
            <div className="phone-image opacity-0 will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
              <Image src="/phone-mockup.png" alt="App de automatización en un móvil" width={400} height={800} />
            </div>
          </div>
        </section>

        <section id="proceso" className="process-section min-h-screen flex items-center overflow-hidden">
          <div className="mx-auto max-w-6xl w-full px-4">
            <h2 className="text-center text-4xl font-bold fade-in mb-16 will-change-transform" style={{ backfaceVisibility: 'hidden' }}>Nuestro Proceso Simplificado</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div className="text-center fade-in will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                <p className="text-6xl font-bold text-[#00CFFF]">01</p>
                <h3 className="text-2xl font-semibold mt-4">Análisis y Estrategia</h3>
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
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 2.25 12v-1.5a1.125 1.125 0 0 1 1.125-1.125H5.25m17.25 9V14.25a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 0-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125H18.75m-9-9v-1.875a3.375 3.375 0 0 1 3.375-3.375h1.5A1.125 1.125 0 0 1 15 5.25v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a3.375 3.375 0 0 1-3.375-3.375Z" />
                </svg>
                <h3 className="text-2xl font-semibold mt-4">Logística y Almacenamiento</h3>
                <p className="mt-2 text-gray-400">Optimización de inventario, rutas de entrega y gestión de almacenes para una eficiencia máxima.</p>
              </div>
              <div className="sector-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a.75.75 0 0 0 .75-.75V7.5h-.75A.75.75 0 0 0 21 6.75v.75m0 3.75-3 3m0 0-3-3m3 3V3.75" />
                </svg>
                <h3 className="text-2xl font-semibold mt-4">Finanzas y Banca</h3>
                <p className="mt-2 text-gray-400">Automatización de informes, análisis de riesgos y procesamiento de transacciones para reducir errores y costes.</p>
              </div>
              <div className="sector-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3m-16.5 0h16.5m-16.5 0H3.75m16.5 0H20.25m0 0h-3.75m-12.75 0h3.75m-3.75 0V1.5m16.5 1.5V1.5m-12.75 3H12m-3.75 3H12m-3.75 3H12" />
                </svg>
                <h3 className="text-2xl font-semibold mt-4">Manufactura e Industria</h3>
                <p className="mt-2 text-gray-400">Implementación de robótica y sistemas de control para optimizar la cadena de producción y la calidad.</p>
              </div>
            </div>
          </div>
        </section>

        <section id="global" className="globe-section min-h-screen flex flex-col justify-center overflow-hidden">
          <div className="mx-auto max-w-6xl w-full px-4 relative">
            <h2 className="text-center text-4xl font-bold fade-in will-change-transform" style={{ backfaceVisibility: 'hidden' }}>Proyección Global</h2>
            <div className="fade-in absolute top-1/2 left-20 will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
              <p className="text-5xl font-bold text-[#00CFFF]">50+</p>
              <p className="text-lg text-gray-300">Proyectos Exitosos</p>
            </div>
            <div className="fade-in absolute top-1/3 right-20 text-right will-change-transform" style={{ backfaceVisibility: 'hidden' }}>
              <p className="text-5xl font-bold text-[#00CFFF]">10+</p>
              <p className="text-lg text-gray-300">Sectores Industriales</p>
            </div>
          </div>
        </section>

        <section id="tecnologias" className="tech-section min-h-screen flex items-center overflow-hidden">
          <div className="mx-auto max-w-6xl w-full px-4">
            <h2 className="text-center text-4xl font-bold fade-in mb-16 will-change-transform" style={{ backfaceVisibility: 'hidden' }}>Tecnologías Clave</h2>
            <div className="grid md:grid-cols-3 gap-8">
              <div className="tech-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm will-change-transform" style={{ backfaceVisibility: 'hidden', transform: 'translate3d(0,0,0)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M12 3v1.5m0 15v1.5m3.75-18v1.5m0 15v1.5m-7.5-15h1.5m-1.5 15h1.5m-4.5-8.25h1.5m1.5 0h1.5m-1.5-3.75h1.5m-1.5 7.5h1.5m-7.5-3.75h1.5m1.5 0h1.5" />
                </svg>
                <h3 className="text-2xl font-semibold mt-4">Inteligencia Artificial</h3>
                <p className="mt-2 text-gray-400">Utilizamos algoritmos de Machine Learning para crear sistemas que aprenden, se adaptan y toman decisiones inteligentes.</p>
              </div>
              <div className="tech-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm will-change-transform" style={{ backfaceVisibility: 'hidden', transform: 'translate3d(0,0,0)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 2.18a14.98 14.98 0 0 0-5.84 7.38m5.84 2.58v-4.8m0 4.8a14.98 14.98 0 0 1-5.84 7.38m5.84-7.38a14.98 14.98 0 0 1 7.38-5.84m-7.38 5.84-7.38-5.84" />
                </svg>
                <h3 className="text-2xl font-semibold mt-4">Automatización (RPA)</h3>
                <p className="mt-2 text-gray-400">Desplegamos 'robots' de software para ejecutar tareas repetitivas y manuales, liberando a tu equipo para trabajos de mayor valor.</p>
              </div>
              <div className="tech-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm will-change-transform" style={{ backfaceVisibility: 'hidden', transform: 'translate3d(0,0,0)' }}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                </svg>
                <h3 className="text-2xl font-semibold mt-4">Integración de Sistemas</h3>
                <p className="mt-2 text-gray-400">Conectamos tus herramientas existentes (ERPs, CRMs) a través de APIs robustas para un flujo de datos sin fisuras.</p>
              </div>
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
                  <div key={i} className="flex flex-col items-center justify-center opacity-60 hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/10">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke={brand.color} className="w-8 h-8">
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

        <footer className="w-full border-t border-white/10">
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