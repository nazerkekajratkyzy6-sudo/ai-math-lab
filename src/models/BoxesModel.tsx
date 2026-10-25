import { useMemo, useState } from 'react';
import { BOX_LABELS, analyzeBoxes, type Fruit } from '../data/problems';

type Drawn = 'алма' | 'алмұрт';

const fruitsOf = (c: Fruit): Drawn[] => (c === 'Алма және алмұрт' ? ['алма', 'алмұрт'] : [c === 'Алма' ? 'алма' : 'алмұрт']);

function FruitIcon({ kind, size = 28 }: { kind: Drawn; size?: number }) {
  return kind === 'алма' ? (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <path d="M16 9c-3-2-9-1.5-9.5 5.5C6 21 10 27 13 27c1.5 0 2-.8 3-.8s1.5.8 3 .8c3 0 7-6 6.5-12.5C25 7.5 19 7 16 9z" fill="#c8372d" />
      <path d="M16 9c0-2 .5-4 2-5.5" stroke="#5a3b1c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
      <path d="M17.5 6.5c2-1.5 4.5-1 5.5 0-1.5 1.5-4 1.5-5.5 0z" fill="#3f8f3a" />
    </svg>
  ) : (
    <svg viewBox="0 0 32 32" width={size} height={size} aria-hidden="true">
      <path d="M16 6c-2.2 0-3.3 2-3.3 4.5 0 2.2-1.2 3.4-2.7 5.6C8.6 18.3 8 20 8 22c0 3.5 3.5 6 8 6s8-2.5 8-6c0-2-.6-3.7-2-5.9-1.5-2.2-2.7-3.4-2.7-5.6C19.3 8 18.2 6 16 6z" fill="#c9b23a" />
      <path d="M16 6c0-1.5.4-2.6 1.4-3.5" stroke="#5a3b1c" strokeWidth="1.6" fill="none" strokeLinecap="round" />
    </svg>
  );
}

