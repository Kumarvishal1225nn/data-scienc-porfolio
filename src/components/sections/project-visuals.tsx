import type { ProjectVisual } from "@/data/portfolio";

/*
 * Illustrative thumbnails drawn in code. They depict the *kind* of analysis
 * each project does — they are not plots of real results.
 */

const S = "var(--color-soft)";
const A = "var(--color-signal)";
const L = "var(--color-line-strong)";

function seeded(n: number) {
  let s = n;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

function Telemetry() {
  const rows = 4;
  const gaps = [
    [0.55, 0.68],
    [0.2, 0.27],
    [0.7, 0.86],
    [0.38, 0.45],
  ];
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden="true">
      {Array.from({ length: rows }).map((_, r) => {
        const base = 36 + r * 48;
        const pts = Array.from({ length: 81 }, (_, i) => {
          const t = i / 80;
          return [20 + t * 360, base - 12 * Math.sin(t * 9 + r * 1.7) - 5 * Math.sin(t * 31 + r)];
        });
        const [g0, g1] = gaps[r];
        const seg = (f: (t: number) => boolean) =>
          pts
            .filter((_, i) => f(i / 80))
            .map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`)
            .join("");
        return (
          <g key={r}>
            <rect x={20 + g0 * 360} y={base - 22} width={(g1 - g0) * 360} height={40} rx={4} fill="var(--color-signal-soft)" />
            <path d={seg((t) => t <= g0)} stroke={S} strokeWidth={1.4} fill="none" />
            <path d={seg((t) => t >= g1)} stroke={S} strokeWidth={1.4} fill="none" />
            <path d={seg((t) => t >= g0 && t <= g1)} stroke={A} strokeWidth={2} strokeDasharray="4 3" fill="none" />
          </g>
        );
      })}
    </svg>
  );
}

function Taxi() {
  const rnd = seeded(7);
  const nodes = Array.from({ length: 16 }, (_, i) => ({
    x: 50 + (i % 4) * 100 + (rnd() - 0.5) * 40,
    y: 35 + Math.floor(i / 4) * 50 + (rnd() - 0.5) * 20,
    r: 3 + rnd() * 7,
  }));
  const edges: [number, number, number][] = [];
  nodes.forEach((_, i) => {
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y);
      if (d < 130 && rnd() > 0.35) edges.push([i, j, rnd()]);
    }
  });
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden="true">
      {edges.map(([a, b, w], k) => (
        <line
          key={k}
          x1={nodes[a].x}
          y1={nodes[a].y}
          x2={nodes[b].x}
          y2={nodes[b].y}
          stroke={w > 0.75 ? A : L}
          strokeOpacity={w > 0.75 ? 0.9 : 0.8}
          strokeWidth={w > 0.75 ? 1.8 : 1}
        />
      ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill="var(--color-panel)" stroke={n.r > 7 ? A : S} strokeWidth={1.4} />
      ))}
    </svg>
  );
}

function Retail() {
  const rnd = seeded(3);
  const bars = Array.from({ length: 12 }, (_, i) => 40 + rnd() * 70 + i * 4);
  const line = bars.map((b, i) => `${i ? "L" : "M"}${42 + i * 28},${190 - b * 1.05 - 18}`).join("");
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={30 + i * 118} y={16} width={104} height={34} rx={8} fill="var(--color-panel)" stroke={L} />
          <rect x={42 + i * 118} y={26} width={30 + i * 8} height={5} rx={2} fill={L} />
          <rect x={42 + i * 118} y={36} width={52} height={6} rx={2} fill={i === 0 ? A : S} opacity={0.85} />
        </g>
      ))}
      <line x1={30} x2={370} y1={190} y2={190} stroke={L} />
      {bars.map((b, i) => (
        <rect key={i} x={32 + i * 28} y={190 - b} width={18} height={b} rx={3} fill={i === 9 ? A : L} />
      ))}
      <path d={line} stroke={S} strokeWidth={1.6} fill="none" />
    </svg>
  );
}

function Supply() {
  const left = [40, 85, 130, 175];
  const mid = [62, 120, 168];
  const right = [50, 100, 150, 190];
  const curve = (x1: number, y1: number, x2: number, y2: number) =>
    `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`;
  const flows: [number, number, number, boolean][] = [];
  left.forEach((y, i) => mid.forEach((m, j) => (i + j) % 2 === 0 && flows.push([y, m, 1 + ((i + j) % 3), i === 1 && j === 1])));
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden="true">
      {flows.map(([a, b, w, hot], k) => (
        <path key={k} d={curve(46, a, 194, b)} stroke={hot ? A : L} strokeWidth={w * 1.4} fill="none" strokeOpacity={hot ? 1 : 0.9} />
      ))}
      {mid.map((m, j) =>
        right.map((r, i) =>
          (i + j) % 2 === 1 ? (
            <path key={`${j}-${i}`} d={curve(206, m, 354, r)} stroke={j === 1 && i === 2 ? A : L} strokeWidth={1.6} fill="none" />
          ) : null,
        ),
      )}
      {left.map((y) => <rect key={y} x={30} y={y - 9} width={16} height={18} rx={4} fill="var(--color-panel)" stroke={S} />)}
      {mid.map((y, j) => <rect key={y} x={194} y={y - 13} width={12} height={26} rx={4} fill={j === 1 ? A : "var(--color-panel)"} stroke={j === 1 ? A : S} />)}
      {right.map((y) => <circle key={y} cx={360} cy={y} r={6} fill="var(--color-panel)" stroke={S} />)}
    </svg>
  );
}

export function ProjectVisualArt({ kind }: { kind: ProjectVisual }) {
  switch (kind) {
    case "telemetry":
      return <Telemetry />;
    case "taxi":
      return <Taxi />;
    case "retail":
      return <Retail />;
    case "supply":
      return <Supply />;
  }
}
