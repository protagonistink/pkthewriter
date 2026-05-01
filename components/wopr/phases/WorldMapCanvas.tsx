"use client";

import { useEffect, useRef, useState } from "react";
import styles from "../wopr.module.css";

type GeoData = { data: GeoJsonRoot | null; error: boolean };
export type GeoJsonRoot = {
  type: "FeatureCollection";
  features: GeoFeature[];
};
type GeoFeature = {
  type: "Feature";
  geometry:
    | { type: "Polygon"; coordinates: number[][][] }
    | { type: "MultiPolygon"; coordinates: number[][][][] };
};

type Origin = { lon: number; lat: number };
type Target = { lon: number; lat: number };

const ORIGINS: Origin[] = [
  { lon: -98, lat: 39 }, // Central US
  { lon: 37, lat: 55 }, // Western Russia
  { lon: 92, lat: 56 }, // Siberia
  { lon: -112, lat: 47 }, // US Northern (Montana)
];

const TARGETS: Target[] = [
  { lon: 37, lat: 55 }, // Moscow
  { lon: 30, lat: 50 }, // Kyiv
  { lon: 116, lat: 40 }, // Beijing
  { lon: -77, lat: 39 }, // DC
  { lon: -118, lat: 34 }, // LA
  { lon: 2, lat: 49 }, // Paris
  { lon: -0.1, lat: 51 }, // London
  { lon: 139, lat: 36 }, // Tokyo
  { lon: -74, lat: 40 }, // NYC
  { lon: 13, lat: 52 }, // Berlin
];

function projectLonLat(lon: number, lat: number, w: number, h: number) {
  // Simple equirectangular projection.
  const x = ((lon + 180) / 360) * w;
  const y = ((90 - lat) / 180) * h;
  return { x, y };
}

function snap(v: number, step: number) {
  return Math.round(v / step) * step;
}

function renderMapToCanvas(geo: GeoData, w: number, h: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  ctx.clearRect(0, 0, w, h);
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = "rgba(120, 170, 220, 0.55)";
  ctx.fillStyle = "rgba(40, 70, 110, 0.18)";

  if (geo.error || !geo.data) {
    // Fallback grid: meridians, parallels, two concentric circles.
    ctx.strokeStyle = "rgba(120, 170, 220, 0.32)";
    for (let lon = -180; lon <= 180; lon += 30) {
      const { x } = projectLonLat(lon, 0, w, h);
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let lat = -60; lat <= 60; lat += 20) {
      const { y } = projectLonLat(0, lat, w, h);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.32, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, Math.min(w, h) * 0.18, 0, Math.PI * 2);
    ctx.stroke();
    return canvas;
  }

  const SNAP = 6;
  for (const feature of geo.data.features) {
    const polygons =
      feature.geometry.type === "Polygon"
        ? [feature.geometry.coordinates]
        : feature.geometry.coordinates;
    for (const poly of polygons) {
      for (const ring of poly) {
        if (ring.length < 2) continue;
        ctx.beginPath();
        for (let i = 0; i < ring.length; i += 1) {
          const [lon, lat] = ring[i];
          const { x, y } = projectLonLat(lon, lat, w, h);
          const sx = snap(x, SNAP);
          const sy = snap(y, SNAP);
          if (i === 0) ctx.moveTo(sx, sy);
          else ctx.lineTo(sx, sy);
        }
        ctx.closePath();
        ctx.fill();
        ctx.stroke();
      }
    }
  }
  return canvas;
}

type Arc = {
  x1: number; y1: number;
  x2: number; y2: number;
  cx: number; cy: number;
  spawnedAt: number;
  durationMs: number;
  color: string;
};

