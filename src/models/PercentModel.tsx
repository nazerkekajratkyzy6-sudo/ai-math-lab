import { useState } from 'react';
import Tex from '../components/Tex';
import Slider from '../components/Slider';
import { fmt } from '../lib/fraction';

const texNum = (x: number) => fmt(Math.round(x * 100) / 100, 2).replace(',', '{,}');

/** №20: алдымен p%-ға өсу, кейін жаңа бағадан p%-ға төмендеу */
export default function PercentModel() {
  const [P, setP] = useState(100);
  const [p, setPct] = useState(20);
  const [stage, setStage] = useState(2);

  const up = (P * (100 + p)) / 100;
  const down = (up * (100 - p)) / 100;
  const vals = [P, up, down];
  const max = Math.max(...vals) * 1.08;
  const labels = ['Бастапқы баға', `+${p}% кейін`, `−${p}% кейін`];
  const colors = ['#5b6b82', '#1f4fbf', '#0e7c7b'];

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-start">
      <div>
        <div className="flex h-72 items-end justify-around gap-4 border-b-2 border-ink/70 px-2" role="img" aria-label={`Баға ${fmt(P)} → ${fmt(up, 2)} → ${fmt(down, 2)} теңге`}>
          {vals.map((v, i) => (
            <div key={i} className="flex h-full w-1/4 flex-col items-center justify-end">
              <span
                className="mb-1 text-sm font-semibold tabular-nums text-ink transition-opacity duration-500"
                style={{ opacity: i <= stage ? 1 : 0 }}
              >
                {fmt(Math.round(v * 100) / 100, 2)}
              </span>
              <div
                className="w-full rounded-t-md transition-all duration-700 ease-out"
                style={{ height: i <= stage ? `${(v / max) * 100}%` : '0%', background: colors[i] }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-around gap-4 px-2 text-center text-xs text-ink-soft">
          {labels.map((l) => (
            <span key={l} className="w-1/4">
              {l}
            </span>
          ))}
        </div>
      </div>

      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Slider label="Бастапқы баға" value={P} min={50} max={1000} step={50} unit="теңге" onChange={setP} />
          <Slider label="Пайыз" value={p} min={5} max={50} step={5} unit="%" onChange={setPct} />
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="btn-primary" onClick={() => setStage((s) => (s >= 2 ? 0 : s + 1))}>
            {stage >= 2 ? 'Басынан көрсету' : 'Келесі өзгеріс'}
          </button>
          <button className="btn-secondary" onClick={() => { setP(100); setPct(20); setStage(2); }}>
            Бастапқы шарт: 100 теңге, 20%
          </button>
        </div>
        <ol className="surface space-y-3 p-5 text-[15px]">
          <li className={stage >= 0 ? '' : 'opacity-40'}>
            <span className="text-sm text-ink-mute">1. Бастапқы баға</span>
            <Tex tex={`${texNum(P)}`} block />
          </li>
          <li className={`transition-opacity ${stage >= 1 ? '' : 'opacity-30'}`}>
            <span className="text-sm text-ink-mute">2. {p}%-ға өсу</span>
            <Tex tex={`${texNum(P)} + ${texNum(P)} \\times ${texNum(p / 100)} = ${texNum(up)}`} block />
          </li>
          <li className={`transition-opacity ${stage >= 2 ? '' : 'opacity-30'}`}>
            <span className="text-sm text-ink-mute">3. Жаңа бағадан {p}%-ға төмендеу</span>
            <Tex tex={`${texNum(up)} - ${texNum(up)} \\times ${texNum(p / 100)} = ${texNum(down)}`} block />
          </li>
        </ol>
        <div className="rounded-lg bg-teal-soft p-4 text-[15px] text-ink">
          <Tex tex={`(1 + ${texNum(p / 100)})(1 - ${texNum(p / 100)}) = 1 - ${texNum(p / 100)}^2 = ${texNum(1 - (p / 100) ** 2)}`} />
          <p className="mt-2 text-sm text-ink-soft">
            Төмендеу үлкенірек бағадан есептелетіндіктен, соңғы баға бастапқыдан{' '}
            <strong className="text-ink">{fmt(Math.round((P - down) * 100) / 100, 2)} теңгеге</strong> кем болады.
          </p>
        </div>
      </div>
    </div>
  );
}
