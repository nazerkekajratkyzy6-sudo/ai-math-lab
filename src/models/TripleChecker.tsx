import { useState } from 'react';
import { F, Frac, parseUserNumber } from '../lib/fraction';
import Tex from '../components/Tex';
import { CheckMark } from '../components/Badges';

/** №14: үш санды енгізіп, қосындыны және екі айырманы жеке тексеру */
export interface TripleResult {
  a: Frac;
  b: Frac;
  c: Frac;
  sumOk: boolean;
  diff1Ok: boolean;
  diff2Ok: boolean;
}

export function checkTriple(a: Frac, b: Frac, c: Frac): TripleResult {
  return {
    a,
    b,
    c,
    sumOk: a.add(b).add(c).eq(96),
    diff1Ok: a.sub(b).eq(8),
    diff2Ok: b.sub(c).eq(4),
  };
}

const PRESETS = [
  { label: 'AI жауабы: 30, 38, 28', v: ['30', '38', '28'] },
  { label: 'Бөлшек шешім: 116/3, 92/3, 80/3', v: ['116/3', '92/3', '80/3'] },
];

export default function TripleChecker({
  onChecked,
  showPresets = true,
  initial = ['', '', ''],
}: {
  onChecked?: (r: TripleResult) => void;
  showPresets?: boolean;
  initial?: string[];
}) {
  const [vals, setVals] = useState<string[]>(initial);
  const [res, setRes] = useState<TripleResult | null>(null);
  const [err, setErr] = useState('');

  const run = (v = vals) => {
    const parsed = v.map(parseUserNumber);
    if (parsed.some((p) => p === null)) {
      setErr('Үш санды да енгізіңіз. Бөлшекті «116/3», ондық бөлшекті «38,5» түрінде жазуға болады.');
      setRes(null);
      return;
    }
    setErr('');
    const r = checkTriple(parsed[0]!, parsed[1]!, parsed[2]!);
    setRes(r);
    onChecked?.(r);
  };

  const names = ['Бірінші сан (a)', 'Екінші сан (b)', 'Үшінші сан (c)'];
  const allOk = res && res.sumOk && res.diff1Ok && res.diff2Ok;
  const integers = res && res.a.isInt() && res.b.isInt() && res.c.isInt();

  return (
    <div>
      <form
        className="grid gap-3 sm:grid-cols-3"
        onSubmit={(e) => {
          e.preventDefault();
          run();
        }}
      >
        {names.map((n, i) => (
          <label key={n} className="block">
            <span className="mb-1 block text-sm font-medium text-ink-soft">{n}</span>
            <input
              className="input font-medium tabular-nums"
              inputMode="text"
              value={vals[i]}
              onChange={(e) => {
                const next = [...vals];
                next[i] = e.target.value;
                setVals(next);
              }}
              placeholder="мысалы, 30"
            />
          </label>
        ))}
        <div className="flex flex-wrap gap-2 sm:col-span-3">
          <button type="submit" className="btn-primary">
            Шарттарды тексеру
          </button>
          {showPresets &&
            PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                className="btn-secondary"
                onClick={() => {
                  setVals(p.v);
                  run(p.v);
                }}
              >
                {p.label}
              </button>
            ))}
        </div>
      </form>
      {err && (
        <p role="alert" className="mt-3 text-sm text-bad">
          {err}
        </p>
      )}
      {res && (
        <div className="reveal mt-5 rounded-xl border border-line bg-white" aria-live="polite">
          {[
            {
              title: '1-шарт: қосынды 96-ға тең',
              tex: `${res.a.tex()} + ${res.b.tex()} + ${res.c.tex()} = ${res.a.add(res.b).add(res.c).tex()}`,
              ok: res.sumOk,
            },
            {
              title: '2-шарт: бірінші сан екіншісінен 8-ге артық (a − b = 8)',
              tex: `${res.a.tex()} - ${res.b.tex()} = ${res.a.sub(res.b).tex()}`,
              ok: res.diff1Ok,
            },
            {
              title: '3-шарт: үшінші сан екіншісінен 4-ке кем (b − c = 4)',
              tex: `${res.b.tex()} - ${res.c.tex()} = ${res.b.sub(res.c).tex()}`,
              ok: res.diff2Ok,
            },
          ].map((row) => (
            <div key={row.title} className="flex items-start gap-3 border-b border-line px-4 py-3 last:border-b-0">
              <CheckMark ok={row.ok} />
              <div className="min-w-0 flex-1">
                <div className="text-sm font-medium text-ink">{row.title}</div>
                <div className="overflow-x-auto">
                  <Tex tex={row.tex} />
                </div>
              </div>
              <span className={`shrink-0 text-xs font-semibold ${row.ok ? 'text-ok' : 'text-bad'}`}>
                {row.ok ? 'орындалады' : 'бұзылды'}
              </span>
            </div>
          ))}
          <div className={`rounded-b-xl px-4 py-3 text-sm ${allOk ? 'bg-ok-soft text-ok' : 'bg-bad-soft text-bad'}`}>
            {allOk
              ? integers
                ? 'Барлық шарт орындалды.'
                : 'Барлық шарт орындалды. Бұл сандар бүтін емес: шарт бүтін сандарды талап етпесе, бұл — дұрыс шешім.'
              : `Барлық шарт орындалмады: ${[!res.sumOk && '1-шарт', !res.diff1Ok && '2-шарт', !res.diff2Ok && '3-шарт']
                  .filter(Boolean)
                  .join(', ')} бұзылды.`}
          </div>
        </div>
      )}
    </div>
  );
}

export const FRACTION_SOLUTION = [F(116, 3), F(92, 3), F(80, 3)];