export function WorldMapCanvas({
  geoRef,
  reduceMotion,
  onDone,
  totalMs,
}: {
  geoRef: React.MutableRefObject<GeoData>;
  reduceMotion: boolean;
  onDone: () => void;
  totalMs: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showWinner, setShowWinner] = useState(false);

  useEffect(() => {
    if (reduceMotion) {
      // Skip the cinematic; flash to white then resolve.
      const t = window.setTimeout(onDone, 400);
      return () => clearTimeout(t);
    }
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const cssW = canvas.clientWidth || window.innerWidth;
    const cssH = canvas.clientHeight || window.innerHeight;
    canvas.width = cssW * dpr;
    canvas.height = cssH * dpr;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.scale(dpr, dpr);

    const mapCanvas = renderMapToCanvas(geoRef.current, cssW, cssH);

    // Fill background and draw the map once.
    ctx.fillStyle = "#06121f";
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.drawImage(mapCanvas, 0, 0);

    const arcs: Arc[] = [];
    const startedAt = performance.now();
    const ARC_PHASE_MS = totalMs * 0.78;
    const WHITE_PHASE_MS = totalMs - ARC_PHASE_MS;
    let lastSpawn = startedAt;
    let cancelled = false;
    let rafId = 0;

    const spawnArc = (now: number) => {
      const origin = ORIGINS[Math.floor(Math.random() * ORIGINS.length)];
      const target = TARGETS[Math.floor(Math.random() * TARGETS.length)];
      const o = projectLonLat(origin.lon, origin.lat, cssW, cssH);
      const t = projectLonLat(target.lon, target.lat, cssW, cssH);
      const cx = (o.x + t.x) / 2 + (Math.random() - 0.5) * 80;
      const cy = Math.min(o.y, t.y) - Math.hypot(t.x - o.x, t.y - o.y) * 0.4;
      arcs.push({
        x1: o.x, y1: o.y,
        x2: t.x, y2: t.y,
        cx, cy,
        spawnedAt: now,
        durationMs: 700 + Math.random() * 500,
        color: Math.random() < 0.7 ? "rgba(220, 245, 255, 0.85)" : "rgba(255, 180, 140, 0.85)",
      });
    };

    const drawImpactFlare = (x: number, y: number, radius: number) => {
      ctx.save();
      ctx.globalCompositeOperation = "screen";
      const grad = ctx.createRadialGradient(x, y, 0, x, y, radius);
      grad.addColorStop(0, "rgba(255,255,255,1)");
      grad.addColorStop(0.3, "rgba(200,220,255,0.8)");
      grad.addColorStop(1, "rgba(100,150,255,0)");
      ctx.fillStyle = grad;
      ctx.fillRect(x - radius, y - radius, radius * 2, radius * 2);
      ctx.restore();
    };

    const tick = () => {
      if (cancelled) return;
      const now = performance.now();
      const elapsed = now - startedAt;

      if (elapsed < ARC_PHASE_MS) {
        // Spawn rate accelerates: every 250ms early → every 80ms late.
        const t = elapsed / ARC_PHASE_MS;
        const spawnInterval = 240 - 160 * t;
        if (now - lastSpawn >= spawnInterval) {
          spawnArc(now);
          lastSpawn = now;
        }

        // Draw active arc segments.
        for (let i = arcs.length - 1; i >= 0; i -= 1) {
          const a = arcs[i];
          const arcT = Math.min(1, (now - a.spawnedAt) / a.durationMs);
          if (arcT <= 0) continue;
          ctx.save();
          ctx.lineWidth = 1.4;
          ctx.strokeStyle = a.color;
          ctx.beginPath();
          ctx.moveTo(a.x1, a.y1);
          // Approximate the partial bezier by sampling.
          const SAMPLES = 24;
          for (let s = 1; s <= SAMPLES; s += 1) {
            const u = (s / SAMPLES) * arcT;
            const px = (1 - u) * (1 - u) * a.x1 + 2 * (1 - u) * u * a.cx + u * u * a.x2;
            const py = (1 - u) * (1 - u) * a.y1 + 2 * (1 - u) * u * a.cy + u * u * a.y2;
            ctx.lineTo(px, py);
          }
          ctx.stroke();
          ctx.restore();

          if (arcT >= 1) {
            drawImpactFlare(a.x2, a.y2, 30 + Math.random() * 14);
            arcs.splice(i, 1);
          }
        }
      } else {
        // Whiteout phase.
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fillRect(0, 0, cssW, cssH);
        if (elapsed > ARC_PHASE_MS + WHITE_PHASE_MS * 0.55 && !showWinner) {
          setShowWinner(true);
        }
        if (elapsed >= totalMs) {
          // Hold briefly on white, then hard cut.
          window.setTimeout(onDone, 300);
          return;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelled = true;
      cancelAnimationFrame(rafId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion, totalMs]);

  return (
    <div className={styles.mapRoot}>
      <canvas ref={canvasRef} className={styles.mapCanvas} />
      <div className={`${styles.mapWinner} ${showWinner ? styles.mapWinnerVisible : ""}`}>
        WINNER:
      </div>
    </div>
  );
}
