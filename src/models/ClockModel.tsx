import { useEffect, useRef, useState, type KeyboardEvent, type PointerEvent as RPointerEvent } from 'react';
import Tex from '../components/Tex';
import { fmt } from '../lib/fraction';

const R = 140;
const C = 160;

const polar = (deg: number, r: number) => {
  const a = ((deg - 90) * Math.PI) / 180;
  return [C + r * Math.cos(a), C + r * Math.sin(a)] as const;
};

/** Екі бұрыш арасындағы кіші доғаның секторы */
function sectorPath(a1: number, a2: number, r: number) {
  let start = a1;
  let end = a2;
  let d = (((end - start) % 360) + 360) % 360;
  if (d > 180) {
    [start, end] = [a2, a1];
    d = 360 - d;
  }
  const [x1, y1] = polar(start, r);
  const [x2, y2] = polar(start + d, r);
  return `M ${C} ${C} L ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2} Z`;
}

/** №22: сағат тілдерінің моделі (уақыт минутпен: 0…719) */
export default function ClockModel() {
  const [t, setT] = useState(3 * 60 + 30);
  const [drag, setDrag] = useState<'h' | 'm' | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const anim = useRef<number | null>(null);

  const h = Math.floor(t / 60) % 12;
  const m = t % 60;
  const minDeg = m * 6;
  const hourDeg = h * 30 + m * 0.5;
  let diff = Math.abs(minDeg - hourDeg);
  const small = diff > 180 ? 360 - diff : diff;
  diff = Math.round(diff * 10) / 10;

  const setTime = (v: number) => setT(((Math.round(v) % 720) + 720) % 720);

  const angleFromEvent = (e: RPointerEvent) => {
    const svg = svgRef.current!;
    const rect = svg.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 320 - C;
    const y = ((e.clientY - rect.top) / rect.height) * 320 - C;
    return ((Math.atan2(y, x) * 180) / Math.PI + 90 + 360) % 360;
  };

  const onMove = (e: RPointerEvent) => {
    if (!drag) return;
    const a = angleFromEvent(e);
    if (drag === 'm') {
      const newM = Math.round(a / 6) % 60;
      // Минуттық тіл 12-ден өткенде сағатты ауыстыру
      let hh = Math.floor(t / 60);
      if (m > 45 && newM < 15) hh += 1;
      if (m < 15 && newM > 45) hh -= 1;
      setTime(hh * 60 + newM);
    } else {
      const base = Math.floor(t / 720) * 720;
      setTime(base + Math.round(a / 0.5));
    }
  };

  const stopAnim = () => {
    if (anim.current) cancelAnimationFrame(anim.current);
    anim.current = null;
  };
  useEffect(() => stopAnim, []);

  const play = () => {
    stopAnim();
    const from = 3 * 60;
    const to = 3 * 60 + 30;
    const start = performance.now();
    const dur = 2400;
    const step = (now: number) => {
      const k = Math.min(1, (now - start) / dur);
      const e = k < 0.5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      setTime(from + (to - from) * e);
      if (k < 1) anim.current = requestAnimationFrame(step);
    };
    anim.current = requestAnimationFrame(step);
  };

  const [mx, my] = polar(minDeg, R - 22);
  const [hx, hy] = polar(hourDeg, R - 58);
  const hourLabel = h === 0 ? 12 : h;
  const timeStr = `${hourLabel}:${String(m).padStart(2, '0')}`;

  const keyHandler = (which: 'h' | 'm') => (e: KeyboardEvent) => {
    const step = which === 'm' ? 1 : 60;
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      setTime(t + step);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      setTime(t - step);
    }
  };

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,360px)_1fr] lg:items-start">
      <div>
        <svg
          ref={svgRef}
          viewBox="0 0 320 320"
          className="mx-auto w-full max-w-[360px] touch-none select-none"
          onPointerMove={onMove}
          onPointerUp={() => setDrag(null)}
          onPointerLeave={() => setDrag(null)}
          role="img"
          aria-label={`Сағат ${timeStr}, тілдер арасындағы кіші бұрыш ${fmt(small)} градус`}
        >
          <circle cx={C} cy={C} r={R + 8} fill="#fff" stroke="#c9d3e1" strokeWidth="2" />
          {Array.from({ length: 60 }, (_, i) => {
            const [x1, y1] = polar(i * 6, R);
            const [x2, y2] = polar(i * 6, i % 5 === 0 ? R - 12 : R - 6);
            return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={i % 5 === 0 ? '#0f1d33' : '#a9b5c6'} strokeWidth={i % 5 === 0 ? 2.5 : 1} />;
          })}
          {Array.from({ length: 12 }, (_, i) => {
            const [x, y] = polar((i + 1) * 30, R - 28);
            return (
              <text key={i} x={x} y={y} textAnchor="middle" dominantBaseline="central" fontSize="17" fontWeight="600" fill="#0f1d33">
                {i + 1}
              </text>
            );
          })}
          <path d={sectorPath(hourDeg, minDeg, 62)} fill="#0e7c7b" fillOpacity="0.16" stroke="#0e7c7b" strokeWidth="1.5" />
          {/* сағаттық тіл */}
          <line x1={C} y1={C} x2={hx} y2={hy} stroke="#0f1d33" strokeWidth="8" strokeLinecap="round" />
          <circle
            cx={hx}
            cy={hy}
            r="13"
            fill="#0f1d33"
            fillOpacity={drag === 'h' ? 0.25 : 0.08}
            className="cursor-grab"
            tabIndex={0}
            role="slider"
            aria-label="Сағаттық тіл"
            aria-valuemin={0}
            aria-valuemax={359.5}
            aria-valuenow={hourDeg}
            aria-valuetext={`${fmt(hourDeg)} градус`}
            onKeyDown={keyHandler('h')}
            onPointerDown={(e) => {
              stopAnim();
              (e.target as Element).setPointerCapture?.(e.pointerId);
              setDrag('h');
            }}
          />
          {/* минуттық тіл */}
          <line x1={C} y1={C} x2={mx} y2={my} stroke="#1f4fbf" strokeWidth="5" strokeLinecap="round" />
          <circle
            cx={mx}
            cy={my}
            r="13"
            fill="#1f4fbf"
            fillOpacity={drag === 'm' ? 0.3 : 0.12}
            className="cursor-grab"
            tabIndex={0}
            role="slider"
            aria-label="Минуттық тіл"
            aria-valuemin={0}
            aria-valuemax={59}
            aria-valuenow={m}
            aria-valuetext={`${m} минут`}
            onKeyDown={keyHandler('m')}
            onPointerDown={(e) => {
              stopAnim();
              (e.target as Element).setPointerCapture?.(e.pointerId);
              setDrag('m');
            }}
          />
          <circle cx={C} cy={C} r="6" fill="#0f1d33" />
        </svg>
        <p className="mt-2 text-center text-sm text-ink-mute">Тілдердің ұшындағы дөңгелекті тартыңыз немесе оны таңдап, бағыттауыш пернелерді басыңыз.</p>
      </div>

      <div className="space-y-5">
        <div className="flex flex-wrap items-end gap-3">
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink-soft">Сағат</span>
            <select
              className="input w-24"
              value={hourLabel}
              onChange={(e) => {
                stopAnim();
                setTime((Number(e.target.value) % 12) * 60 + m);
              }}
            >
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-sm font-medium text-ink-soft">Минут</span>
            <input
              type="number"
              min={0}
              max={59}
              className="input w-24"
              value={m}
              onChange={(e) => {
                stopAnim();
                const v = Math.max(0, Math.min(59, Number(e.target.value) || 0));
                setTime(h * 60 + v);
              }}
            />
          </label>
          <button className="btn-primary" onClick={play}>
            3:00 → 3:30 қозғалысы
          </button>
          <button
            className="btn-secondary"
            onClick={() => {
              stopAnim();
              setTime(3 * 60 + 30);
            }}
          >
            Бастапқы шарт: 3:30
          </button>
        </div>

        <div className="surface p-5">
          <div className="text-sm text-ink-mute">Уақыт</div>
          <div className="font-serif text-4xl font-bold tabular-nums text-ink">{timeStr}</div>
          <div className="mt-4 grid gap-2 text-[15px]">
            <Tex tex={`\\text{Минуттық тіл: } ${m} \\times 6^\\circ = ${minDeg}^\\circ`} />
            <Tex tex={`\\text{Сағаттық тіл: } ${h} \\times 30^\\circ + ${m} \\times 0{,}5^\\circ = ${fmt(hourDeg).replace(',', '{,}')}^\\circ`} />
            <Tex tex={`|${minDeg}^\\circ - ${fmt(hourDeg).replace(',', '{,}')}^\\circ| = ${fmt(diff).replace(',', '{,}')}^\\circ`} />
          </div>
          <div className="mt-4 flex items-baseline gap-3 border-t border-line pt-4">
            <span className="text-sm text-ink-soft">Кіші бұрыш</span>
            <span className="font-serif text-3xl font-bold text-teal tabular-nums">{fmt(small)}°</span>
          </div>
          {diff > 180 && (
            <p className="mt-2 text-sm text-ink-soft">
              Айырма 180°-тан үлкен, сондықтан кіші бұрыш: 360° − {fmt(diff)}° = {fmt(small)}°.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
