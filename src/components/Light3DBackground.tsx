"use client";

import { useEffect, useRef } from "react";

type Vec3 = { x: number; y: number; z: number };

type Particle = {
  x: number;
  y: number;
  z: number;
  r: number;
  speed: number;
};

type MotifKind = "lotus" | "leaf" | "cupping" | "rings" | "yoga" | "book";

type Motif = {
  kind: MotifKind;
  x: number;
  y: number;
  z: number;
  size: number;
  rot: number;
  spin: number;
  drift: number;
  phase: number;
  accent: boolean;
};

type Cube = {
  x: number;
  y: number;
  z: number;
  size: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  spinX: number;
  spinY: number;
  spinZ: number;
  drift: number;
  phase: number;
  accent: boolean;
};

type SceneVariant = "light" | "dark";

type Palette = {
  gridNear: string;
  gridFar: string;
  gridCross: (alpha: number) => string;
  strokeAccent: (alpha: number) => string;
  stroke: (alpha: number) => string;
  fillAccent: (alpha: number) => string;
  fill: (alpha: number) => string;
  particle: (alpha: number) => string;
  glow0: string;
  glow1: string;
  glow2: string;
};

const PALETTES: Record<SceneVariant, Palette> = {
  light: {
    gridNear: "rgba(14, 106, 111, 0.22)",
    gridFar: "rgba(14, 106, 111, 0)",
    gridCross: (a) => `rgba(14, 106, 111, ${a})`,
    strokeAccent: (a) => `rgba(31, 148, 153, ${a})`,
    stroke: (a) => `rgba(14, 106, 111, ${a * 0.95})`,
    fillAccent: (a) => `rgba(200, 255, 74, ${a * 0.12})`,
    fill: (a) => `rgba(31, 148, 153, ${a * 0.1})`,
    particle: (a) => `rgba(31, 148, 153, ${a})`,
    glow0: "rgba(31, 148, 153, 0.14)",
    glow1: "rgba(14, 106, 111, 0.05)",
    glow2: "rgba(14, 106, 111, 0)",
  },
  dark: {
    gridNear: "rgba(255, 255, 255, 0.18)",
    gridFar: "rgba(200, 255, 74, 0)",
    gridCross: (a) => `rgba(255, 255, 255, ${a})`,
    strokeAccent: (a) => `rgba(200, 255, 74, ${a})`,
    stroke: (a) => `rgba(255, 255, 255, ${a * 0.88})`,
    fillAccent: (a) => `rgba(200, 255, 74, ${a * 0.12})`,
    fill: (a) => `rgba(255, 255, 255, ${a * 0.06})`,
    particle: (a) => `rgba(200, 255, 74, ${a * 0.85})`,
    glow0: "rgba(200, 255, 74, 0.07)",
    glow1: "rgba(255, 255, 255, 0.035)",
    glow2: "rgba(255, 255, 255, 0)",
  },
};

function project(
  p: Vec3,
  w: number,
  h: number,
  fov: number,
  cameraY: number,
): { x: number; y: number; s: number } | null {
  const z = p.z;
  if (z <= 0.4) return null;
  const scale = fov / z;
  return {
    x: w * 0.5 + p.x * scale,
    y: h * 0.55 + (p.y - cameraY) * scale,
    s: scale,
  };
}

function rotatePoint(p: Vec3, rx: number, ry: number, rz: number): Vec3 {
  let { x, y, z } = p;
  const cosY = Math.cos(ry);
  const sinY = Math.sin(ry);
  const x1 = x * cosY - z * sinY;
  const z1 = x * sinY + z * cosY;
  x = x1;
  z = z1;

  const cosX = Math.cos(rx);
  const sinX = Math.sin(rx);
  const y1 = y * cosX - z * sinX;
  const z2 = y * sinX + z * cosX;
  y = y1;
  z = z2;

  const cosZ = Math.cos(rz);
  const sinZ = Math.sin(rz);
  const x2 = x * cosZ - y * sinZ;
  const y2 = x * sinZ + y * cosZ;

  return { x: x2, y: y2, z };
}

