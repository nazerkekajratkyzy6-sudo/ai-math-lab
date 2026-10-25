import { useState } from 'react';
import Tex from '../components/Tex';
import Slider from '../components/Slider';

const STEPS = [
  'Кітап 12 тең бөлікке бөлінген (4 пен 3-тің ортақ еселігі).',
  '1-күні кітаптың 1/4 бөлігі оқылды: 12 бөліктің 3-еуі.',
  '2-күні қалған 9 бөліктің 1/3 бөлігі оқылды: тағы 3 бөлік.',
  'Оқылмай қалған 6 бөлік — кітаптың жартысы. Ол 60 бетке тең.',
];

/** №18: кітаптың оқылған үлестері */
export default function FractionModel() {
  const [stage, setStage] = useState(3);
  const [U, setU] = useState(60);

  const total = U * 2;
  const per = total / 12;
  const day1 = total / 4;
  const day2 = (total - day1) / 3;

  const color = (i: number) => {
    if (stage >= 1 && i < 3) return '#1f4fbf';
    if (stage >= 2 && i < 6) return '#0e7c7b';
    if (stage >= 3) return '#f3d98b';
    return '#ffffff';
  };

  return (
    <div className="space-y-6">
      <div>
        <div className="flex h-24 overflow-hidden rounded-lg border-2 border-ink/70" role="img" aria-label={`Кітап ${total} бет: 1-күні ${day1}, 2-күні ${day2}, оқылмады ${U}`}>
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className="flex flex-1 items-end justify-center border-r border-ink/20 pb-1 text-[10px] font-semibold text-white transition-colors duration-500 last:border-r-0 sm:text-xs"
              style={{ background: color(i), transitionDelay: `${(i % 6) * 60}ms` }}
            >
              <span className={i >= 6 && stage >= 3 ? 'text-[#6d4c12]' : ''}>{stage >= 3 ? per : ''}</span>
            </div>
          ))}
        </div>
        <div className="mt-2 grid grid-cols-12 text-center text-xs text-ink-soft">
          <span className="col-span-3">{stage >= 1 ? `1-күн: ${stage >= 3 ? day1 + ' бет' : '1/4'}` : ''}</span>
          <span className="col-span-3">{stage >= 2 ? `2-күн: ${stage >= 3 ? day2 + ' бет' : 'қалғанының 1/3'}` : ''}</span>
          <span className="col-span-6">{stage >= 3 ? `Оқылмады: ${U} бет (1/2)` : ''}</span>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <ol className="space-y-2">
            {STEPS.map((s, i) => (
              <li key={i} className={`flex gap-3 rounded-lg px-3 py-2 text-[15px] transition-colors ${i === stage ? 'bg-brand-soft text-ink' : i < stage ? 'text-ink-soft' : 'text-ink-mute'}`}>
                <span className="font-semibold">{i + 1}.</span>
                <span>{i === 3 ? s.replace('60', String(U)) : s}</span>
              </li>
            ))}
          </ol>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => setStage((s) => Math.max(0, s - 1))} disabled={stage === 0}>
              ← Алдыңғы
            </button>
            <button className="btn-primary" onClick={() => setStage((s) => Math.min(3, s + 1))} disabled={stage === 3}>
              Келесі қадам →
            </button>
          </div>
        </div>
        <div className="space-y-4">
          <Slider label="Оқылмай қалған беттер" value={U} min={12} max={150} step={6} unit="бет" onChange={setU} />
          {U !== 60 && (
            <button className="btn-ghost" onClick={() => setU(60)}>
              Бастапқы шарт: 60 бет
            </button>
          )}
          <div className="surface space-y-2 p-5 text-[15px]">
            <Tex className="block" tex={`1 - \\frac{1}{4} = \\frac{3}{4}`} />
            <Tex className="block" tex={`\\frac{3}{4} \\times \\left(1 - \\frac{1}{3}\\right) = \\frac{3}{4} \\times \\frac{2}{3} = \\frac{1}{2}`} />
            <Tex className="block" tex={`${U} : \\frac{1}{2} = ${total}\\ \\text{бет}`} />
            <div className="flex items-baseline gap-3 border-t border-line pt-3">
              <span className="text-sm text-ink-soft">Кітапта барлығы</span>
              <span className="font-serif text-3xl font-bold tabular-nums text-teal">{total} бет</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
