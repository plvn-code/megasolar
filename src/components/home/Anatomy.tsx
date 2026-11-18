"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { layers } from "@/lib/copy";
import { clamp, useScrollProgress } from "@/lib/motion";
import { Icon } from "../Icons";

export type LayerStat = { id: string; count: number; from: string; brands: string };

/* ---------- isometric helpers (plane 280 × 180, z up) ---------- */
const C = 0.866;
const S = 0.5;
const OX = 175;
const OY = 520;
const pt = (x: number, y: number, z = 0) => `${(OX + (x - y) * C).toFixed(1)},${(OY + (x + y) * S - z).toFixed(1)}`;
const quad = (a: number[], b: number[], c: number[], d: number[]) => [a, b, c, d].map((p) => pt(p[0], p[1], p[2] ?? 0)).join(" ");
const plane = (x0: number, y0: number, x1: number, y1: number, z = 0) => quad([x0, y0, z], [x1, y0, z], [x1, y1, z], [x0, y1, z]);

function Box({ x, y, z = 0, w, d, h, cls }: { x: number; y: number; z?: number; w: number; d: number; h: number; cls: string }) {
  return (
    <g className={cls}>
      <polygon className="f-side" points={quad([x + w, y, z], [x + w, y + d, z], [x + w, y + d, z + h], [x + w, y, z + h])} />
      <polygon className="f-front" points={quad([x, y + d, z], [x + w, y + d, z], [x + w, y + d, z + h], [x, y + d, z + h])} />
      <polygon className="f-top" points={plane(x, y, x + w, y + d, z + h)} />
    </g>
  );
}

const PW = 50;
const PD = 54;
const panels = Array.from({ length: 15 }, (_, i) => ({ x: 8 + (i % 5) * (PW + 4), y: 6 + Math.floor(i / 5) * (PD + 4) }));

