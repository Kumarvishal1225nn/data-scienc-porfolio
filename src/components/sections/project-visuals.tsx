import type { ProjectVisual } from "@/data/portfolio";

/*
 * Illustrations drawn in code. They depict the *kind* of analysis each
 * project does — they are not plots of real results. Pass `still` for
 * small thumbnails (no motion).
 */

const S = "var(--color-soft)";
const A = "var(--color-signal)";
const V = "var(--color-ahead)";
const L = "var(--color-line-strong)";
const P = "var(--color-panel)";

type Props = { still?: boolean };

function seeded(n: number) {
  let s = n;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

const line = (pts: [number, number][]) => pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join("");

function Telemetry({ still }: Props) {
  const gaps = [
    [0.55, 0.68],
    [0.2, 0.27],
    [0.7, 0.86],
    [0.38, 0.45],
  ];
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden="true">
      {gaps.map(([g0, g1], r) => {
        const base = 36 + r * 48;
        const pts = Array.from({ length: 81 }, (_, i) => {
          const t = i / 80;
          return [20 + t * 360, base - 12 * Math.sin(t * 9 + r * 1.7) - 5 * Math.sin(t * 31 + r)] as [number, number];
        });
        const seg = (f: (t: number) => boolean) => line(pts.filter((_, i) => f(i / 80)));
        return (
          <g key={r}>
            <rect x={20 + g0 * 360} y={base - 22} width={(g1 - g0) * 360} height={40} rx={4} fill="var(--color-signal-soft)">
              {!still && <animate attributeName="opacity" values="0.4;1;0.4" dur="3s" begin={`${r * 0.6}s`} repeatCount="indefinite" />}
            </rect>
            <path d={seg((t) => t <= g0)} stroke={S} strokeWidth={1.4} fill="none" />
            <path d={seg((t) => t >= g1)} stroke={S} strokeWidth={1.4} fill="none" />
            <path
              d={seg((t) => t >= g0 && t <= g1)}
              stroke={A}
              strokeWidth={2.2}
              strokeDasharray="4 3"
              fill="none"
              className={still ? "" : "viz-flow"}
            />
          </g>
        );
      })}
    </svg>
  );
}

function Taxi({ still }: Props) {
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
  const hot = edges.filter(([, , w]) => w > 0.6);
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
      {!still &&
        hot.map(([a, b], k) => (
          <circle key={`t${k}`} r={2.6} fill="#facc15">
            <animateMotion
              dur={`${1.6 + (k % 4) * 0.5}s`}
              begin={`${(k % 5) * 0.4}s`}
              repeatCount="indefinite"
              path={`M${nodes[a].x},${nodes[a].y} L${nodes[b].x},${nodes[b].y}`}
            />
          </circle>
        ))}
      {nodes.map((n, i) => (
        <circle key={i} cx={n.x} cy={n.y} r={n.r} fill={P} stroke={n.r > 7 ? A : S} strokeWidth={1.4} />
      ))}
    </svg>
  );
}

function Retail({ still }: Props) {
  const rnd = seeded(3);
  const bars = Array.from({ length: 12 }, (_, i) => 40 + rnd() * 70 + i * 4);
  const trend = bars.map((b, i) => [42 + i * 28, 190 - b * 1.05 - 18] as [number, number]);
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={30 + i * 118} y={16} width={104} height={34} rx={8} fill={P} stroke={L} />
          <rect x={42 + i * 118} y={26} width={30 + i * 8} height={5} rx={2} fill={L} />
          <rect x={42 + i * 118} y={36} width={52} height={6} rx={2} fill={i === 0 ? A : S} opacity={0.85} />
        </g>
      ))}
      <line x1={30} x2={370} y1={190} y2={190} stroke={L} />
      {bars.map((b, i) => (
        <rect
          key={i}
          x={32 + i * 28}
          y={190 - b}
          width={18}
          height={b}
          rx={3}
          fill={i === 9 ? A : L}
          className={still ? "" : "viz-grow"}
          style={{ animationDelay: `${i * 0.06}s` }}
        />
      ))}
      <path d={line(trend)} stroke={S} strokeWidth={1.6} fill="none" className={still ? "" : "viz-draw"} pathLength={1} />
    </svg>
  );
}

