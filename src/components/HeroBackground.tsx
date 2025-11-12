import { useEffect, useRef } from "react";

// Lightweight port of hero/1.js into a React background component.
// It renders an animated canvas using ThreeJS and plays a click sound on interaction.
// No external npm dependency is required; ThreeJS is loaded via ESM CDN at runtime.

export default function HeroBackground() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let cleanup: (() => void) | null = null;
    let isMounted = true;

    (async () => {
      // Dynamically import three from CDN to avoid adding a new dependency.
      const THREE: any = await import("https://esm.sh/three");

      if (!isMounted || !containerRef.current) return;

      const container = containerRef.current;

      // --- Scene Setup ---
      let scene: any, camera: any, renderer: any;
      let width: number, height: number;
      const tendrils: any[] = [];
      const worldWidth = 100;
      let worldHeight: number;
      const clock = new THREE.Clock();
      const audio = audioRef.current;

      // --- Color Palette ---
      const PALETTES = [
        ["#B5E0B5", "#C7E9C0", "#D9F2D9", "#A9D8A9", "#CCE5CC"],
        ["#E6E3B3", "#D9D9A6", "#F2EFD0"],
        ["#B3D9D2", "#C9E3DE", "#A6CFC6", "#E0F2EE"],
      ];
      const ACCENT_PALETTE = ["#E0CFC4", "#D4BFA7"];

      // --- GLSL Shaders ---
      const stemVertexShader = `
        attribute float segmentT;
        varying float vT;

        void main() {
          vT = segmentT;
          float maxWidth = 0.2;
          float minWidth = 0.05;
          float currentWidth = mix(maxWidth, minWidth, segmentT);
          vec3 displaced = position + normal * currentWidth;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
        }
      `;

      const stemFragmentShader = `
        uniform vec3 color;
        void main() {
          gl_FragColor = vec4(color, 0.8);
        }
      `;

      const leafVertexShader = `
        uniform float uGrow;
        varying vec2 vUv;

        void main() {
          vUv = uv;
          vec3 pos = position;
          pos.x *= uGrow;
          pos.y *= pow(uGrow, 1.5);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
      `;

      const leafFragmentShader = `
        uniform vec3 color;
        varying vec2 vUv;
        void main() {
          gl_FragColor = vec4(color, 0.8);
        }
      `;

      // --- Utils ---
      function rand(min: number, max: number) {
        return min + Math.random() * (max - min);
      }
      function bellCurve(t: number) {
        return Math.sin(Math.PI * t);
      }

      // --- Geometry ---
      function createStemGeometry(curve: any, segments: number) {
        const points = curve.getPoints(segments);
        const geometry = new THREE.BufferGeometry();
        const vertices: number[] = [];
        const normals: number[] = [];
        const segmentTs: number[] = [];

        for (let i = 0; i <= segments; i++) {
          const t = i / segments;
          const point = points[i];
          const tangent = curve.getTangent(t).normalize();
          const normal = new THREE.Vector3(-tangent.y, tangent.x, 0);

          vertices.push(point.x, point.y, point.z);
          normals.push(normal.x, normal.y, normal.z);
          segmentTs.push(t);

          vertices.push(point.x, point.y, point.z);
          normals.push(-normal.x, -normal.y, -normal.z);
          segmentTs.push(t);
        }

        const indices: number[] = [];
        for (let i = 0; i < segments; i++) {
          const i2 = i * 2;
          indices.push(i2, i2 + 1, i2 + 2);
          indices.push(i2 + 1, i2 + 3, i2 + 2);
        }

        geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3));
        geometry.setAttribute("segmentT", new THREE.Float32BufferAttribute(segmentTs, 1));
        geometry.setIndex(indices);
        return geometry;
      }

      // --- Tendril ---
      class Tendril {
        curve: any;
        segments: number;
        progress: number;
        speed: number;
        activePalette: string[];
        stemMaterial: any;
        stemMesh: any;
        leafMeshes: any[];

        constructor(startX: number, startY: number) {
          const start = new THREE.Vector3(startX, startY, 0);
          const margin = 10;
          const randomY = startY + (Math.random() * worldHeight * 0.5 + worldHeight * 0.4);
          const endY = Math.min(randomY, worldHeight - margin);
          const end = new THREE.Vector3(
            startX + (Math.random() - 0.5) * worldWidth * 0.4,
            endY,
            0
          );
          const control = new THREE.Vector3(
            (start.x + end.x) / 2 + (Math.random() - 0.5) * worldWidth * 0.4,
            (start.y + end.y) / 2 + (Math.random() * worldHeight * 0.1),
            0
          );
          this.curve = new THREE.QuadraticBezierCurve3(start, control, end);
          this.segments = 100;

          this.progress = 0;
          this.speed = Math.random() * 0.01 + 0.005;

          const basePalette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
          this.activePalette = [...basePalette, ...basePalette, ...basePalette, ...ACCENT_PALETTE];

          const stemGeometry = createStemGeometry(this.curve, this.segments);
          stemGeometry.setDrawRange(0, 0);

          this.stemMaterial = new THREE.ShaderMaterial({
            vertexShader: stemVertexShader,
            fragmentShader: stemFragmentShader,
            uniforms: { color: { value: new THREE.Color(0x503214) } },
            side: THREE.DoubleSide,
            transparent: true,
          });
          this.stemMesh = new THREE.Mesh(stemGeometry, this.stemMaterial);
          scene.add(this.stemMesh);

          this.leafMeshes = [];
          this.createLeaves();
        }

        createLeaves() {
          const leafPairs = 40;
          for (let k = 1; k < leafPairs; k++) {
            [-1, 1].forEach((side) => {
              const t_k = Math.pow(k / leafPairs, 0.8);

              let p: number, w_ratio: number, kappa: number, beta: number, length_scale = 1.0;
              const r = Math.random();
              if (r < 0.4) {
                p = rand(2.2, 2.6); w_ratio = rand(0.08, 0.12); kappa = rand(-0.05, 0.05); beta = rand(-0.1, 0.1);
              } else if (r < 0.7) {
                p = rand(1.4, 1.8); w_ratio = rand(0.14, 0.18); kappa = 0; beta = 0;
              } else if (r < 0.9) {
                p = rand(1.8, 2.2); w_ratio = rand(0.1, 0.14); kappa = side * rand(0.12, 0.25); beta = side * rand(0.1, 0.2);
              } else {
                p = rand(1.6, 2.0); w_ratio = rand(0.12, 0.15); kappa = 0; beta = 0; length_scale = 0.6;
              }

              const L_max = worldWidth * 0.12;
              const L_k = bellCurve(t_k) * L_max * length_scale * rand(0.9, 1.1);
              const W_k = L_k * w_ratio;

              const leafShape = new THREE.Shape();
              const segments = 32;
              const points: Array<{ x: number; y: number }> = [];

              for (let i = 0; i <= segments; i++) {
                const s = i / segments;
                const c_x = s * L_k;
                const c_y = kappa * L_k * (1 - Math.pow(1 - 2 * s, 2));
                const w_s = W_k * Math.pow(Math.sin(Math.PI * s), p);
                const delta_s = beta * (1 - s) * w_s;
                points.push({ x: c_x, y: c_y + w_s + delta_s });
              }
              for (let i = segments; i >= 0; i--) {
                const s = i / segments;
                const c_x = s * L_k;
                const c_y = kappa * L_k * (1 - Math.pow(1 - 2 * s, 2));
                const w_s = W_k * Math.pow(Math.sin(Math.PI * s), p);
                const delta_s = beta * (1 - s) * w_s;
                points.push({ x: c_x, y: c_y - w_s + delta_s });
              }

              leafShape.moveTo(points[0].x, points[0].y);
              for (let i = 1; i < points.length; i++) {
                leafShape.lineTo(points[i].x, points[i].y);
              }

              const leafGeometry = new THREE.ShapeGeometry(leafShape);

              const randomColorHex = this.activePalette[Math.floor(Math.random() * this.activePalette.length)];
              const color = new THREE.Color(randomColorHex);
              const hsl: any = {};
              color.getHSL(hsl);
              color.setHSL(hsl.h, hsl.s, hsl.l * rand(0.95, 1.05));

              const leafMaterial = new THREE.ShaderMaterial({
                vertexShader: leafVertexShader,
                fragmentShader: leafFragmentShader,
                uniforms: { color: { value: color }, uGrow: { value: 0.0 } },
                side: THREE.DoubleSide,
                transparent: true,
              });

              const leafMesh = new THREE.Mesh(leafGeometry, leafMaterial);
              const position = this.curve.getPoint(t_k);
              const tangent = this.curve.getTangent(t_k);
              const baseAngle = Math.atan2(tangent.y, tangent.x);
              const leafletAngle = THREE.MathUtils.lerp(25, 55, t_k) * THREE.MathUtils.DEG2RAD;
              const angle = baseAngle + side * leafletAngle + rand(-7, 7) * THREE.MathUtils.DEG2RAD;

              leafMesh.position.copy(position);
              leafMesh.rotation.z = angle;
              leafMesh.visible = false;
              this.leafMeshes.push({
                mesh: leafMesh,
                t: t_k,
                isGrowing: false,
                growthProgress: 0,
                growthStartTime: 0,
                growthDuration: rand(0.4, 0.9),
              });
              scene.add(leafMesh);
            });
          }
        }

        update(elapsedTime: number) {
          if (this.progress < 1) {
            this.progress += this.speed;
            if (this.progress > 1) this.progress = 1;
            const indicesToShow = Math.floor(this.progress * this.segments * 6);
            this.stemMesh.geometry.setDrawRange(0, indicesToShow);
          }

          this.leafMeshes.forEach((leaf) => {
            if (!leaf.isGrowing && leaf.t < this.progress) {
              leaf.isGrowing = true;
              leaf.growthStartTime = elapsedTime + rand(-0.12, 0.12);
              leaf.mesh.visible = true;
            }
            if (leaf.isGrowing && leaf.growthProgress < 1) {
              const timeSinceStart = elapsedTime - leaf.growthStartTime;
              leaf.growthProgress = Math.min(1.0, timeSinceStart / leaf.growthDuration);
              leaf.mesh.material.uniforms.uGrow.value = 1.0 - Math.pow(1.0 - leaf.growthProgress, 3);
            }
          });
        }
      }

      // --- Main ---
      function init() {
        const rect = container.getBoundingClientRect();
        width = rect.width;
        height = rect.height;

        scene = new THREE.Scene();
        const aspect = height > 0 ? width / height : 1;
        worldHeight = worldWidth / aspect;

        camera = new THREE.OrthographicCamera(0, worldWidth, worldHeight, 0, 1, 1000);
        camera.position.z = 1;

        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.domElement.style.position = "absolute";
        renderer.domElement.style.inset = "0";
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        container.appendChild(renderer.domElement);

        container.addEventListener("click", onClick);
        container.addEventListener("touchstart", onClick);
        window.addEventListener("resize", onWindowResize);

        tendrils.push(new Tendril(worldWidth / 2, -5));
      }

      function onWindowResize() {
        const rect = container.getBoundingClientRect();
        width = rect.width;
        height = rect.height;
        const aspect = height > 0 ? width / height : 1;
        worldHeight = worldWidth / aspect;
        camera.top = worldHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
      }

      function onClick(event: any) {
        if (audio) {
          audio.currentTime = 0;
          audio.play().catch(() => {});
        }
        const touch = event.touches ? event.touches[0] : event;
        const rect = container.getBoundingClientRect();
        const screenX = (touch.clientX - rect.left) / rect.width;
        const startX = screenX * worldWidth;
        const startY = -5;
        tendrils.push(new Tendril(startX, startY));
      }

      let rafId: number;
      function animate() {
        rafId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();
        tendrils.forEach((t) => t.update(elapsedTime));
        renderer.render(scene, camera);
      }

      init();
      animate();

      // Cleanup on unmount
      cleanup = () => {
        try {
          cancelAnimationFrame(rafId);
        } catch {}
        window.removeEventListener("resize", onWindowResize);
        container.removeEventListener("click", onClick);
        container.removeEventListener("touchstart", onClick);
        try {
          renderer.dispose();
        } catch {}
        try {
          scene.traverse((obj: any) => {
            if (obj.geometry) obj.geometry.dispose?.();
            if (obj.material) {
              if (Array.isArray(obj.material)) obj.material.forEach((m: any) => m.dispose?.());
              else obj.material.dispose?.();
            }
          });
        } catch {}
        try {
          if (renderer?.domElement && renderer?.domElement.parentNode === container) {
            container.removeChild(renderer.domElement);
          }
        } catch {}
      };
    })();

    return () => {
      isMounted = false;
      if (cleanup) cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        backgroundColor: "#e2e8f0", // matches hero/1.css
      }}
    >
      <audio
        ref={audioRef}
        id="click-sound"
        src="https://onload.agency/_codepen_files/a-whimsical-clicking-in-enchanted-woods_v3.mp3"
        preload="auto"
      />
    </div>
  );
}