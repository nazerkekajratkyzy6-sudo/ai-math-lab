import { useState } from 'react';
import Tex from '../components/Tex';
import TripleChecker from './TripleChecker';
import { F } from '../lib/fraction';

/** №14: үш санды тексеру және екінші санды өзгерткенде қосындының өзгерісі */
export default function ThreeNumbersModel() {
  // b = k/3, k ∈ [78; 105] — 26-дан 35-ке дейін, қадамы 1/3
  const [k, setK] = useState(90);
  const b = F(k, 3);
  const a = b.add(8);
  const c = b.sub(4);
  const sum = a.add(b).add(c);
  const hits = sum.eq(96);

  const ticks = Array.from({ length: 105 - 78 + 1 }, (_, i) => 78 + i);

  return (
    <div className="space-y-8">
      <section>
        <h3 className="mb-1 font-sans text-base font-semibold text-ink">1. Үш санды енгізіп, әр шартты жеке тексеру</h3>
        <p className="mb-4 text-[15px] text-ink-soft">Қосынды және екі айырма бір-біріне тәуелсіз тексеріледі. Дайын мысалдарды да салыстырып көріңіз.</p>
        <TripleChecker />
      </section>

      <section className="border-t border-line pt-8">
        <h3 className="mb-1 font-sans text-base font-semibold text-ink">2. Екінші санды (b) жылжыту</h3>
        <p className="mb-4 text-[15px] text-ink-soft">
          Мұнда a = b + 8 және c = b − 4 шарттары әрқашан орындалады. Қосынды 3b + 4 болады. Ол 96-ға қай кезде тең болатынын бақылаңыз.
        </p>
        <label className="block">
          <span className="mb-1.5 flex justify-between text-sm">
            <span className="font-medium text-ink-soft">b мәні (қадамы 1/3)</span>
            <span className="font-semibold text-ink">
              <Tex tex={`b = ${b.tex()}${b.isInt() ? '' : `\\approx ${b.value().toFixed(2).replace('.', '{,}')}`}`} />
            </span>
          </span>
          <input type="range" min={78} max={105} step={1} value={k} onChange={(e) => setK(Number(e.target.value))} className="w-full accent-[#1f4fbf]" aria-valuetext={`b = ${b.text()}`} />
        </label>
        <div className="mt-1 flex justify-between px-[6px]" aria-hidden="true">
          {ticks.map((t) => (
            <span key={t} className={t === 92 ? 'h-4 w-0.5 bg-teal' : t % 3 === 0 ? 'h-3 w-px bg-ink' : 'h-2 w-px bg-line'} />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-ink-mute">
          <span>26</span>
          <span>35</span>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-3">
          {[
            { n: 'a = b + 8', v: a },
            { n: 'b', v: b },
            { n: 'c = b − 4', v: c },
          ].map((x) => (
            <div key={x.n} className="surface p-4 text-center">
              <div className="text-sm text-ink-mute">{x.n}</div>
              <Tex tex={x.v.tex()} className="text-2xl" />
            </div>
          ))}
        </div>
        <div className={`mt-4 rounded-lg p-4 text-[15px] ${hits ? 'bg-ok-soft text-ok' : 'bg-surface text-ink'}`} aria-live="polite">
          <Tex tex={`a + b + c = 3b + 4 = ${sum.tex()} ${hits ? '= 96' : '\\neq 96'}`} />
          <p className="mt-2 text-sm">
            {hits
              ? 'Барлық шарт орындалды. Бірақ b = 92/3 бүтін сан емес.'
              : b.isInt()
                ? `b бүтін сан болғанда қосынды 3b + 4 түрінде болады, ал 96 − 4 = 92 саны 3-ке бөлінбейді. Сондықтан бүтін b үшін қосынды ешқашан 96 болмайды.`
                : 'Қосынды 96-дан өзгеше. Слайдерді жылжытып көріңіз.'}
          </p>
        </div>
        <button className="btn-secondary mt-4" onClick={() => setK(92)}>
          b = 92/3 мәнін қою
        </button>
      </section>
    </div>
  );
}