function Supply({ still }: Props) {
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
        <path
          key={k}
          d={curve(46, a, 194, b)}
          stroke={hot ? A : L}
          strokeWidth={w * 1.4}
          fill="none"
          strokeDasharray={still ? undefined : "6 5"}
          className={still ? "" : "viz-flow"}
        />
      ))}
      {mid.map((m, j) =>
        right.map((r, i) =>
          (i + j) % 2 === 1 ? (
            <path
              key={`${j}-${i}`}
              d={curve(206, m, 354, r)}
              stroke={j === 1 && i === 2 ? A : L}
              strokeWidth={1.6}
              fill="none"
              strokeDasharray={still ? undefined : "6 5"}
              className={still ? "" : "viz-flow"}
            />
          ) : null,
        ),
      )}
      {left.map((y) => <rect key={y} x={30} y={y - 9} width={16} height={18} rx={4} fill={P} stroke={S} />)}
      {mid.map((y, j) => <rect key={y} x={194} y={y - 13} width={12} height={26} rx={4} fill={j === 1 ? A : P} stroke={j === 1 ? A : S} />)}
      {right.map((y) => <circle key={y} cx={360} cy={y} r={6} fill={P} stroke={S} />)}
    </svg>
  );
}

/* Mountains, a winding road with moving vehicles, and a seasonal strip. */
function Tourism({ still }: Props) {
  const road = "M10,160 C70,150 80,118 140,120 S220,150 250,118 S320,70 390,78";
  const season = [0.25, 0.3, 0.45, 0.7, 0.95, 1, 0.8, 0.45, 0.5, 0.65, 0.4, 0.3];
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden="true">
      <path d="M0,150 L60,70 L95,110 L150,40 L210,120 L260,60 L320,115 L360,80 L400,110 L400,180 L0,180Z" fill="#16223b" />
      <path d="M150,40 L165,62 L156,60 L150,70 L142,58 L136,60Z" fill="#e9eef7" opacity={0.75} />
      <path d="M260,60 L272,78 L264,76 L258,84 L252,74Z" fill="#e9eef7" opacity={0.6} />
      <path d="M0,170 L80,120 L140,150 L200,105 L270,150 L330,118 L400,140 L400,186 L0,186Z" fill="#1f2c47" />
      <path d={road} fill="none" stroke={L} strokeWidth={7} strokeLinecap="round" />
      <path d={road} fill="none" stroke={S} strokeWidth={1} strokeDasharray="5 6" />
      {!still &&
        [0, 1, 2, 3].map((k) => (
          <circle key={k} r={3.4} fill={k === 2 ? V : A}>
            <animateMotion dur="6s" begin={`${k * 1.5}s`} repeatCount="indefinite" path={road} />
          </circle>
        ))}
      {season.map((v, i) => (
        <rect
          key={i}
          x={20 + i * 30}
          y={214 - v * 24}
          width={20}
          height={v * 24}
          rx={2}
          fill={v > 0.9 ? A : L}
          className={still ? "" : "viz-grow"}
          style={{ animationDelay: `${i * 0.05}s` }}
        />
      ))}
    </svg>
  );
}

/* Horizontal bars by segment + a donut split. */
function Walmart({ still }: Props) {
  const bars = [0.92, 0.78, 0.71, 0.6, 0.52, 0.41];
  const r = 44;
  const c = 2 * Math.PI * r;
  const split = [0.46, 0.34, 0.2];
  let acc = 0;
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden="true">
      {bars.map((v, i) => (
        <g key={i}>
          <rect x={24} y={24 + i * 30} width={36} height={8} rx={2} fill={L} />
          <rect x={70} y={20 + i * 30} width={180} height={16} rx={4} fill="#ffffff08" />
          <rect
            x={70}
            y={20 + i * 30}
            width={180 * v}
            height={16}
            rx={4}
            fill={i === 0 ? A : L}
            className={still ? "" : "viz-growx"}
            style={{ animationDelay: `${i * 0.08}s` }}
          />
        </g>
      ))}
      <g transform="translate(320,110) rotate(-90)">
        {split.map((s, i) => {
          const el = (
            <circle
              key={i}
              r={r}
              fill="none"
              stroke={[A, V, S][i]}
              strokeWidth={18}
              strokeDasharray={`${s * c - 3} ${c}`}
              strokeDashoffset={-acc * c}
            />
          );
          acc += s;
          return el;
        })}
      </g>
      <text x={320} y={115} textAnchor="middle" fill="var(--color-fg)" fontSize={14} fontFamily="var(--font-mono)">
        SQL
      </text>
    </svg>
  );
}

