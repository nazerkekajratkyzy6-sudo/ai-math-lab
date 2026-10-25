import { useState } from 'react';
import Tex from '../components/Tex';
import Slider from '../components/Slider';
import { fmt } from '../lib/fraction';

/** №26: квадраттың бұрыштарынан кіші квадраттарды қию */
export default function AreaModel() {
  const [a, setA] = useState(10);
  const [c, setC] = useState(2);
  const [cut, setCut] = useState(false);

  const cc = Math.min(c, a / 2);
  const S = a * a;
  const Scut = 4 * cc * cc;
  const rest = S - Scut;

  const pad = 30;
  const size = 300;
  const k = size / 12; // 1 см = k px (12 см-ге дейінгі масштаб)
  const side = a * k;
  const x0 = pad + (size - side) / 2;
  const y0 = pad + (size - side) / 2;
  const cs = cc * k;
  const corners = [
    { x: x0, y: y0, dx: -1, dy: -1 },
    { x: x0 + side - cs, y: y0, dx: 1, dy: -1 },
    { x: x0, y: y0 + side - cs, dx: -1, dy: 1 },
    { x: x0 + side - cs, y: y0 + side - cs, dx: 1, dy: 1 },
  ];
  const off = cut ? 22 : 0;

  const crossPath = `M ${x0 + cs} ${y0} H ${x0 + side - cs} V ${y0 + cs} H ${x0 + side} V ${y0 + side - cs} H ${x0 + side - cs} V ${y0 + side} H ${x0 + cs} V ${y0 + side - cs} H ${x0} V ${y0 + cs} H ${x0 + cs} Z`;

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,380px)_1fr] lg:items-start">
      <svg viewBox="0 0 360 360" className="mx-auto w-full max-w-[380px]" role="img" aria-label={`Қабырғасы ${a} см квадрат, бұрыштарынан қабырғасы ${fmt(cc)} см квадраттар қиылған, қалған аудан ${fmt(rest)} шаршы сантиметр`}>
        <defs>
          <pattern id="grid1" width={k} height={k} patternUnits="userSpaceOnUse" x={x0} y={y0}>
            <path d={`M ${k} 0 L 0 0 0 ${k}`} fill="none" stroke="#c9d3e1" strokeWidth="0.8" />
          </pattern>
        </defs>
        {cut ? (
          <path d={crossPath} fill="#e8eefb" stroke="#1f4fbf" strokeWidth="2" style={{ transition: 'all .4s' }} />
        ) : (
          <rect x={x0} y={y0} width={side} height={side} fill="#e8eefb" stroke="#1f4fbf" strokeWidth="2" />
        )}
        <rect x={x0} y={y0} width={side} height={side} fill="url(#grid1)" pointerEvents="none" opacity={0.9} />
        {corners.map((p, i) => (
          <rect
            key={i}
            x={p.x}
            y={p.y}
            width={cs}
            height={cs}
            fill={cut ? '#fdecea' : '#f9d7d3'}
            stroke="#b42318"
            strokeWidth="1.5"
            strokeDasharray={cut ? '4 3' : undefined}
            style={{
              transform: `translate(${p.dx * off}px, ${p.dy * off}px)`,
              transition: 'transform .6s ease, fill .6s',
            }}
          />
        ))}
        <text x={x0 + side / 2} y={y0 + side + 22} textAnchor="middle" fontSize="13" fill="#33435c">
          {a} см
        </text>
        <text x={x0 - 10} y={y0 + side / 2} textAnchor="end" dominantBaseline="central" fontSize="13" fill="#33435c">
          {a} см
        </text>
        {cs > 14 && (
          <text x={x0 + cs / 2 - off} y={y0 + cs / 2 - off} textAnchor="middle" dominantBaseline="central" fontSize="11" fill="#b42318" style={{ transition: 'all .6s' }}>
            {fmt(cc)}×{fmt(cc)}
          </text>
        )}
      </svg>

      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Slider label="Квадрат қабырғасы" value={a} min={4} max={12} step={1} unit="см" onChange={(v) => { setA(v); if (c > v / 2) setC(v / 2); }} />
          <Slider label="Қиылатын квадрат қабырғасы" value={c} min={0.5} max={a / 2} step={0.5} unit="см" format={fmt} onChange={setC} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" onClick={() => setCut((v) => !v)} aria-pressed={cut}>
            {cut ? 'Қиылған бөліктерді орнына қою' : 'Төрт бұрышты қию'}
          </button>
          <button className="btn-secondary" onClick={() => { setA(10); setC(2); }}>
            Бастапқы шарт: 10 см және 2 см
          </button>
        </div>
        <div className="surface space-y-2 p-5 text-[15px]">
          <Tex className="block" tex={`S_{\\text{квадрат}} = ${a} \\times ${a} = ${S}\\ \\text{см}^2`} />
          <Tex className="block" tex={`S_{\\text{қиылған}} = 4 \\times (${fmt(cc).replace(',', '{,}')} \\times ${fmt(cc).replace(',', '{,}')}) = ${fmt(Scut, 2).replace(',', '{,}')}\\ \\text{см}^2`} />
          <div className="flex items-baseline gap-3 border-t border-line pt-3">
            <span className="text-sm text-ink-soft">Қалған аудан</span>
            <span className="font-serif text-3xl font-bold tabular-nums text-teal">{fmt(rest, 2)} см²</span>
          </div>
        </div>
      </div>
    </div>
  );
}
