"use client";

import { motion, useReducedMotion } from "framer-motion";

/**
 * The hero's signature: a sensor trace with an outage, and the model's
 * reconstruction drawn into the gap. A small echo of the telemetry project.
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
  const ease = [0.45, 0, 0.2, 1] as const;
  const gx0 = x(GAP_START);
  const gx1 = x(GAP_END);

  return (
    <figure className="relative">
      <div className="relative overflow-hidden rounded-2xl border border-line bg-panel/60 px-4 pb-3 pt-4 md:px-6">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-[84px] w-full md:h-[104px]"
          preserveAspectRatio="none"
          role="img"
          aria-label="A sensor reading with a gap in transmission, and the reconstructed values drawn in to fill it."
        >
          <defs>
            {/* Sweeps reveal left-to-right; clip paths keep dashes and stroke widths intact. */}
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
            <clipPath id="gap-sweep">
              <motion.rect
                x={gx0}
                y={0}
                height={H}
                initial={{ width: reduce ? gx1 - gx0 : 0 }}
                animate={{ width: gx1 - gx0 }}
                transition={{ delay: 2.1, duration: 0.9, ease }}
              />
            </clipPath>
          </defs>
          <motion.rect
            x={gx0}
            y={0}
            width={gx1 - gx0}
            height={H}
            fill="var(--color-signal-soft)"
            initial={{ opacity: reduce ? 1 : 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.5 }}
          />
          <g clipPath="url(#trace-sweep)">
            <path d={before} fill="none" stroke="var(--color-soft)" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
            <path d={after} fill="none" stroke="var(--color-soft)" strokeWidth={1.6} vectorEffect="non-scaling-stroke" />
          </g>
          <g clipPath="url(#gap-sweep)">
            <path
              d={gap}
              fill="none"
              stroke="var(--color-signal)"
              strokeWidth={2.2}
              strokeDasharray="5 4"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </svg>
        <figcaption className="mt-2 flex flex-wrap items-center justify-between gap-x-6 gap-y-1 text-[12.5px] text-mute">
          <span className="flex items-center gap-2">
            <span className="h-px w-4 bg-soft" aria-hidden="true" />
            Recorded reading
          </span>
          <span className="flex items-center gap-2">
            <span className="h-0 w-4 border-t-2 border-dashed border-signal" aria-hidden="true" />
            Reconstructed during a transmission outage
          </span>
        </figcaption>
      </div>
    </figure>
  );
}