function LayerArt({ i }: { i: number }) {
  if (i === 0)
    return (
      <>
        {panels.map((p, k) => (
          <g key={k} className="an-panel" style={{ ["--k" as string]: k }}>
            <polygon className="an-panel-edge" points={quad([p.x, p.y + PD, 4], [p.x + PW, p.y + PD, 4], [p.x + PW, p.y + PD, 8], [p.x, p.y + PD, 8])} />
            <polygon className="an-panel-face" points={plane(p.x, p.y, p.x + PW, p.y + PD, 8)} />
            <polyline className="an-panel-grid" points={`${pt(p.x + PW / 2, p.y, 8)} ${pt(p.x + PW / 2, p.y + PD, 8)}`} />
            <polyline className="an-panel-grid" points={`${pt(p.x, p.y + PD / 3, 8)} ${pt(p.x + PW, p.y + PD / 3, 8)}`} />
            <polyline className="an-panel-grid" points={`${pt(p.x, p.y + (2 * PD) / 3, 8)} ${pt(p.x + PW, p.y + (2 * PD) / 3, 8)}`} />
          </g>
        ))}
      </>
    );
  if (i === 1)
    return (
      <>
        {[22, 84, 146].map((y) =>
          [30, 100, 170, 240].map((x) => <Box key={`${x}-${y}`} x={x} y={y - 2} w={8} d={14} h={4} cls="an-metal an-hook" />),
        )}
        {[22, 84, 146].map((y) => (
          <Box key={y} x={4} y={y} w={272} d={8} h={9} cls="an-metal" />
        ))}
        {[22, 84, 146].map((y) => (
          <Box key={`c${y}`} x={4} y={y + 30} w={272} d={5} h={6} cls="an-metal an-metal-2" />
        ))}
      </>
    );
  if (i === 2)
    return (
      <>
        <path className="an-cable" d={`M${pt(16, 172)} L${pt(16, 30)} L${pt(196, 30)}`} />
        <path className="an-cable an-cable-2" d={`M${pt(26, 172)} L${pt(26, 40)} L${pt(196, 40)}`} />
        <path className="an-flow" d={`M${pt(16, 172)} L${pt(16, 30)} L${pt(196, 30)}`} />
        <path className="an-cable" d={`M${pt(250, 52)} L${pt(250, 150)} L${pt(120, 150)}`} />
        <path className="an-flow an-flow-2" d={`M${pt(250, 52)} L${pt(250, 150)} L${pt(120, 150)}`} />
        {[60, 110].map((y) => (
          <Box key={y} x={12} y={y} w={18} d={7} h={5} cls="an-mc4" />
        ))}
        <Box x={196} y={18} w={58} d={18} h={44} cls="an-din" />
        <polygon className="an-din-window" points={quad([204, 36, 14], [246, 36, 14], [246, 36, 36], [204, 36, 36])} />
        {[0, 1, 2, 3, 4].map((k) => (
          <polygon key={k} className="an-breaker" points={quad([208 + k * 7.5, 36, 18], [213 + k * 7.5, 36, 18], [213 + k * 7.5, 36, 32], [208 + k * 7.5, 36, 32])} />
        ))}
      </>
    );
  if (i === 3)
    return (
      <>
        <Box x={70} y={50} w={110} d={24} h={70} cls="an-inv" />
        <polygon className="an-inv-screen" points={quad([100, 74, 38], [150, 74, 38], [150, 74, 56], [100, 74, 56])} />
        <polygon className="an-inv-led" points={quad([156, 74, 46], [162, 74, 46], [162, 74, 52], [156, 74, 52])} />
        {[0, 1, 2].map((k) => (
          <polygon key={k} className="an-inv-port" points={quad([92 + k * 22, 74, 8], [104 + k * 22, 74, 8], [104 + k * 22, 74, 14], [92 + k * 22, 74, 14])} />
        ))}
        <Box x={214} y={64} w={30} d={14} h={40} cls="an-meter" />
        <polygon className="an-inv-screen" points={quad([219, 78, 22], [239, 78, 22], [239, 78, 32], [219, 78, 32])} />
        <g className="an-phone">
          <Box x={40} y={130} w={22} d={40} h={2} cls="an-phone-body" />
          <polygon className="an-phone-screen" points={plane(42, 133, 60, 167, 2)} />
        </g>
      </>
    );
  return (
    <>
      {[0, 1, 2, 3].map((k) => (
        <g key={k} className="an-bat" style={{ ["--k" as string]: k }}>
          <Box x={60} y={56} z={k * 14} w={150} d={64} h={13} cls="an-bat-box" />
          <polygon className="an-bat-lvl" points={quad([150, 120, k * 14 + 4], [200, 120, k * 14 + 4], [200, 120, k * 14 + 9], [150, 120, k * 14 + 9])} />
          <polygon className="an-bat-port" points={quad([70, 120, k * 14 + 4], [82, 120, k * 14 + 4], [82, 120, k * 14 + 9], [70, 120, k * 14 + 9])} />
        </g>
      ))}
    </>
  );
}

/**
 * Signature scene: a station taken apart layer by layer while the page scrolls.
 * Each layer is clickable and leads to its catalogue section with live numbers from the catalogue.
 */