const CUBE_EDGES: [number, number][] = [
  [0, 1],
  [1, 3],
  [3, 2],
  [2, 0],
  [4, 5],
  [5, 7],
  [7, 6],
  [6, 4],
  [0, 4],
  [1, 5],
  [2, 6],
  [3, 7],
];

/** Local 2D wellness outlines (unit box roughly -1..1). */
function pathLotus(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 - Math.PI / 2;
    const px = Math.cos(a) * 0.22;
    const py = Math.sin(a) * 0.18;
    ctx.moveTo(0, 0.15);
    ctx.quadraticCurveTo(px * 2.2, py * 2.2 - 0.2, Math.cos(a) * 0.95, Math.sin(a) * 0.78 - 0.05);
    ctx.quadraticCurveTo(px * 1.1, py * 1.1, 0, 0.15);
  }
  ctx.moveTo(0, 0.35);
  ctx.ellipse(0, 0.42, 0.18, 0.1, 0, 0, Math.PI * 2);
}

function pathLeaf(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(0, -1);
  ctx.bezierCurveTo(0.85, -0.45, 0.85, 0.45, 0, 1);
  ctx.bezierCurveTo(-0.85, 0.45, -0.85, -0.45, 0, -1);
  ctx.moveTo(0, -0.85);
  ctx.quadraticCurveTo(0.08, 0, 0, 0.75);
  ctx.moveTo(0, -0.2);
  ctx.quadraticCurveTo(0.35, -0.05, 0.45, 0.15);
  ctx.moveTo(0, 0.15);
  ctx.quadraticCurveTo(-0.32, 0.25, -0.4, 0.42);
}

function pathCupping(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.ellipse(0, -0.55, 0.72, 0.22, 0, 0, Math.PI * 2);
  ctx.moveTo(-0.72, -0.55);
  ctx.quadraticCurveTo(-0.9, 0.35, -0.45, 0.85);
  ctx.quadraticCurveTo(0, 1.05, 0.45, 0.85);
  ctx.quadraticCurveTo(0.9, 0.35, 0.72, -0.55);
  ctx.moveTo(-0.35, -0.15);
  ctx.quadraticCurveTo(0, 0.05, 0.35, -0.15);
}

function pathRings(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.ellipse(0, 0, 1, 0.72, 0, 0, Math.PI * 2);
  ctx.moveTo(0.72, 0);
  ctx.ellipse(0, 0, 0.72, 0.5, 0, 0, Math.PI * 2);
  ctx.moveTo(0.42, 0);
  ctx.ellipse(0, 0, 0.42, 0.28, 0, 0, Math.PI * 2);
  ctx.moveTo(0.12, 0);
  ctx.arc(0, 0, 0.12, 0, Math.PI * 2);
}

function pathYoga(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  // head
  ctx.arc(0, -0.72, 0.2, 0, Math.PI * 2);
  // torso
  ctx.moveTo(0, -0.5);
  ctx.lineTo(0, 0.05);
  // arms raised in soft arc
  ctx.moveTo(0, -0.35);
  ctx.quadraticCurveTo(-0.55, -0.55, -0.85, -0.15);
  ctx.moveTo(0, -0.35);
  ctx.quadraticCurveTo(0.55, -0.55, 0.85, -0.15);
  // crossed legs
  ctx.moveTo(0, 0.05);
  ctx.quadraticCurveTo(-0.55, 0.25, -0.9, 0.7);
  ctx.moveTo(0, 0.05);
  ctx.quadraticCurveTo(0.55, 0.25, 0.9, 0.7);
  ctx.moveTo(-0.55, 0.55);
  ctx.quadraticCurveTo(0, 0.85, 0.55, 0.55);
}

