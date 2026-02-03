"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import logger from "@/utils/logger";

export default function ThreeCanvas({ onContextCreated, isContactPage }) {
    const canvasRef = useRef(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        logger.info("ThreeCanvas: Initializing scene");

        // SCENE SETUP
        const scene = new THREE.Scene();
        const overlayScene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true,
            antialias: true,
            powerPreference: "high-performance"
        });

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setClearColor(0x000000, 0);
        renderer.setSize(window.innerWidth, window.innerHeight);
        camera.position.setZ(8);

        const clock = new THREE.Clock();
        const electricBlue = 0x00CFFF;

        const nebulaGeometry = new THREE.SphereGeometry(50, 48, 48);
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
        const planetGeometry = new THREE.SphereGeometry(2, 48, 48);

        const rimUniforms = {
            uRimColor: { value: new THREE.Color(0.85, 0.45, 0.1) },
            uLightDirection: { value: new THREE.Vector3(-1.0, 0.0, 0.0) }
        };

        const planetMaterial = new THREE.ShaderMaterial({
            uniforms: rimUniforms,
            vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
            fragmentShader: `
        uniform vec3 uRimColor;
        uniform vec3 uLightDirection;
        varying vec3 vNormal;
        void main() {
          vec3 baseColor = vec3(0.02, 0.02, 0.03);
          float rimDot = 1.0 - dot(normalize(vNormal), uLightDirection);
          float rimAmount = pow(rimDot, 6.5);
          vec3 finalColor = mix(baseColor, uRimColor, rimAmount);
          float intensity = pow(0.9 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 4.0);
          gl_FragColor = vec4(finalColor, intensity);
        }
      `,
            blending: THREE.AdditiveBlending,
            transparent: true
        });

        const planet = new THREE.Mesh(planetGeometry, planetMaterial);
        planetGroup.add(planet);
        planetGroup.position.set(-0.1, 0.1, 0);

        const createGlowTexture = () => {
            const canvas = document.createElement('canvas'); canvas.width = 256; canvas.height = 256;
            const context = canvas.getContext('2d');
            const gradient = context.createRadialGradient(128, 128, 0, 128, 128, 128);
            gradient.addColorStop(0.1, 'rgba(170, 240, 255, 1)');
            gradient.addColorStop(0.4, 'rgba(0, 207, 255, 0.6)');
            gradient.addColorStop(1, 'rgba(0, 150, 255, 0)');
            context.fillStyle = gradient; context.fillRect(0, 0, 256, 256);
            return new THREE.CanvasTexture(canvas);
        };

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
            const starPositions = [
                -3.0, 2.0, 0,    // P0
                -1.5, -2.0, 0,   // P1
                1.5, 2.0, 0,    // P2
                3.0, -2.0, 0    // P3
            ];
            const pointsGeometry = new THREE.BufferGeometry();
            pointsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
            const pointsMaterial = new THREE.PointsMaterial({
                color: starColor, size: 0.15, blending: THREE.AdditiveBlending, transparent: true, opacity: 0, depthWrite: false
            });
            const constellationPoints = new THREE.Points(pointsGeometry, pointsMaterial);

            const lineIndices = [0, 1, 1, 2, 2, 3];
            const linePositions = [];
            lineIndices.forEach(index => {
                linePositions.push(starPositions[index * 3], starPositions[index * 3 + 1], starPositions[index * 3 + 2]);
            });
            const lineGeometry = new THREE.BufferGeometry();
            lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
            const lineMaterial = new THREE.LineBasicMaterial({
                color: starColor, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false
            });
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
            const count = isContactPage ? 200 : 500;
            for (let i = 0; i < count; i++) {
                const dist = 30 + Math.random() * 60;
                const theta = Math.random() * 2 * Math.PI;
                const phi = Math.acos(2 * Math.random() - 1);
                starVertices.push(dist * Math.sin(phi) * Math.cos(theta), dist * Math.sin(phi) * Math.sin(theta), dist * Math.cos(phi));
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
            const dustMaterial = new THREE.PointsMaterial({ color: 0x555555, size: 0.01 });
            const dustVertices = [];
            for (let i = 0; i < 5000; i++) {
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

        const animate = () => {
            const elapsedTime = clock.getElapsedTime();
            nebulaMaterial.uniforms.uTime.value = elapsedTime;
            gridMaterial.uniforms.uTime.value = elapsedTime;

            if (distantGlow && !isGlowInTransit) {
                const angle = elapsedTime * 0.2;
                distantGlow.position.x = initialGlowPosition.x + Math.cos(angle) * 2;
                distantGlow.position.y = initialGlowPosition.y + Math.sin(angle) * 2;
            }

            composer.render();
            renderer.autoClear = false;
            renderer.clearDepth();
            renderer.render(overlayScene, camera);
            renderer.autoClear = true;

            requestAnimationFrame(animate);
        };
        const animationId = requestAnimationFrame(animate);

        if (onContextCreated) {
            onContextCreated({
                scene, overlayScene, camera, renderer, composer, clock,
                nebulaMaterial, planetGroup, distantGlow,
                globePoints, constellation, connectionsGrid,
                gridMaterial, rimUniforms,
                initialGlowPosition,
                setGlowInTransit: (val) => { isGlowInTransit = val; }
            });
        }

        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            composer.setSize(window.innerWidth, window.innerHeight);
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
        };
        window.addEventListener('resize', handleResize);

        return () => {
            logger.info("ThreeCanvas: Disposing scene");
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);

            renderer.dispose();
            composer.dispose();

            [scene, overlayScene].forEach(s => {
                s.traverse((object) => {
                    if (!object.isMesh && !object.isPoints && !object.isLine && !object.isSprite) return;

                    if (object.geometry) object.geometry.dispose();

                    if (object.material) {
                        if (Array.isArray(object.material)) {
                            object.material.forEach(m => {
                                if (m.map) m.map.dispose();
                                m.dispose();
                            });
                        } else {
                            if (object.material.map) object.material.map.dispose();
                            object.material.dispose();
                        }
                    }
                });
            });
        };
    }, [isContactPage, onContextCreated]);

    return <canvas ref={canvasRef} className="fixed top-0 left-0 -z-10 h-full w-full" />;
}