/* City dots coloured by AQI + forecast with a confidence band. */
function Aqi({ still }: Props) {
  const aqi = ["#4ade80", "#a3e635", "#facc15", "#fb923c", "#f87171", "#c084fc"];
  const cities: [number, number, number][] = [
    [120, 40, 4],
    [150, 55, 5],
    [95, 70, 3],
    [175, 80, 2],
    [230, 75, 3],
    [140, 100, 1],
    [270, 95, 2],
    [205, 115, 1],
    [110, 120, 0],
    [180, 140, 0],
    [245, 135, 1],
  ];
  const hist = Array.from({ length: 30 }, (_, i) => [20 + i * 8, 190 - 18 * Math.sin(i / 4) - i * 0.4] as [number, number]);
  const fc = Array.from({ length: 16 }, (_, i) => [260 + i * 8, 190 - 18 * Math.sin((29 + i) / 4) - (29 + i) * 0.4] as [number, number]);
  const band = [...fc.map(([x, y], i) => [x, y - 4 - i * 0.9]), ...fc.slice().reverse().map(([x, y], i) => [x, y + 4 + (15 - i) * 0.9])] as [number, number][];
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden="true">
      {cities.map(([x, y, lvl], i) => (
        <g key={i}>
          {!still && (
            <circle cx={x} cy={y} r={5} fill="none" stroke={aqi[lvl]} strokeWidth={1.2}>
              <animate attributeName="r" values="5;16" dur="2.4s" begin={`${(i % 6) * 0.4}s`} repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.8;0" dur="2.4s" begin={`${(i % 6) * 0.4}s`} repeatCount="indefinite" />
            </circle>
          )}
          <circle cx={x} cy={y} r={4.5} fill={aqi[lvl]} />
        </g>
      ))}
      <g transform="translate(318,24)">
        {aqi.map((c, i) => (
          <rect key={c} x={0} y={i * 13} width={10} height={11} rx={2} fill={c} />
        ))}
        <text x={16} y={9} fill={S} fontSize={9}>Good</text>
        <text x={16} y={74} fill={S} fontSize={9}>Severe</text>
      </g>
      <line x1={20} x2={390} y1={205} y2={205} stroke={L} />
      <path d={line(band)} fill="var(--color-ahead-soft)" />
      <path d={line(hist)} fill="none" stroke={S} strokeWidth={1.6} />
      <path d={line(fc)} fill="none" stroke={V} strokeWidth={2} strokeDasharray="4 3" className={still ? "" : "viz-flow"} />
      <line x1={260} x2={260} y1={150} y2={205} stroke={L} strokeDasharray="2 3" />
    </svg>
  );
}