function pathBook(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(0, -0.15);
  ctx.lineTo(-0.95, -0.55);
  ctx.lineTo(-0.95, 0.75);
  ctx.lineTo(0, 0.95);
  ctx.lineTo(0.95, 0.75);
  ctx.lineTo(0.95, -0.55);
  ctx.closePath();
  ctx.moveTo(0, -0.15);
  ctx.lineTo(0, 0.95);
  ctx.moveTo(-0.7, -0.25);
  ctx.lineTo(-0.7, 0.65);
  ctx.moveTo(0.7, -0.25);
  ctx.lineTo(0.7, 0.65);
}

const PATHS: Record<MotifKind, (ctx: CanvasRenderingContext2D) => void> = {
  lotus: pathLotus,
  leaf: pathLeaf,
  cupping: pathCupping,
  rings: pathRings,
  yoga: pathYoga,
  book: pathBook,
};

type Light3DBackgroundProps = {
  className?: string;
  variant?: SceneVariant;
};

export function Light3DBackground({
  className = "",
  variant = "light",
}: Light3DBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const palette = PALETTES[variant];
    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let raf = 0;
    let running = true;
    let inView = true;
    let width = 0;
    let height = 0;
    let dpr = 1;
    let gridOffset = 0;
    let t = 0;

    const particles: Particle[] = Array.from({ length: 36 }, () => ({
      x: (Math.random() - 0.5) * 28,
      y: (Math.random() - 0.5) * 14,
      z: 2 + Math.random() * 26,
      r: 0.8 + Math.random() * 2.2,
      speed: 0.008 + Math.random() * 0.02,
    }));

    const motifs: Motif[] = [
      {
        kind: "lotus",
        x: -7.2,
        y: -1.2,
        z: 11,
        size: 1.55,
        rot: 0.2,
        spin: 0.004,
        drift: 0.32,
        phase: 0,
        accent: true,
      },
      {
        kind: "cupping",
        x: 8.2,
        y: 0.4,
        z: 13.5,
        size: 1.45,
        rot: -0.3,
        spin: -0.0035,
        drift: 0.4,
        phase: 1.3,
        accent: false,
      },
      {
        kind: "yoga",
        x: -3.8,
        y: 1.8,
        z: 17,
        size: 1.7,
        rot: 0.1,
        spin: 0.0028,
        drift: 0.5,
        phase: 2.6,
        accent: true,
      },
      {
        kind: "leaf",
        x: 5.4,
        y: -2.2,
        z: 9.2,
        size: 1.25,
        rot: 0.6,
        spin: 0.005,
        drift: 0.28,
        phase: 4,
        accent: false,
      },
      {
        kind: "rings",
        x: 1.2,
        y: 1.6,
        z: 20,
        size: 1.6,
        rot: 0,
        spin: 0.006,
        drift: 0.45,
        phase: 5.1,
        accent: true,
      },
      {
        kind: "book",
        x: -9.2,
        y: 0.8,
        z: 15,
        size: 1.35,
        rot: -0.5,
        spin: -0.0025,
        drift: 0.35,
        phase: 3.2,
        accent: false,
      },
    ];

    // Wireframe cubes mixed in for geometric depth
    const cubes: Cube[] = [
      {
        x: 6.8,
        y: -0.8,
        z: 16,
        size: 1.5,
        rotX: 0.5,
        rotY: 0.9,
        rotZ: 0.3,
        spinX: 0.003,
        spinY: 0.0055,
        spinZ: 0.002,
        drift: 0.38,
        phase: 0.7,
        accent: true,
      },
      {
        x: -5.5,
        y: -2.0,
        z: 14,
        size: 1.2,
        rotX: 0.8,
        rotY: 0.4,
        rotZ: 0.6,
        spinX: 0.004,
        spinY: 0.0045,
        spinZ: 0.0025,
        drift: 0.42,
        phase: 2.1,
        accent: false,
      },
      {
        x: 3.2,
        y: 2.4,
        z: 12,
        size: 1.05,
        rotX: 0.3,
        rotY: 1.1,
        rotZ: 0.2,
        spinX: 0.0025,
        spinY: 0.006,
        spinZ: 0.0015,
        drift: 0.3,
        phase: 3.8,
        accent: false,
      },
      {
        x: -1.5,
        y: -1.6,
        z: 21,
        size: 1.85,
        rotX: 1.0,
        rotY: 0.55,
        rotZ: 0.4,
        spinX: 0.002,
        spinY: 0.0035,
        spinZ: 0.003,
        drift: 0.48,
        phase: 5.5,
        accent: true,
      },
    ];

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const rect = parent.getBoundingClientRect();
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawGrid = (fov: number, cameraY: number) => {
      const spacing = 2.2;
      const cols = 18;
      const rows = 16;
      const far = 30;
      const near = 3.5;

      ctx.lineWidth = 1;

      for (let i = -cols; i <= cols; i++) {
        const x = i * spacing;
        const a = project({ x, y: 3.6, z: near }, width, height, fov, cameraY);
        const b = project({ x, y: 3.6, z: far }, width, height, fov, cameraY);
        if (!a || !b) continue;
        const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        g.addColorStop(0, palette.gridNear);
        g.addColorStop(1, palette.gridFar);
        ctx.strokeStyle = g;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }

      for (let j = 0; j < rows; j++) {
        const z = near + ((j * spacing + gridOffset) % spacing);
        const left = project(
          { x: -cols * spacing, y: 3.6, z },
          width,
          height,
          fov,
          cameraY,
        );
        const right = project(
          { x: cols * spacing, y: 3.6, z },
          width,
          height,
          fov,
          cameraY,
        );
        if (!left || !right) continue;
        const crossMul = variant === "dark" ? 0.22 : 0.26;
        const alpha = Math.max(0, crossMul * (1 - (z - near) / (far - near)));
        ctx.strokeStyle = palette.gridCross(alpha);
        ctx.beginPath();
        ctx.moveTo(left.x, left.y);
        ctx.lineTo(right.x, right.y);
        ctx.stroke();
      }
    };

    const drawCube = (cube: Cube, fov: number, cameraY: number) => {
      const half = cube.size * 0.5;
      const corners: Vec3[] = [];
      for (let i = 0; i < 8; i++) {
        const local = {
          x: (i & 1 ? 1 : -1) * half,
          y: (i & 2 ? 1 : -1) * half,
          z: (i & 4 ? 1 : -1) * half,
        };
        const rotated = rotatePoint(local, cube.rotX, cube.rotY, cube.rotZ);
        corners.push({
          x: cube.x + rotated.x,
          y:
            cube.y +
            rotated.y +
            Math.sin(t * 0.7 + cube.phase) * cube.drift,
          z: cube.z + rotated.z,
        });
      }

      const projected = corners.map((c) =>
        project(c, width, height, fov, cameraY),
      );
      if (projected.some((p) => !p)) return;

      const alpha = Math.max(0.14, Math.min(0.52, 1.15 - cube.z / 28));

      ctx.lineWidth = cube.accent ? 1.7 : 1.2;
      ctx.strokeStyle = cube.accent
        ? palette.strokeAccent(alpha)
        : palette.stroke(alpha);

      for (const [a, b] of CUBE_EDGES) {
        const pa = projected[a];
        const pb = projected[b];
        if (!pa || !pb) continue;
        ctx.beginPath();
        ctx.moveTo(pa.x, pa.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }

      const faceIdx = [0, 1, 3, 2];
      ctx.beginPath();
      faceIdx.forEach((idx, n) => {
        const p = projected[idx];
        if (!p) return;
        if (n === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      });
      ctx.closePath();
      ctx.fillStyle = cube.accent
        ? palette.fillAccent(alpha)
        : palette.fill(alpha);
      ctx.fill();
    };

    const drawMotif = (motif: Motif, fov: number, cameraY: number) => {
      const y =
        motif.y + Math.sin(t * 0.7 + motif.phase) * motif.drift;
      const center = project(
        { x: motif.x, y, z: motif.z },
        width,
        height,
        fov,
        cameraY,
      );
      if (!center) return;

      const alpha = Math.max(0.18, Math.min(0.62, 1.2 - motif.z / 28));
      const pxSize = motif.size * center.s * 0.42;
      // slight foreshortening as it tips in “3D”
      const tip = 0.78 + Math.cos(motif.rot) * 0.22;

      ctx.save();
      ctx.translate(center.x, center.y);
      ctx.rotate(Math.sin(motif.rot) * 0.35);
      ctx.scale(pxSize, pxSize * tip);
      ctx.lineWidth = (motif.accent ? 1.7 : 1.25) / pxSize;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.strokeStyle = motif.accent
        ? palette.strokeAccent(alpha)
        : palette.stroke(alpha);
      ctx.fillStyle = motif.accent
        ? palette.fillAccent(alpha)
        : palette.fill(alpha);

      PATHS[motif.kind](ctx);
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    };

    const drawParticles = (fov: number, cameraY: number) => {
      for (const p of particles) {
        const scr = project(p, width, height, fov, cameraY);
        if (!scr) continue;
        const alpha = Math.max(0.08, Math.min(0.5, 0.6 - p.z / 40));
        ctx.beginPath();
        ctx.fillStyle = palette.particle(alpha);
        ctx.arc(
          scr.x,
          scr.y,
          Math.max(0.7, p.r * (scr.s * 0.1)),
          0,
          Math.PI * 2,
        );
        ctx.fill();
      }
    };

    const frame = () => {
      if (!running || !inView) return;
      t += 0.016;
      if (!reduceMotion) {
        gridOffset = (gridOffset + 0.04) % 2.2;
        for (const motif of motifs) {
          motif.rot += motif.spin;
        }
        for (const cube of cubes) {
          cube.rotX += cube.spinX;
          cube.rotY += cube.spinY;
          cube.rotZ += cube.spinZ;
        }
        for (const p of particles) {
          p.z -= p.speed;
          if (p.z < 1.5) {
            p.z = 26 + Math.random() * 4;
            p.x = (Math.random() - 0.5) * 28;
            p.y = (Math.random() - 0.5) * 14;
          }
        }
      }

      ctx.clearRect(0, 0, width, height);

      const fov = Math.max(width, height) * 0.72;
      const cameraY = Math.sin(t * 0.25) * 0.15;

      const glow = ctx.createRadialGradient(
        width * 0.5,
        height * 0.42,
        10,
        width * 0.5,
        height * 0.42,
        Math.max(width, height) * 0.45,
      );
      glow.addColorStop(0, palette.glow0);
      glow.addColorStop(0.55, palette.glow1);
      glow.addColorStop(1, palette.glow2);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, width, height);

      drawGrid(fov, cameraY);

      type LayerItem =
        | { type: "motif"; z: number; motif: Motif }
        | { type: "cube"; z: number; cube: Cube };

      const layers: LayerItem[] = [
        ...motifs.map((motif) => ({
          type: "motif" as const,
          z: motif.z,
          motif,
        })),
        ...cubes.map((cube) => ({ type: "cube" as const, z: cube.z, cube })),
      ].sort((a, b) => b.z - a.z);

      for (const item of layers) {
        if (item.type === "motif") drawMotif(item.motif, fov, cameraY);
        else drawCube(item.cube, fov, cameraY);
      }

      drawParticles(fov, cameraY);

      if (!reduceMotion) raf = requestAnimationFrame(frame);
    };

    const kick = () => {
      if (reduceMotion || document.hidden || !inView) return;
      cancelAnimationFrame(raf);
      running = true;
      raf = requestAnimationFrame(frame);
    };

    resize();
    frame();

    const ro = new ResizeObserver(() => {
      resize();
      if (reduceMotion) frame();
    });
    if (canvas.parentElement) ro.observe(canvas.parentElement);

    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry?.isIntersecting ?? false;
        if (inView) kick();
        else {
          running = false;
          cancelAnimationFrame(raf);
        }
      },
      { rootMargin: "80px", threshold: 0.01 },
    );
    io.observe(canvas);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else {
        kick();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [variant]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-0 h-full w-full ${className}`}
    />
  );
}
