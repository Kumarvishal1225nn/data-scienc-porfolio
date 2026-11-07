"use client";

import { useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles, WifiOff } from "lucide-react";

/**
 * Interactive echo of the telemetry project: a sensor trace with an outage.
 * Toggle the model on/off, and hover to read values. Illustrative signal.
 */

const W = 1000;
const H = 120;
const N = 160;
const GAP_START = 92;
const GAP_END = 122;

function value(i: number) {
  const t = i / N;
  return (
    0.5 +
    0.22 * Math.sin(t * Math.PI * 2.2 + 0.4) +
    0.09 * Math.sin(t * Math.PI * 9.5) +
    0.035 * Math.sin(t * Math.PI * 31 + 1.3)
  );
}

const x = (i: number) => (i / (N - 1)) * W;
const y = (i: number) => H - value(i) * H * 0.92 - 4;
const temp = (i: number) => (18 + value(i) * 14).toFixed(1);

function path(from: number, to: number) {
  let d = "";
  for (let i = from; i <= to; i++) d += `${i === from ? "M" : "L"}${x(i).toFixed(1)},${y(i).toFixed(1)}`;
  return d;
}

const before = path(0, GAP_START);
const gap = path(GAP_START, GAP_END);
const after = path(GAP_END, N - 1);

export function SignalTrace() {
  const reduce = useReducedMotion();
  const [filled, setFilled] = useState(true);
  const [hover, setHover] = useState<number | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const ease = [0.45, 0, 0.2, 1] as const;
  const gx0 = x(GAP_START);
  const gx1 = x(GAP_END);

  const onMove = (e: React.PointerEvent) => {
    const r = svgRef.current?.getBoundingClientRect();
    if (!r) return;
    const i = Math.round(((e.clientX - r.left) / r.width) * (N - 1));
    setHover(Math.max(0, Math.min(N - 1, i)));
  };

  const inGap = hover !== null && hover > GAP_START && hover < GAP_END;
  const showDot = hover !== null && (!inGap || filled);

  return (
    <figure className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-panel/60 px-4 pb-3 pt-4 md:px-6">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
          <p className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.12em] text-mute">
            <span className="size-1.5 animate-blink rounded-full bg-[#4ade80]" aria-hidden="true" />
            Sensor 042 · temperature
          </p>
          <div role="group" aria-label="Show reconstruction" className="flex rounded-full border border-line bg-ink/60 p-0.5 text-[12.5px]">
            <button
              type="button"
              onClick={() => setFilled(false)}
              aria-pressed={!filled}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${!filled ? "bg-panel-2 text-fg" : "text-mute hover:text-soft"}`}
            >
              <WifiOff className="size-3.5" aria-hidden="true" /> Raw
            </button>
            <button
              type="button"
              onClick={() => setFilled(true)}
              aria-pressed={filled}
              className={`flex items-center gap-1.5 rounded-full px-3 py-1 transition-colors ${filled ? "bg-signal text-white" : "text-mute hover:text-soft"}`}
            >
              <Sparkles className="size-3.5" aria-hidden="true" /> ML filled
            </button>
          </div>
        </div>

        <div className="relative">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="block h-[84px] w-full cursor-crosshair touch-none md:h-[110px]"
            preserveAspectRatio="none"
            role="img"
            aria-label="A sensor reading with a transmission outage. Toggle to see the machine-learning reconstruction fill the gap."
            onPointerMove={onMove}
            onPointerDown={onMove}
            onPointerLeave={() => setHover(null)}
          >
            <defs>
              <clipPath id="trace-sweep">
                <motion.rect
                  x={0}
                  y={0}
                  height={H}
                  initial={{ width: reduce ? W : 0 }}
                  animate={{ width: W }}
                  transition={{ delay: 0.3, duration: 1.8, ease }}
                />
              </clipPath>
            </defs>
            <rect
              x={gx0}
              y={0}
              width={gx1 - gx0}
              height={H}
              fill={filled ? "var(--color-signal-soft)" : "#f8717114"}
              style={{ transition: "fill .4s" }}
            />
            <g clipPath="url(#trace-sweep)">
              <path d={before} fill="none" stroke="var(--color-soft)" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
              <path d={after} fill="none" stroke="var(--color-soft)" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
            </g>
            <AnimatePresence>
              {filled && (
                <motion.path
                  key="gap"
                  d={gap}
                  fill="none"
                  stroke="var(--color-signal)"
                  strokeWidth={2.4}
                  strokeDasharray="5 4"
                  vectorEffect="non-scaling-stroke"
                  initial={{ pathLength: reduce ? 1 : 0, opacity: 1 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: reduce ? 0 : 0.15, duration: 0.8, ease }}
                />
              )}
            </AnimatePresence>
            {hover !== null && (
              <line x1={x(hover)} x2={x(hover)} y1={0} y2={H} stroke="var(--color-line-strong)" vectorEffect="non-scaling-stroke" />
            )}
          </svg>

          {!filled && (
            <span
              className="pointer-events-none absolute top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-[#f87171]/40 bg-ink/80 px-2.5 py-0.5 text-[11.5px] text-[#fca5a5]"
              style={{ left: `${((gx0 + gx1) / 2 / W) * 100}%` }}
            >
              no data
            </span>
          )}

          {hover !== null && (
            <div
              className="pointer-events-none absolute -top-2 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg border border-line bg-ink/95 px-2.5 py-1.5 text-[12px] shadow-lg"
              style={{ left: `${(x(hover) / W) * 100}%` }}
            >
              {showDot ? (
                <>
                  <span className="tabular font-mono text-fg">{temp(hover)}°C</span>
                  <span className={`ml-2 ${inGap ? "text-signal" : "text-mute"}`}>{inGap ? "model estimate" : "recorded"}</span>
                </>
              ) : (
                <span className="text-[#fca5a5]">outage — missing</span>
              )}
            </div>
          )}
        </div>

        <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-[12px] text-mute">
          <span className="flex items-center gap-2">
            <span className="h-px w-4 bg-soft" aria-hidden="true" />
            Recorded
          </span>
          <span className="hidden sm:inline">Hover to read · toggle to compare</span>
          <span className="flex items-center gap-2">
            <span className="h-0 w-4 border-t-2 border-dashed border-signal" aria-hidden="true" />
            Reconstructed
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