/* Price line, shaded max drawdown, and a Sharpe gauge. */
function Risk({ still }: Props) {
  const rnd = seeded(11);
  let v = 120;
  const pts = Array.from({ length: 50 }, (_, i) => {
    v += (rnd() - 0.42) * 9 - (i > 24 && i < 33 ? 6 : 0);
    return [20 + i * 5.4, Math.max(30, Math.min(180, 190 - v))] as [number, number];
  });
  const area = `${line(pts)} L${pts[pts.length - 1][0]},190 L20,190Z`;
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden="true">
      <defs>
        <linearGradient id="risk-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#4d8dff" stopOpacity="0.35" />
          <stop offset="1" stopColor="#4d8dff" stopOpacity="0" />
        </linearGradient>
      </defs>
      <rect x={20 + 24 * 5.4} y={20} width={9 * 5.4} height={170} fill="#f8717118" />
      <text x={20 + 24 * 5.4 + 2} y={32} fill="#fca5a5" fontSize={9}>drawdown</text>
      <path d={area} fill="url(#risk-fill)" />
      <path d={line(pts)} fill="none" stroke={A} strokeWidth={1.8} className={still ? "" : "viz-draw"} pathLength={1} />
      <line x1={20} x2={290} y1={190} y2={190} stroke={L} />
      <g transform="translate(340,120)">
        <path d="M-40,0 A40,40 0 0 1 40,0" fill="none" stroke={L} strokeWidth={8} strokeLinecap="round" />
        <path d="M-40,0 A40,40 0 0 1 28,-28.5" fill="none" stroke={V} strokeWidth={8} strokeLinecap="round" className={still ? "" : "viz-draw"} pathLength={1} />
        <text y={20} textAnchor="middle" fill={S} fontSize={10}>Sharpe</text>
      </g>
    </svg>
  );
}


/* Words flowing into a classifier, sorted into positive / negative. */
function Sentiment({ still }: Props) {
  const words: [string, number, boolean][] = [
    ["great", 40, true],
    ["slow", 70, false],
    ["love", 100, true],
    ["broken", 130, false],
    ["fast", 160, true],
    ["meh", 190, false],
  ];
  return (
    <svg viewBox="0 0 400 220" className="h-full w-full" aria-hidden="true">
      {words.map(([w, y, pos], i) => (
        <g key={w}>
          <path d={`M110,${y} C150,${y} 150,110 180,110`} stroke={L} strokeWidth={1.2} fill="none" strokeDasharray={still ? undefined : "4 4"} className={still ? "" : "viz-flow"} />
          <rect x={30} y={y - 11} width={74} height={22} rx={11} fill={P} stroke={pos ? A : "#f87171"} strokeOpacity={0.7} />
          <text x={67} y={y + 4} textAnchor="middle" fill="var(--color-fg)" fontSize={11} fontFamily="var(--font-mono)">{w}</text>
          {!still && (
            <circle r={3} fill={pos ? A : "#f87171"}>
              <animateMotion dur="2.4s" begin={`${i * 0.4}s`} repeatCount="indefinite" path={`M110,${y} C150,${y} 150,110 180,110 L220,110 C250,110 250,${pos ? 60 : 160} 300,${pos ? 60 : 160}`} />
            </circle>
          )}
        </g>
      ))}
      <rect x={180} y={86} width={40} height={48} rx={10} fill={V} opacity={0.9} />
      <text x={200} y={114} textAnchor="middle" fill="var(--color-ink)" fontSize={11} fontWeight={600}>SVM</text>
      <path d="M220,110 C250,110 250,60 300,60" stroke={A} strokeWidth={1.6} fill="none" />
      <path d="M220,110 C250,110 250,160 300,160" stroke="#f87171" strokeWidth={1.6} fill="none" />
      <rect x={300} y={42} width={78} height={36} rx={10} fill="var(--color-signal-soft)" stroke={A} />
      <text x={339} y={64} textAnchor="middle" fill={A} fontSize={12}>positive</text>
      <rect x={300} y={142} width={78} height={36} rx={10} fill="#f8717118" stroke="#f87171" />
      <text x={339} y={164} textAnchor="middle" fill="#fca5a5" fontSize={12}>negative</text>
    </svg>
  );
}

export function ProjectVisualArt({ kind, still = false }: { kind: ProjectVisual; still?: boolean }) {
  switch (kind) {
    case "telemetry":
      return <Telemetry still={still} />;
    case "taxi":
      return <Taxi still={still} />;
    case "retail":
      return <Retail still={still} />;
    case "supply":
      return <Supply still={still} />;
    case "tourism":
      return <Tourism still={still} />;
    case "walmart":
      return <Walmart still={still} />;
    case "aqi":
      return <Aqi still={still} />;
    case "risk":
      return <Risk still={still} />;
    case "sentiment":
      return <Sentiment still={still} />;
  }
}
