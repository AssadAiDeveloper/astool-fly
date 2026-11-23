"use client";
import { useEffect, useRef, type CSSProperties } from "react";
import grid from "../lib/grid.json";

export type MapLabel = { lon: number; lat: number; text: string; cls?: string; delay?: string };

const YEMEN: [number, number] = [47.5, 15.4];
// main arcs carry a plane; others are faint "world" links
const ARCS = [
  { to: [46.7, 24.7], main: 1, delay: 0.5, dur: 1.3, speed: 0.17, ph: 0.0 }, // Riyadh
  { to: [39.2, 21.5], main: 1, delay: 0.8, dur: 1.4, speed: 0.15, ph: 0.45 }, // Jeddah
  { to: [58.4, 23.6], main: 1, delay: 1.0, dur: 1.5, speed: 0.16, ph: 0.2 }, // Muscat
  { to: [54.1, 17.0], main: 1, delay: 1.2, dur: 1.2, speed: 0.19, ph: 0.7 }, // Salalah
  { to: [100.5, 13.7], main: 1, delay: 1.4, dur: 2.4, speed: 0.085, ph: 0.1 }, // East Asia
  { to: [101.7, 3.1], main: 1, delay: 1.6, dur: 2.4, speed: 0.075, ph: 0.55 },
  { to: [121.0, 14.6], main: 1, delay: 1.8, dur: 2.6, speed: 0.07, ph: 0.8 },
  { to: [116.4, 39.9], main: 1, delay: 2.0, dur: 2.6, speed: 0.065, ph: 0.35 },
  { to: [31.2, 30.0], main: 0, delay: 2.2, dur: 1.8, speed: 0.1, ph: 0.3 },
  { to: [29.0, 41.0], main: 0, delay: 2.4, dur: 2.0, speed: 0.09, ph: 0.6 },
  { to: [36.8, -1.3], main: 0, delay: 2.6, dur: 1.8, speed: 0.1, ph: 0.9 },
  { to: [38.7, 9.0], main: 0, delay: 2.8, dur: 1.2, speed: 0.12, ph: 0.15 },
];
const PLANE_D =
  "M17.8 19.2 16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z";

type View = { cLon: number; cLat: number; span: number };
const clamp = (v: number, a: number, b: number) => (v < a ? a : v > b ? b : v);