export function Anatomy({ stats }: { stats: LayerStat[] }) {
  const root = useRef<HTMLElement>(null);
  const scene = useRef<SVGSVGElement>(null);
  const [step, setStep] = useState(0);
  const [all, setAll] = useState(true);
  const stepRef = useRef(0);

  useScrollProgress(root, (p) => {
    const e = clamp(p / 0.16);
    const ease = 1 - Math.pow(1 - e, 3);
    const gap = 54 + ease * 70;
    const el = scene.current;
    if (el) {
      el.style.setProperty("--g", gap.toFixed(1));
      el.style.setProperty("--sh", ((4 * 124 - 4 * gap) / 2).toFixed(1));
    }
    const k = Math.min(4, Math.max(0, Math.floor(((p - 0.12) / 0.86) * 5)));
    if (k !== stepRef.current) {
      stepRef.current = k;
      setStep(k);
    }
    setAll(p < 0.09);
  });

  const go = (k: number) => {
    const el = root.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top + window.scrollY;
    const span = el.offsetHeight - window.innerHeight;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: top + (0.12 + ((k + 0.5) / 5) * 0.86) * span, behavior: reduce ? "auto" : "smooth" });
  };

  const active = layers[step];

  return (
    <section className="anatomy" ref={root} id="anatomiia" aria-label="Анатомія сонячної станції">
      <div className="anatomy-sticky">
        <div className="container anatomy-grid">
          <div className="anatomy-text">
            <p className="eyebrow">Анатомія станції</p>
            <h2 className="anatomy-h">
              Розберемо СЕС <span className="accent">на шари</span>
            </h2>
            <div className="anatomy-steps" aria-live="polite">
              {layers.map((l, i) => {
                const s = stats.find((x) => x.id === l.id);
                return (
                  <div key={l.id} className={`anatomy-step${i === step ? " is-on" : ""}`} aria-hidden={i !== step}>
                    <span className="mono">
                      {l.n} / 05 · {l.note}
                    </span>
                    <h3>{l.title}</h3>
                    <p>{l.body}</p>
                    {s && (
                      <Link href={l.href} className="anatomy-link" tabIndex={i === step ? 0 : -1}>
                        <span>
                          <b>{s.count}</b> {s.count > 4 ? "позицій" : "позиції"} у каталозі · від {s.from}
                          <small>{s.brands}</small>
                        </span>
                        <Icon name="arrowUpRight" size={20} />
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
            <div className="anatomy-tabs" role="tablist" aria-label="Шари станції">
              {layers.map((l, i) => (
                <button key={l.id} type="button" role="tab" aria-selected={i === step} className={i === step ? "is-on" : undefined} onClick={() => go(i)}>
                  <i />
                  {l.short}
                </button>
              ))}
            </div>
          </div>

          <div className="anatomy-scene">
            <span className="anatomy-sun" aria-hidden="true" />
            <svg ref={scene} viewBox="0 0 600 800" className="anatomy-svg" data-step={step} data-all={all || undefined} role="img" aria-label={`Шар ${active.n}: ${active.title}`}>
              <defs>
                <linearGradient id="anPanel" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0" stopColor="#1f4f55" />
                  <stop offset="0.55" stopColor="#0f2e33" />
                  <stop offset="1" stopColor="#163c3a" />
                </linearGradient>
                <linearGradient id="anShine" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0" stopColor="#fff" stopOpacity="0" />
                  <stop offset="0.5" stopColor="#ffe9a0" stopOpacity="0.55" />
                  <stop offset="1" stopColor="#fff" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[4, 3, 2, 1, 0].map((i) => (
                <g
                  key={i}
                  className={`an-layer an-l${i}`}
                  style={{ ["--li" as string]: 4 - i }}
                  onClick={() => go(i)}
                  role="button"
                  tabIndex={-1}
                  aria-label={layers[i].title}
                >
                  <polygon className="an-plate" points={plane(0, 0, 280, 180)} />
                  <polygon className="an-plate-edge" points={quad([0, 180, -3], [280, 180, -3], [280, 180, 0], [0, 180, 0])} />
                  <polygon className="an-plate-edge an-plate-edge-r" points={quad([280, 0, -3], [280, 180, -3], [280, 180, 0], [280, 0, 0])} />
                  <LayerArt i={i} />
                  <g className="an-label">
                    <polyline points={`${pt(280, 0)} ${(OX + 280 * C + 22).toFixed(1)},${(OY + 280 * S - 24).toFixed(1)} ${(OX + 280 * C + 58).toFixed(1)},${(OY + 280 * S - 24).toFixed(1)}`} />
                    <text x={OX + 280 * C + 62} y={OY + 280 * S - 20}>
                      {layers[i].n} {layers[i].short}
                    </text>
                  </g>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
