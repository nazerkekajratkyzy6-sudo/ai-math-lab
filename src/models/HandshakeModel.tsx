import { useEffect, useMemo, useRef, useState } from 'react';
import Tex from '../components/Tex';
import Slider from '../components/Slider';

const C = 170;
const R = 140;

/** Барлық жұптарды қайталанбайтын ретпен шығару: (1,2), (1,3), … (n−1,n) */
function allPairs(n: number) {
  const out: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) out.push([i, j]);
  return out;
}

/** №30: қол алысулар — әр жұп бір рет қана */
export default function HandshakeModel() {
  const [n, setN] = useState(20);
  const [edges, setEdges] = useState<[number, number][]>([]);
  const [playing, setPlaying] = useState(false);
  const [sel, setSel] = useState<number | null>(null);
  const [msg, setMsg] = useState('');
  const timer = useRef<number | null>(null);

  const pairs = useMemo(() => allPairs(n), [n]);
  const total = (n * (n - 1)) / 2;
  const pts = useMemo(
    () =>
      Array.from({ length: n }, (_, i) => {
        const a = (i / n) * 2 * Math.PI - Math.PI / 2;
        return [C + R * Math.cos(a), C + R * Math.sin(a)] as const;
      }),
    [n],
  );

  const stop = () => {
    if (timer.current) window.clearInterval(timer.current);
    timer.current = null;
    setPlaying(false);
  };
  useEffect(() => stop, []);
  useEffect(() => {
    stop();
    setEdges([]);
    setSel(null);
    setMsg('');
  }, [n]);

  const play = () => {
    stop();
    let k = 0;
    setEdges([]);
    setMsg('');
    setPlaying(true);
    const delay = Math.max(12, Math.min(140, 2400 / total));
    timer.current = window.setInterval(() => {
      k++;
      setEdges(pairs.slice(0, k));
      if (k >= pairs.length) stop();
    }, delay);
  };

  const has = (i: number, j: number) => edges.some(([a, b]) => (a === i && b === j) || (a === j && b === i));

  const clickNode = (i: number) => {
    if (playing) return;
    if (sel === null) {
      setSel(i);
      setMsg(`${i + 1}-оқушы таңдалды. Енді екінші оқушыны таңдаңыз.`);
      return;
    }
    if (sel === i) {
      setSel(null);
      setMsg('');
      return;
    }
    if (has(sel, i)) {
      setMsg(`${sel + 1} және ${i + 1} оқушылар бұрын қол алысқан — қайталау саналмайды.`);
    } else {
      setEdges((e) => [...e, [Math.min(sel, i), Math.max(sel, i)]]);
      setMsg(`${sel + 1} және ${i + 1} оқушылар қол алысты.`);
    }
    setSel(null);
  };

  // Әр оқушының «жаңа» қол алысу саны: бірінші оқушы — n−1, екіншісі — n−2, …
  const row = Array.from({ length: n - 1 }, (_, i) => n - 1 - i);
  const sumTex = n <= 6 ? row.join(' + ') : `${row[0]} + ${row[1]} + ${row[2]} + \\dots + 1`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,400px)_1fr] lg:items-start">
      <div>
        <svg viewBox="0 0 340 340" className="mx-auto w-full max-w-[400px]" role="img" aria-label={`${n} оқушы, ${edges.length} қол алысу салынды`}>
          {edges.map(([i, j], k) => (
            <line key={`${i}-${j}`} x1={pts[i][0]} y1={pts[i][1]} x2={pts[j][0]} y2={pts[j][1]} stroke={k === edges.length - 1 ? '#0e7c7b' : '#1f4fbf'} strokeOpacity={k === edges.length - 1 ? 1 : 0.35} strokeWidth={k === edges.length - 1 ? 2 : 1} />
          ))}
          {pts.map(([x, y], i) => (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={n > 14 ? 10 : 13}
                fill={sel === i ? '#0e7c7b' : '#fff'}
                stroke={sel === i ? '#0e7c7b' : '#1f4fbf'}
                strokeWidth="2"
                className="cursor-pointer"
                tabIndex={0}
                role="button"
                aria-label={`${i + 1}-оқушы`}
                onClick={() => clickNode(i)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    clickNode(i);
                  }
                }}
              />
              <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize={n > 14 ? 9 : 11} fontWeight="600" fill={sel === i ? '#fff' : '#0f1d33'} pointerEvents="none">
                {i + 1}
              </text>
            </g>
          ))}
        </svg>
        <p className="mt-2 text-center text-sm text-ink-mute">Екі оқушыны кезекпен басып, қол алысуды өзіңіз қосыңыз.</p>
      </div>

      <div className="space-y-5">
        <Slider label="Оқушылар саны" value={n} min={2} max={20} onChange={setN} />
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" onClick={play} disabled={playing}>
            Барлық жұпты біртіндеп салу
          </button>
          <button className="btn-secondary" onClick={() => { stop(); setEdges(pairs); setMsg(''); }}>
            Бірден көрсету
          </button>
          <button className="btn-secondary" onClick={() => { stop(); setEdges([]); setSel(null); setMsg(''); }}>
            Тазалау
          </button>
          {n !== 20 && (
            <button className="btn-ghost" onClick={() => setN(20)}>
              Бастапқы шарт: 20 оқушы
            </button>
          )}
        </div>
        {msg && (
          <p role="status" className="rounded-lg bg-surface px-4 py-2 text-sm text-ink-soft">
            {msg}
          </p>
        )}
        <div className="surface p-5">
          <div className="flex items-baseline justify-between gap-4">
            <span className="text-sm text-ink-soft">Салынған қол алысу</span>
            <span className="font-serif text-3xl font-bold tabular-nums text-teal">
              {edges.length}
              <span className="text-lg text-ink-mute"> / {total}</span>
            </span>
          </div>
          <div className="mt-2 h-2 overflow-hidden rounded-full bg-white">
            <div className="h-full rounded-full bg-teal transition-all" style={{ width: `${(edges.length / total) * 100}%` }} />
          </div>
          <div className="mt-4 space-y-2 text-[15px]">
            <Tex className="block" tex={`${sumTex} = ${total}`} />
            <Tex className="block" tex={`\\frac{n(n-1)}{2} = \\frac{${n} \\times ${n - 1}}{2} = ${total}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