export default function WorldMap({ variant = "hero", labels = [], ariaLabel }: { variant?: "hero" | "banner"; labels?: MapLabel[]; ariaLabel?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const cvRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current!, cv = cvRef.current!;
    const ctx = cv.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const plane = new Path2D(PLANE_D);
    let view: View = variant === "banner" ? { cLon: 76, cLat: 17, span: 140 } : { cLon: 72, cLat: 12.5, span: 120 };
    let W = 1, H = 1, dpr = 1, ppd = 1, running = false, visible = true, raf = 0;
    let dots: number[][] = [];
    const start = performance.now();
    const G = grid as { lon0: number; lat1: number; step: number; cols: number; rows: number; rows_: string[] };

    const project = (lon: number, lat: number): [number, number] => [W / 2 + (lon - view.cLon) * ppd, H / 2 - (lat - view.cLat) * ppd];
    const bez = (p0: number[], p1: number[], p2: number[], u: number) => {
      const a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
      return [a * p0[0] + b * p1[0] + c * p2[0], a * p0[1] + b * p1[1] + c * p2[1]];
    };

    function layout() {
      const r = root.getBoundingClientRect();
      W = Math.max(1, r.width); H = Math.max(1, r.height);
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (variant !== "banner") view = W < 520 ? { cLon: 72, cLat: 13, span: 100 } : { cLon: 72, cLat: 12.5, span: 120 };
      ppd = W / view.span;
      dots = [];
      const rad = G.step * ppd * 0.3;
      for (let r2 = 0; r2 < G.rows; r2++) {
        const row = G.rows_[r2], lat = G.lat1 - (r2 + 0.5) * G.step;
        for (let c = 0; c < G.cols; c++) {
          const ch = row.charCodeAt(c) - 48;
          if (!ch) continue;
          const p = project(G.lon0 + (c + 0.5) * G.step, lat);
          if (p[0] < -6 || p[0] > W + 6 || p[1] < -6 || p[1] > H + 6) continue;
          dots.push([p[0], p[1], ch, rad]);
        }
      }
      root.querySelectorAll<HTMLElement>(".mlab").forEach((el) => {
        const q = project(parseFloat(el.dataset.lon!), parseFloat(el.dataset.lat!));
        el.style.left = q[0] + "px"; el.style.top = q[1] + "px";
      });
      if (!running) draw(reduce ? 99 : (performance.now() - start) / 1000);
    }

    function draw(t: number) {
      ctx.clearRect(0, 0, W, H);
      const sh = ((t * 0.06) % 1.7) - 0.35;
      const base = [0, 0.34, 0.95, 0.62], col = ["", "#9DB8F2", "#FFB020", "#CFE0FF"];
      for (const q of dots) {
        const k = q[2], d = Math.abs(q[0] / W - sh);
        ctx.globalAlpha = Math.min(1, base[k] + (d < 0.13 ? (1 - d / 0.13) * 0.3 : 0));
        ctx.fillStyle = col[k];
        ctx.beginPath(); ctx.arc(q[0], q[1], k === 2 ? q[3] * 1.35 : q[3], 0, 6.2832); ctx.fill();
      }
      ctx.globalAlpha = 1;
      const Y = project(YEMEN[0], YEMEN[1]);
      const sc = ppd / 5.6 + 0.4, pulse = 0.5 + 0.5 * Math.sin(t * 2);
      const gr = ctx.createRadialGradient(Y[0], Y[1], 0, Y[0], Y[1], 60 * sc);
      gr.addColorStop(0, `rgba(255,176,32,${0.45 + pulse * 0.15})`); gr.addColorStop(1, "rgba(255,176,32,0)");
      ctx.fillStyle = gr; ctx.beginPath(); ctx.arc(Y[0], Y[1], 60 * sc, 0, 6.2832); ctx.fill();
      for (let i = 0; i < 3; i++) {
        const ph = (t * 0.45 + i / 3) % 1;
        ctx.strokeStyle = `rgba(255,176,32,${(1 - ph) * 0.65})`; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(Y[0], Y[1], 5 + ph * 34 * sc, 0, 6.2832); ctx.stroke();
      }
      for (const A of ARCS) {
        const P2 = project(A.to[0], A.to[1]);
        const dx = P2[0] - Y[0], dy = P2[1] - Y[1], dist = Math.sqrt(dx * dx + dy * dy);
        const P1 = [(Y[0] + P2[0]) / 2, (Y[1] + P2[1]) / 2 - dist * 0.3];
        let p = clamp((t - A.delay) / A.dur, 0, 1); p = p * (2 - p);
        if (p <= 0) continue;
        const n = Math.max(6, Math.round(44 * p));
        const g = ctx.createLinearGradient(Y[0], Y[1], P2[0], P2[1]);
        if (A.main) { g.addColorStop(0, "rgba(255,176,32,.95)"); g.addColorStop(1, "rgba(255,107,0,.9)"); }
        else { g.addColorStop(0, "rgba(200,220,255,.55)"); g.addColorStop(1, "rgba(200,220,255,.12)"); }
        ctx.lineCap = "round";
        for (let pass = 0; pass < 2; pass++) {
          ctx.beginPath();
          for (let j = 0; j <= n; j++) { const pt = bez(Y, P1, P2, (j / n) * p); if (j) ctx.lineTo(pt[0], pt[1]); else ctx.moveTo(pt[0], pt[1]); }
          ctx.strokeStyle = g; ctx.globalAlpha = pass ? 1 : 0.18; ctx.lineWidth = pass ? (A.main ? 1.5 : 1) : 5; ctx.stroke();
        }
        ctx.globalAlpha = 1;
        if (p < 1) continue;
        const rp = (t * 0.55 + A.ph) % 1;
        ctx.fillStyle = A.main ? "#FFB020" : "#CFE0FF";
        ctx.beginPath(); ctx.arc(P2[0], P2[1], A.main ? 3.2 : 2.2, 0, 6.2832); ctx.fill();
        ctx.strokeStyle = (A.main ? "rgba(255,176,32," : "rgba(207,224,255,") + (1 - rp) * 0.55 + ")"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.arc(P2[0], P2[1], 3 + rp * 11, 0, 6.2832); ctx.stroke();
        const u = reduce ? 0.5 + A.ph * 0.3 : (t * A.speed + A.ph) % 1;
        for (let j = 12; j >= 1; j--) {
          const uu = u - j * 0.012; if (uu < 0) continue;
          const tp = bez(Y, P1, P2, uu);
          ctx.globalAlpha = (1 - j / 13) * (A.main ? 0.7 : 0.4);
          ctx.fillStyle = A.main ? "#FFD27A" : "#CFE0FF";
          ctx.beginPath(); ctx.arc(tp[0], tp[1], A.main ? 1.9 : 1.2, 0, 6.2832); ctx.fill();
        }
        ctx.globalAlpha = 1;
        const hp = bez(Y, P1, P2, u);
        if (A.main) {
          const tx = 2 * (1 - u) * (P1[0] - Y[0]) + 2 * u * (P2[0] - P1[0]);
          const east = tx >= 0; // plane stays level: nose east or west
          ctx.save(); ctx.translate(hp[0], hp[1]); ctx.rotate(east ? Math.PI / 4 : -Math.PI / 4);
          ctx.scale(east ? 0.72 : -0.72, 0.72); ctx.translate(-12, -12);
          ctx.fillStyle = "#FFFFFF"; ctx.fill(plane); ctx.restore();
        } else {
          ctx.fillStyle = "#FFFFFF"; ctx.beginPath(); ctx.arc(hp[0], hp[1], 2, 0, 6.2832); ctx.fill();
        }
      }
    }

    const frame = (now: number) => { if (!running) return; draw((now - start) / 1000); raf = requestAnimationFrame(frame); };
    const play = () => { if (reduce || running || !visible || document.hidden) return; running = true; raf = requestAnimationFrame(frame); };
    const stop = () => { running = false; cancelAnimationFrame(raf); };
    const onVis = () => (document.hidden ? stop() : play());

    layout();
    const ro = new ResizeObserver(layout); ro.observe(root);
    const io = new IntersectionObserver((e) => { visible = e[0].isIntersecting; visible ? play() : stop(); }); io.observe(root);
    document.addEventListener("visibilitychange", onVis);
    play();
    if (reduce) draw(99);
    return () => { stop(); ro.disconnect(); io.disconnect(); document.removeEventListener("visibilitychange", onVis); };
  }, [variant]);

  return (
    <div ref={rootRef} className={variant === "banner" ? "mapbg" : "mapwrap"} {...(ariaLabel ? { role: "img", "aria-label": ariaLabel } : { "aria-hidden": true })}>
      <canvas ref={cvRef} aria-hidden="true" />
      {labels.map((l, i) => (
        <span key={i} className={"mlab " + (l.cls ?? "")} data-lon={l.lon} data-lat={l.lat} style={{ "--d": l.delay ?? "1s" } as CSSProperties}>
          {l.text}
        </span>
      ))}
    </div>
  );
}
