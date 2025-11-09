"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
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
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
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
      const overlayScene = new THREE.Scene();

      const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        alpha: true,
      });

      renderer.setPixelRatio(window.devicePixelRatio);
      renderer.setClearColor(0x000000, 0);
      renderer.setSize(window.innerWidth, window.innerHeight);
      camera.position.setZ(8);
      
      const clock = new THREE.Clock();

      const nebulaGeometry = new THREE.SphereGeometry(50, 64, 64);
      const nebulaMaterial = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0.0 }, uOpacity: { value: 1.0 } },
        vertexShader: `
          varying vec3 vPosition;
          void main() {
            vPosition = position;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
         fragmentShader: `
          uniform float uTime;
          uniform float uOpacity;
          varying vec3 vPosition;
          vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
          vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
          float snoise(vec3 v){ const vec2 C=vec2(1.0/6.0,1.0/3.0); const vec4 D=vec4(0.0,0.5,1.0,2.0); vec3 i=floor(v+dot(v,C.yyy)); vec3 x0=v-i+dot(i,C.xxx); vec3 g=step(x0.yzx,x0.xyz); vec3 l=1.0-g; vec3 i1=min(g.xyz,l.zxy); vec3 i2=max(g.xyz,l.zxy); vec3 x1=x0-i1+C.xxx; vec3 x2=x0-i2+C.yyy; vec3 x3=x0-D.yyy; i=mod(i,289.0); vec4 p=permute(permute(permute(i.z+vec4(0.0,i1.z,i2.z,1.0))+i.y+vec4(0.0,i1.y,i2.y,1.0))+i.x+vec4(0.0,i1.x,i2.x,1.0)); float n_=1.0/7.0; vec3 ns=n_*D.wyz-D.xzx; vec4 j=p-49.0*floor(p*ns.z*ns.z); vec4 x_=floor(j*ns.z); vec4 y_=floor(j-7.0*x_); vec4 x=x_*ns.x+ns.yyyy; vec4 y=y_*ns.x+ns.yyyy; vec4 h=1.0-abs(x)-abs(y); vec4 b0=vec4(x.xy,y.xy); vec4 b1=vec4(x.zw,y.zw); vec4 s0=floor(b0)*2.0+1.0; vec4 s1=floor(b1)*2.0+1.0; vec4 sh=-step(h,vec4(0.0)); vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy; vec4 a1=b1.xzyw+s1.xzyw*sh.zzww; vec3 p0=vec3(a0.xy,h.x); vec3 p1=vec3(a0.zw,h.y); vec3 p2=vec3(a1.xy,h.z); vec3 p3=vec3(a1.zw,h.w); vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3))); p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w; vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0); m=m*m; return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3))); }
          void main() { vec3 pos=normalize(vPosition); float time=uTime*0.05; float f=0.0; f+=0.50*snoise(pos*0.8+time); f+=0.25*snoise(pos*2.0+time*0.5); f=(f+1.0)/2.0; vec3 color1=vec3(0.0,0.0,0.0); vec3 color2=vec3(0.1,0.0,0.2); vec3 color3=vec3(0.05,0.05,0.25); vec3 finalColor=mix(color1,color2,smoothstep(0.7,0.8,f)); finalColor=mix(finalColor,color3,smoothstep(0.85,0.9,f)); gl_FragColor=vec4(finalColor, uOpacity); }
        `,
        side: THREE.BackSide,
        transparent: true
      });
      const nebulaSphere = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
      scene.add(nebulaSphere);
      
      const planetGroup = new THREE.Group();
      scene.add(planetGroup);

      const planetGeometry = new THREE.SphereGeometry(2, 64, 64);
      const planetMaterial = new THREE.ShaderMaterial({
        vertexShader: `
          varying vec3 vNormal;
          void main() {
            vNormal = normalize(normalMatrix * normal);
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
          }
        `,
        fragmentShader: `
          varying vec3 vNormal;
          void main() {
            float intensity = pow(0.9 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
            vec3 color = vec3(0.02, 0.02, 0.03);
            gl_FragColor = vec4(color, intensity);
          }
        `,
        blending: THREE.AdditiveBlending,
        transparent: true
      });
      const planet = new THREE.Mesh(planetGeometry, planetMaterial);
      planetGroup.add(planet);
      
      const coronaGroup = new THREE.Group();
      const electricBlue = 0x00CFFF;

      for (let i = 0; i < 6; i++) {
        const coronaGeometry = new THREE.TorusGeometry(2.1 + i * 0.15, 0.015, 16, 100);
        const coronaMaterial = new THREE.MeshBasicMaterial({ color: electricBlue, transparent: true, opacity: 0 });
        const ring = new THREE.Mesh(coronaGeometry, coronaMaterial);
        ring.scale.set(0, 0, 0);
        coronaGroup.add(ring);
      }
      planetGroup.add(coronaGroup);

      const createGlowTexture = () => {
        const canvas = document.createElement('canvas');
        canvas.width = 256;
        canvas.height = 256;
        const context = canvas.getContext('2d');
        const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
        gradient.addColorStop(0.1, 'rgba(170, 240, 255, 1)');
        gradient.addColorStop(0.4, 'rgba(0, 207, 255, 0.6)');
        gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
        context.fillStyle = gradient;
        context.fillRect(0, 0, 256, 256);
        return new THREE.CanvasTexture(canvas);
      };

      const flareMaterial = new THREE.SpriteMaterial({
        map: createGlowTexture(),
        blending: THREE.AdditiveBlending,
        transparent: true,
        depthWrite: false,
      });
      const flare = new THREE.Sprite(flareMaterial);
      flare.scale.set(0.35, 0.35, 1.0);
      flare.position.set(2.2, 0, 0);
      planetGroup.add(flare);
      flare.visible = false;
      
      const globePoints = createGlobe();
      globePoints.scale.set(0, 0, 0);
      globePoints.visible = false;
      scene.add(globePoints);

      let distantGlow;
      let isGlowInTransit = false;
      const initialGlowPosition = { x: 15, y: 8, z: -20 };
      function addDistantGlow() {
          const glowMaterial = new THREE.SpriteMaterial({
              map: createGlowTexture(),
              blending: THREE.AdditiveBlending,
              transparent: true,
              opacity: 0.2, 
              color: electricBlue,
              depthWrite: false
          });
          distantGlow = new THREE.Sprite(glowMaterial);
          distantGlow.scale.set(1.5, 1.5, 1.5);
          distantGlow.position.set(initialGlowPosition.x, initialGlowPosition.y, initialGlowPosition.z);
          overlayScene.add(distantGlow);
      }
      addDistantGlow();
      
      function createConstellation() {
        const constellationGroup = new THREE.Group();
        const starColor = 0x00CFFF;
        const starPositions = [ -3, 2, 2, 0, 3, 2, 3, 2, 2, 0, 0, 2, -4, -2, 2, 4, -2, 2, 0, -3.5, 2 ];
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
        const globeVertexShader = `
          uniform float uRadius;
          uniform vec3 lightPosition;
          varying float vIntensity;
          varying float vAlpha;
          void main() {
            vec3 vertexNormal = normalize(position);
            vec3 lightDirection = normalize(lightPosition - position);
            vIntensity = max(dot(vertexNormal, lightDirection), 0.2);
            vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
            vAlpha = smoothstep(-uRadius, uRadius * 0.8, modelViewPosition.z);
            gl_Position = projectionMatrix * modelViewPosition;
            gl_PointSize = 1.8;
          }
        `;
        const globeFragmentShader = `
          varying float vIntensity;
          varying float vAlpha;
          void main() {
            vec3 baseColor = vec3(0.0, 0.81, 1.0);
            vec3 finalColor = baseColor * vIntensity;
            gl_FragColor = vec4(finalColor, vAlpha * vIntensity);
          }
        `;
        const positions = []; 
        const radius = 2.0; 
        const NUM_POINTS = 10000;
        for (let i = 0; i < NUM_POINTS; i++) {
          const theta = Math.random() * 2 * Math.PI;
          const phi = Math.acos(2 * Math.random() - 1);
          const x = radius * Math.sin(phi) * Math.cos(theta);
          const y = radius * Math.sin(phi) * Math.sin(theta);
          const z = radius * Math.cos(phi);
          positions.push(x, y, z);
        }
        const globeGeometry = new THREE.BufferGeometry();
        globeGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
        const globeMaterial = new THREE.ShaderMaterial({
          vertexShader: globeVertexShader,
          fragmentShader: globeFragmentShader,
          uniforms: {
            lightPosition: { value: new THREE.Vector3(3, 1, 4) },
            uRadius: { value: radius }
          },
          blending: THREE.AdditiveBlending,
          depthWrite: false,
          transparent: true,
        });
        return new THREE.Points(globeGeometry, globeMaterial);
      }

      const gridGeometry = new THREE.PlaneGeometry(12, 12, 80, 80);
      const gridMaterial = new THREE.ShaderMaterial({
        uniforms: { uTime: { value: 0.0 }, uOpacity: { value: 0.0 } },
        vertexShader: `
          uniform float uTime;
          varying float vNoise;
          vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
          vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
          float snoise(vec2 v) {
            const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
            vec2 i  = floor(v + dot(v, C.yy) );
            vec2 x0 = v - i + dot(i, C.xx);
            vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
            vec2 x1 = x0.xy + C.xx - i1;
            vec2 x2 = x0.xy + C.zz;
            i = mod289(i);
            vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
            vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
            m = m*m; m = m*m;
            vec3 x = 2.0 * fract(p * C.www) - 1.0;
            vec3 h = abs(x) - 0.5;
            vec3 ox = floor(x + 0.5);
            vec3 a0 = x - ox;
            m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
            vec3 g;
            g.x  = a0.x  * x0.x  + h.x  * x0.y;
            g.yz = a0.yz * vec2(x1.x,x2.x) + h.yz * vec2(x1.y,x2.y);
            return 130.0 * dot(m, g);
          }
          void main() {
            vec3 pos = position;
            float noise = snoise(vec2(pos.x * 0.2 + uTime * 0.1, pos.y * 0.2));
            pos.z += noise * 0.1;
            vNoise = noise;
            vec4 modelViewPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_PointSize = 1.0 * (10.0 / -modelViewPosition.z);
            gl_Position = projectionMatrix * modelViewPosition;
          }
        `,
        fragmentShader: `
          uniform float uOpacity;
          varying float vNoise;
          void main() {
            vec3 color = mix(vec3(0.02, 0.1, 0.3), vec3(0.2, 0.5, 0.8), (vNoise + 1.0) / 2.0);
            gl_FragColor = vec4(color, uOpacity);
          }
        `,
        transparent: true,
        depthWrite: false,
      });
      const connectionsGrid = new THREE.Points(gridGeometry, gridMaterial);
      connectionsGrid.rotation.x = -Math.PI / 2.5;
      connectionsGrid.scale.set(0, 0, 0);
      connectionsGrid.visible = false;
      scene.add(connectionsGrid);

      function addStars() {
        const starGeometry = new THREE.BufferGeometry();
        const starMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.02 });
        const starVertices = [];
        for (let i = 0; i < 1500; i++) {
          const x = (Math.random() - 0.5) * 2000;
          const y = (Math.random() - 0.5) * 2000;
          const z = (Math.random() - 0.5) * 2000;
          starVertices.push(x, y, z);
        }
        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
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

      const composer = new EffectComposer(renderer);
      composer.addPass(new RenderPass(scene, camera));
      
      const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight), 1.2, 0.4, 0.8);
      bloomPass.threshold = 0.8;
      bloomPass.strength = 1.2;
      bloomPass.radius = 0.4;
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
        if(dust) dust.position.x += 0.001;
        
        if (distantGlow && !isGlowInTransit) {
            const angle = elapsedTime * 0.2;
            distantGlow.position.x = initialGlowPosition.x + Math.cos(angle) * 2;
            distantGlow.position.y = initialGlowPosition.y + Math.sin(angle) * 2;
        }
        
        const parallaxX = mousePosition.x * 0.1;
        const parallaxY = -mousePosition.y * 0.1;
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
        renderer.setSize(window.innerWidth, window.innerHeight);
        composer.setSize(window.innerWidth, window.innerHeight);
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
      };
      window.addEventListener('resize', handleResize);

      gsap.timeline({ scrollTrigger: { trigger: ".hero-section", start: "top top", end: "+=200%", scrub: true, pin: true } });
      gsap.timeline({ scrollTrigger: { trigger: ".features-section", start: "top top", end: "+=250%", scrub: true, pin: true } });
      gsap.timeline({ scrollTrigger: { trigger: ".process-section", start: "top top", end: "+=250%", scrub: true, pin: true } });
      gsap.timeline({ scrollTrigger: { trigger: ".sectors-section", start: "top top", end: "+=250%", scrub: true, pin: true } });
      gsap.timeline({ scrollTrigger: { trigger: ".globe-section", start: "top top", end: "+=300%", scrub: true, pin: true } });
      gsap.timeline({ scrollTrigger: { trigger: ".tech-section", start: "top top", end: "+=250%", scrub: true, pin: true } });
      gsap.timeline({ scrollTrigger: { trigger: ".cta-section", start: "top top", end: "+=200%", scrub: true, pin: true } });

      const tl = gsap.timeline({
        scrollTrigger: { trigger: mainRef.current, start: "top top", end: "bottom bottom", scrub: 1.5 }
      });

      const rings = coronaGroup.children;
      
      tl.to(rings.map(r => r.scale), { x: 1, y: 1, z: 1, duration: 1.2, stagger: 0.1, ease: "back.out(1.7)" })
        .to(rings.map(r => r.material), { opacity: 1, duration: 0.6, stagger: 0.1 }, "<")
        .to(rings.map(r => r.rotation), { x: Math.PI * 0.5, y: Math.PI * 0.25, duration: 1.2, stagger: 0.1 }, "<")
        .fromTo(".hero-section .fade-in", { opacity: 0 }, { opacity: 1, stagger: 0.2, duration: 1 }, "-=1.2")
        .to({}, { duration: 1.5 })
        .to(rings.map(r => r.material), { opacity: 0, duration: 1.5, stagger: -0.1, ease: "power2.in" })
        .to(".hero-section .fade-in", { opacity: 0, stagger: -0.1, duration: 1.5 }, "<");

      tl.to(planetGroup.position, { x: -4, y: 0, duration: 2, ease: "power2.inOut" })
        .to(planetGroup.scale, { x: 0.7, y: 0.7, z: 0.7, duration: 2, ease: "power2.inOut" }, "<")
        .fromTo(".features-section .fade-in", { opacity: 0, y: 50 }, { opacity: 1, y: 0, stagger: 0.2, duration: 1.5 }, "-=1.5")
        .fromTo(".phone-image", { opacity: 0, x: 100 }, { opacity: 1, x: 0, duration: 1.5, ease: "power2.out" }, "-=1.5")
        .fromTo(planetGroup.rotation, { y: -Math.PI / 4, z: -Math.PI / 3 }, { y: Math.PI / 4, z: Math.PI / 3, duration: 2.5, ease: "power3.inOut", onStart: () => { flare.visible = true; }, onReverseComplete: () => { flare.visible = false; } }, "-=1.5" )
        .to({}, { duration: 2 })
        .to(".features-section .fade-in", { opacity: 0, y: -50, stagger: -0.1, duration: 1.5 })
        .to(".phone-image", { opacity: 0, x: 100, duration: 1.5, ease: "power2.in" }, "<")
        .to(planetGroup, { onStart: () => { flare.visible = false; planetGroup.rotation.z = 0; planetGroup.rotation.y = 0; } }, "<");

      tl.to(planetGroup.scale, { x: 0, y: 0, z: 0, duration: 1.5, ease: "power2.in" })
        .fromTo(".process-section .fade-in", { opacity: 0, y: 50 }, { opacity: 1, y: 0, stagger: 0.2, duration: 1.5 })
        .to({}, { duration: 2.5 })
        .to(".process-section .fade-in", { opacity: 0, y: -50, stagger: -0.1, duration: 1.5 });
      
      tl.fromTo(".sectors-section .fade-in", { opacity: 0 }, { opacity: 1, duration: 1.5 })
        .fromTo(".sector-card", { opacity: 0, y: 50 }, { opacity: 1, y: 0, stagger: 0.2, duration: 1.5 }, "<")
        .to({}, { duration: 1.5 })
        .to(distantGlow.position, { 
            x: 0, y: 0, z: 0, 
            duration: 2.0, ease: "power2.inOut",
            onStart: () => { isGlowInTransit = true; }
        }, "+=0.5")
        .to(distantGlow.scale, { x: 8, y: 8, z: 8, duration: 2.0, ease: "power2.inOut" }, "<")
        .to(distantGlow.material, { opacity: 1.0, duration: 2.0, ease: "power2.in" }, "<")
        .to(".sectors-section .fade-in", { opacity: 0, duration: 1.5 }, "<")
        .to(".sector-card", { opacity: 0, y: -50, stagger: -0.1, duration: 1.5 }, "<");

      tl.to(distantGlow.material, { opacity: 0, duration: 1, ease: "power2.out" }) 
        .set(globePoints, { visible: true }, "<")
        .set(constellation, { visible: true }, "<")
        .fromTo(globePoints.scale, { x: 0, y: 0, z: 0 }, { x: 0.8, y: 0.8, z: 0.8, duration: 2, ease: "power3.out" }, "<")
        .fromTo(constellation.scale, {x:0, y:0, z:0}, {x: 1, y: 1, z: 1, duration: 2.5, ease: "power3.out"}, "<")
        .to(constellation.children[0].material, { opacity: 1.0, duration: 2 }, "<0.5")
        .to(constellation.children[1].material, { opacity: 0.3, duration: 2 }, "<0.5")
        .fromTo(".globe-section .fade-in", { opacity: 0 }, { opacity: 1, stagger: 0.3, duration: 1.5 }, "<0.5")
        .to({}, { duration: 2.5 })
        .to(".globe-section .fade-in", { opacity: 0, y: -50, stagger: -0.1, duration: 1.5 })
        .to(globePoints.scale, { x: 0, y: 0, z: 0, duration: 2, ease: "power2.in" }, "<")
        .to(constellation.scale, { x: 0, y: 0, z: 0, duration: 2, ease: "power2.in" }, "<")
        .to(constellation.children[0].material, { opacity: 0, duration: 1.5 }, "<")
        .to(constellation.children[1].material, { opacity: 0, duration: 1.5 }, "<")
        .call(() => {
            globePoints.visible = false;
            constellation.visible = false;
            distantGlow.position.set(initialGlowPosition.x, initialGlowPosition.y, initialGlowPosition.z);
            distantGlow.scale.set(1.5, 1.5, 1.5);
            distantGlow.material.opacity = 0.2;
            isGlowInTransit = false;
        });

      tl.to(nebulaMaterial.uniforms.uOpacity, { value: 0.2, duration: 1.5 })
        .call(() => { connectionsGrid.visible = true; })
        .fromTo(connectionsGrid.scale, { x: 0, y: 0, z: 0 }, { x: 1, y: 1, z: 1, duration: 2.5, ease: "power2.out" }, "<")
        .fromTo(connectionsGrid.position, { z: -20 }, { z: -5, duration: 2.5, ease: "power2.out" }, "<")
        .to(gridMaterial.uniforms.uOpacity, { value: 0.3, duration: 2 }, "<")
        .fromTo(".tech-section .fade-in", { opacity: 0 }, { opacity: 1, duration: 1.5 }, "<")
        .fromTo(".tech-card", { opacity: 0, y: 50 }, { opacity: 1, y: 0, stagger: 0.2, duration: 1.5 }, "-=1")
        .to({}, { duration: 2.5 })
        .to(".tech-section .fade-in", { opacity: 0, duration: 1.5 })
        .to(".tech-card", { opacity: 0, y: -50, stagger: -0.1, duration: 1.5 }, "<")
        .to(gridMaterial.uniforms.uOpacity, { value: 0, duration: 2 }, "<")
        .to(connectionsGrid.scale, { x: 0, y: 0, z: 0, duration: 2, onComplete: () => { connectionsGrid.visible = false; } }, "<")
        .to(nebulaMaterial.uniforms.uOpacity, { value: 1, duration: 1.5 });
        
    }, mainRef);
    
    return () => { ctx.revert(); };
  }, []);

  return (
    <div ref={mainRef}>
      <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10 h-full w-full"></canvas>
      <main className="flex min-h-screen flex-col text-white">
        <header className={`sticky top-0 z-50 w-full mx-auto flex items-center justify-between px-5 py-5 transition-colors duration-300 ${isScrolled ? 'bg-black/50 backdrop-blur-sm' : 'bg-transparent'}`}>
          <Image src="/logo.svg" alt="NEXA - Nueva era de automatización" width={200} height={70} priority />
          <div className="md:flex md:flex-row flex-col items-center justify-center md:space-x-4 pb-3 md:pb-0 navigation-menu">
            <Link href="/#inicio" className="py-2 px-3 block hover:text-[#00CFFF]">Inicio</Link>
            <Link href="/#features" className="py-2 px-3 block hover:text-[#00CFFF]">Features</Link>
            <div className="relative" ref={servicesRef}>
              <button type="button" className="dropdown-toggle py-2 px-3 hover:bg-gray-800 flex items-center gap-2 rounded" onClick={() => setServicesOpen((v) => !v)}>
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
        
        <section id="inicio" className="hero-section min-h-screen flex items-center justify-center">
            <div className="text-center">
                <h1 className="text-6xl font-extrabold fade-in">NEXA</h1>
                <p className="mt-4 text-lg text-gray-200 fade-in">Automatización a Medida</p>
            </div>
        </section>

        <section id="features" className="features-section min-h-screen flex items-center">
          <div className="mx-auto max-w-6xl w-full px-4 grid md:grid-cols-2 items-center gap-12">
            <div className="max-w-md">
                <h2 className="text-4xl font-bold fade-in">Rápido. Fiable. Seguro.</h2>
                <p className="mt-4 text-lg text-gray-300 fade-in">Nuestras soluciones están diseñadas para optimizar tus procesos sin comprometer la seguridad ni la calidad.</p>
                <div className="mt-8 fade-in">
                    <Link href="/#proceso" className="rounded px-5 py-3 font-semibold ring-1 ring-white/30 hover:bg-[#00CFFF] hover:text-black">
                        Nuestro Proceso
                    </Link>
                </div>
            </div>
            <div className="phone-image opacity-0">
                <Image src="/phone-mockup.png" alt="App de automatización en un móvil" width={400} height={800} />
            </div>
          </div>
        </section>

        <section id="proceso" className="process-section min-h-screen flex items-center">
            <div className="mx-auto max-w-6xl w-full px-4">
                <h2 className="text-center text-4xl font-bold fade-in mb-16">Nuestro Proceso Simplificado</h2>
                <div className="grid md:grid-cols-3 gap-12">
                    <div className="text-center fade-in">
                        <p className="text-6xl font-bold text-[#00CFFF]">01</p>
                        <h3 className="text-2xl font-semibold mt-4">Análisis y Estrategia</h3>
                        <p className="mt-2 text-gray-400">Estudiamos a fondo tus flujos de trabajo para diseñar una solución a medida que resuelva tus cuellos de botella.</p>
                    </div>
                    <div className="text-center fade-in">
                        <p className="text-6xl font-bold text-[#00CFFF]">02</p>
                        <h3 className="text-2xl font-semibold mt-4">Implementación a Medida</h3>
                        <p className="mt-2 text-gray-400">Desarrollamos e integramos las herramientas de automatización directamente en tus sistemas existentes sin interrupciones.</p>
                    </div>
                    <div className="text-center fade-in">
                        <p className="text-6xl font-bold text-[#00CFFF]">03</p>
                        <h3 className="text-2xl font-semibold mt-4">Soporte y Optimización</h3>
                        <p className="mt-2 text-gray-400">Monitorizamos el rendimiento y ofrecemos soporte continuo para asegurar que la solución evoluciona con tu negocio.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="sectores" className="sectors-section min-h-screen flex items-center">
            <div className="mx-auto max-w-6xl w-full px-4">
                <h2 className="text-center text-4xl font-bold fade-in mb-16">Sectores que Impulsamos</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="sector-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.125-.504 1.125-1.125V14.25m-17.25 4.5v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 2.25 12v-1.5a1.125 1.125 0 0 1 1.125-1.125H5.25m17.25 9V14.25a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 0-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125H18.75m-9-9v-1.875a3.375 3.375 0 0 1 3.375-3.375h1.5A1.125 1.125 0 0 1 15 5.25v1.5c0 .621-.504 1.125-1.125 1.125h-1.5a3.375 3.375 0 0 1-3.375-3.375Z" />
                        </svg>
                        <h3 className="text-2xl font-semibold mt-4">Logística y Almacenamiento</h3>
                        <p className="mt-2 text-gray-400">Optimización de inventario, rutas de entrega y gestión de almacenes para una eficiencia máxima.</p>
                    </div>
                    <div className="sector-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414-.336.75-.75.75h-.75a.75.75 0 0 1-.75-.75v-.75m0-3-3-3m0 0-3 3m3-3v11.25m6-2.25h.75a.75.75 0 0 0 .75-.75V7.5h-.75A.75.75 0 0 0 21 6.75v.75m0 3.75-3 3m0 0-3-3m3 3V3.75" />
                        </svg>
                        <h3 className="text-2xl font-semibold mt-4">Finanzas y Banca</h3>
                        <p className="mt-2 text-gray-400">Automatización de informes, análisis de riesgos y procesamiento de transacciones para reducir errores y costes.</p>
                    </div>
                    <div className="sector-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4">
                           <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 0 0 6 16.5h12A2.25 2.25 0 0 0 20.25 14.25V3m-16.5 0h16.5m-16.5 0H3.75m16.5 0H20.25m0 0h-3.75m-12.75 0h3.75m-3.75 0V1.5m16.5 1.5V1.5m-12.75 3H12m-3.75 3H12m-3.75 3H12" />
                        </svg>
                        <h3 className="text-2xl font-semibold mt-4">Manufactura e Industria</h3>
                        <p className="mt-2 text-gray-400">Implementación de robótica y sistemas de control para optimizar la cadena de producción y la calidad.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="global" className="globe-section min-h-screen flex flex-col justify-center">
            <div className="mx-auto max-w-6xl w-full px-4 relative">
                <h2 className="text-center text-4xl font-bold fade-in">Proyección Global</h2>
                <div className="fade-in absolute top-1/2 left-20">
                    <p className="text-5xl font-bold text-[#00CFFF]">50+</p>
                    <p className="text-lg text-gray-300">Proyectos Exitosos</p>
                </div>
                <div className="fade-in absolute top-1/3 right-20 text-right">
                    <p className="text-5xl font-bold text-[#00CFFF]">10+</p>
                    <p className="text-lg text-gray-300">Sectores Industriales</p>
                </div>
            </div>
        </section>

        <section id="tecnologias" className="tech-section min-h-screen flex items-center">
            <div className="mx-auto max-w-6xl w-full px-4">
                <h2 className="text-center text-4xl font-bold fade-in mb-16">Tecnologías Clave</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="tech-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M12 3v1.5m0 15v1.5m3.75-18v1.5m0 15v1.5m-7.5-15h1.5m-1.5 15h1.5m-4.5-8.25h1.5m1.5 0h1.5m-1.5-3.75h1.5m-1.5 7.5h1.5m-7.5-3.75h1.5m1.5 0h1.5" />
                        </svg>
                        <h3 className="text-2xl font-semibold mt-4">Inteligencia Artificial</h3>
                        <p className="mt-2 text-gray-400">Utilizamos algoritmos de Machine Learning para crear sistemas que aprenden, se adaptan y toman decisiones inteligentes.</p>
                    </div>
                    <div className="tech-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm">
                       <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.59 14.37a6 6 0 0 1-5.84 7.38v-4.8m5.84-2.58a14.98 14.98 0 0 0 6.16-12.12A14.98 14.98 0 0 0 9.63 2.18a14.98 14.98 0 0 0-5.84 7.38m5.84 2.58v-4.8m0 4.8a14.98 14.98 0 0 1-5.84 7.38m5.84-7.38a14.98 14.98 0 0 1 7.38-5.84m-7.38 5.84-7.38-5.84" />
                        </svg>
                        <h3 className="text-2xl font-semibold mt-4">Automatización (RPA)</h3>
                        <p className="mt-2 text-gray-400">Desplegamos 'robots' de software para ejecutar tareas repetitivas y manuales, liberando a tu equipo para trabajos de mayor valor.</p>
                    </div>
                    <div className="tech-card bg-white/5 p-8 rounded-lg text-center backdrop-blur-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#00CFFF" className="h-12 w-12 mx-auto mb-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5m-6-15l7.5 7.5-7.5 7.5" />
                        </svg>
                        <h3 className="text-2xl font-semibold mt-4">Integración de Sistemas</h3>
                        <p className="mt-2 text-gray-400">Conectamos tus herramientas existentes (ERPs, CRMs) a través de APIs robustas para un flujo de datos sin fisuras.</p>
                    </div>
                </div>
            </div>
        </section>

        <section id="contacto" className="cta-section min-h-screen flex flex-col justify-center items-center text-center">
            <div className="mx-auto max-w-4xl px-4">
                <h2 className="text-4xl md:text-6xl font-bold fade-in">¿Listo para transformar tu negocio?</h2>
                <p className="mt-4 text-lg text-gray-300 fade-in">
                    Hablemos de cómo la automatización puede llevar tu empresa al siguiente nivel.
                </p>
                <div className="mt-8 fade-in">
                    <Link href="/contacto" className="rounded bg-white px-5 py-3 text-lg font-semibold text-gray-900 hover:bg-[#00CFFF] hover:text-black">
                        Contáctanos
                    </Link>
                </div>
            </div>
        </section>

        <footer className="w-full border-t border-white/10">
          <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-6 text-sm">
            <div>© {new Date().getFullYear()} NEXA S.L — Todos los derechos reservados</div>
            <div className="flex gap-6">
              <span>Teléfono corporativo — +34 XXX XX XX XX</span>
              <span>Dirección: C/ Canutillo Nº420</span>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}