/** №21: үш жазуы қате қорап және бір жеміс арқылы анықтау */
export default function BoxesModel() {
  const analysis = useMemo(() => analyzeBoxes(), []);
  const [truthIdx, setTruthIdx] = useState(() => Math.floor(Math.random() * analysis.arrangements.length));
  const [picked, setPicked] = useState<number | null>(null);
  const [drawn, setDrawn] = useState<Drawn | null>(null);
  const [opened, setOpened] = useState(false);

  const truth = analysis.arrangements[truthIdx];

  const remaining = useMemo(() => {
    if (picked === null || !drawn) return analysis.arrangements;
    return analysis.arrangements.filter((a) => fruitsOf(a[picked]).includes(drawn));
  }, [analysis, picked, drawn]);

  const draw = (i: number) => {
    if (picked !== null) return;
    const options = fruitsOf(truth[i]);
    setPicked(i);
    setDrawn(options[Math.floor(Math.random() * options.length)]);
  };

  const reset = () => {
    setTruthIdx(Math.floor(Math.random() * analysis.arrangements.length));
    setPicked(null);
    setDrawn(null);
    setOpened(false);
  };

  const determined = remaining.length === 1;

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-3">
        {BOX_LABELS.map((label, i) => {
          const isPicked = picked === i;
          const known = determined && picked !== null;
          return (
            <div key={label} className={`card overflow-hidden transition-shadow ${isPicked ? 'ring-2 ring-brand' : ''}`}>
              <div className="border-b border-line bg-surface px-4 py-2 text-center">
                <span className="text-xs text-ink-mute">Жазуы (қате)</span>
                <div className="font-semibold text-ink line-through decoration-bad/70 decoration-2">«{label}»</div>
              </div>
              <div className="flex min-h-[132px] flex-col items-center justify-center gap-2 px-4 py-4">
                <svg viewBox="0 0 120 60" className="w-28" aria-hidden="true">
                  <path d="M10 20 L60 8 L110 20 L110 52 L10 52 Z" fill="#f1e3c8" stroke="#a77d3e" strokeWidth="2" />
                  <path d="M10 20 L110 20" stroke="#a77d3e" strokeWidth="2" />
                  <path d="M60 8 L60 52" stroke="#a77d3e" strokeWidth="1" strokeDasharray="3 3" />
                </svg>
                {isPicked && drawn ? (
                  <div className="reveal flex items-center gap-2 text-sm font-semibold text-ink">
                    <FruitIcon kind={drawn} /> алынды: {drawn}
                  </div>
                ) : (
                  <button className="btn-secondary px-3 py-1.5 text-xs" onClick={() => draw(i)} disabled={picked !== null}>
                    Осы қораптан бір жеміс алу
                  </button>
                )}
              </div>
              <div className={`border-t border-line px-4 py-2 text-center text-sm ${opened || known ? 'bg-teal-soft' : 'bg-white'}`}>
                {opened || known ? (
                  <span className="reveal font-semibold text-teal">Ішінде: {(opened ? truth : remaining[0])[i]}</span>
                ) : (
                  <span className="text-ink-mute">Ішіндегісі белгісіз</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_1fr]">
        <div className="surface p-5">
          <p className="eyebrow mb-2">Мүмкін орналасулар</p>
          <p className="mb-3 text-sm text-ink-soft">
            Барлық жазу қате болуы үшін тек {analysis.arrangements.length} орналасу мүмкін. Алынған жеміске сәйкес келмейтіндері сызылады.
          </p>
          <table className="table-academic bg-white">
            <thead>
              <tr>
                <th>№</th>
                {BOX_LABELS.map((l) => (
                  <th key={l} className="text-xs">
                    «{l}»
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {analysis.arrangements.map((a, k) => {
                const alive = remaining.includes(a);
                return (
                  <tr key={k} className={alive ? '' : 'text-ink-mute line-through'}>
                    <td>{k + 1}</td>
                    {a.map((c, i) => (
                      <td key={i}>{c}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className="space-y-4">
          <div className="card p-5" aria-live="polite">
            <p className="eyebrow mb-2">Логикалық қорытынды</p>
            {picked === null ? (
              <p className="text-[15px] text-ink-soft">Кез келген қорапты таңдап, бір жеміс алыңыз. Қай қораптан алу ең тиімді екенін тексеріңіз.</p>
            ) : determined ? (
              <div className="text-[15px] text-ink">
                <p>
                  «{BOX_LABELS[picked]}» қорабынан <strong>{drawn}</strong> алынды. Бір ғана орналасу қалды — барлық қораптың мазмұны анықталды.
                </p>
                {BOX_LABELS[picked] === 'Алма және алмұрт' && (
                  <p className="mt-2 text-sm text-ink-soft">
                    Бұл қораптың жазуы қате, демек онда аралас жеміс жоқ: ішінде тек {drawn}. Қалған екі қораптың жазулары да қате болуы керек, сондықтан олардың мазмұны бірмәнді шығады.
                  </p>
                )}
              </div>
            ) : (
              <p className="text-[15px] text-ink">
                «{BOX_LABELS[picked]}» қорабынан <strong>{drawn}</strong> алынды, бірақ {remaining.length} орналасу әлі мүмкін. Бұл қораптан бір жеміс алу әрдайым жеткілікті емес. «Алма және алмұрт» қорабынан алып көріңіз.
              </p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            <button className="btn-secondary" onClick={() => setOpened(true)} disabled={opened}>
              Қораптарды ашып тексеру
            </button>
            <button className="btn-primary" onClick={reset}>
              Жаңа орналасу
            </button>
          </div>
          <div className="surface p-4 text-sm text-ink-soft">
            <strong className="text-ink">Компьютерлік талдау:</strong>{' '}
            {analysis.byBox.map((b) => `«${b.label}» — ${b.unique ? 'кез келген жеміс мазмұнды толық анықтайды' : 'толық анықтауға кепілдік бермейді'}`).join('; ')}.
          </div>
        </div>
      </div>
    </div>
  );
}
