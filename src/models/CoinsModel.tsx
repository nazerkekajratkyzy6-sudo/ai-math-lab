import { useState } from 'react';
import { simulateCoins } from '../data/problems';

function randomCoins() {
  const idx = new Set<number>();
  while (idx.size < 3) idx.add(Math.floor(Math.random() * 10));
  return Array.from({ length: 10 }, (_, i) => idx.has(i));
}

function Coin({ up, hidden, flipping }: { up: boolean; hidden: boolean; flipping: boolean }) {
  return (
    <span
      className="relative inline-flex h-14 w-14 items-center justify-center rounded-full text-[10px] font-bold transition-transform duration-500 sm:h-16 sm:w-16"
      style={{ transform: flipping ? 'rotateY(180deg)' : 'none', transformStyle: 'preserve-3d' }}
    >
      <span
        className={`absolute inset-0 flex items-center justify-center rounded-full border-2 ${
          hidden ? 'border-[#a9b5c6] bg-[#e6eaf0] text-ink-mute' : up ? 'border-[#a77d3e] bg-[#f3d98b] text-[#6d4c12]' : 'border-[#8d99a8] bg-[#dfe3e8] text-[#4a5666]'
        }`}
        style={{ backfaceVisibility: 'hidden' }}
      >
        {hidden ? '?' : up ? 'ЕЛТАҢБА' : 'САН'}
      </span>
    </span>
  );
}

/** №25: 10 тиын, 3-еуі елтаңбасы жоғары; көзді жұмып теңестіру */
export default function CoinsModel() {
  const [coins, setCoins] = useState<boolean[]>(randomCoins);
  const [groupA, setGroupA] = useState<number[]>([]);
  const [eyesClosed, setEyesClosed] = useState(true);
  const [flipped, setFlipped] = useState(false);
  const [flipAnim, setFlipAnim] = useState(false);
  const [sim, setSim] = useState<{ total: number; equal: number } | null>(null);

  const toggle = (i: number) => {
    if (flipped) return;
    setGroupA((g) => (g.includes(i) ? g.filter((x) => x !== i) : g.length < 3 ? [...g, i] : g));
  };

  const flip = () => {
    setFlipAnim(true);
    window.setTimeout(() => {
      setCoins((c) => c.map((v, i) => (groupA.includes(i) ? !v : v)));
      setFlipAnim(false);
      setFlipped(true);
    }, 500);
  };

  const reset = () => {
    setCoins(randomCoins());
    setGroupA([]);
    setEyesClosed(true);
    setFlipped(false);
  };

  const headsA = groupA.filter((i) => coins[i]).length;
  const headsB = coins.filter((v, i) => v && !groupA.includes(i)).length;
  const groupB = coins.map((_, i) => i).filter((i) => !groupA.includes(i));

  return (
    <div className="space-y-6">
      <div className="surface p-4 text-[15px] text-ink-soft">
        <strong className="text-ink">1-қадам:</strong> көз жұмулы — тиындардың беті көрінбейді. Кез келген 3 тиынды басып, А тобына бөліңіз.{' '}
        <strong className="text-ink">2-қадам:</strong> А тобындағы үш тиынды түгел аударыңыз. <strong className="text-ink">3-қадам:</strong> көзді ашып, нәтижені тексеріңіз.
      </div>

      <div className="grid gap-5 md:grid-cols-[1fr_2fr]">
        <section className="card p-4" aria-label="А тобы">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="font-sans text-sm font-semibold text-ink">А тобы ({groupA.length}/3)</h3>
            {!eyesClosed && <span className="text-sm text-ink-soft">елтаңба жоғары: <strong className="text-ink">{headsA}</strong></span>}
          </div>
          <div className="flex min-h-[72px] flex-wrap gap-2" style={{ perspective: 600 }}>
            {groupA.map((i) => (
              <button key={i} onClick={() => toggle(i)} className="rounded-full" aria-label={`${i + 1}-тиынды Б тобына қайтару`} disabled={flipped}>
                <Coin up={coins[i]} hidden={eyesClosed} flipping={flipAnim} />
              </button>
            ))}
            {groupA.length === 0 && <p className="text-sm text-ink-mute">Әзірге бос</p>}
          </div>
        </section>
        <section className="card p-4" aria-label="Б тобы">
          <div className="mb-3 flex items-baseline justify-between">
            <h3 className="font-sans text-sm font-semibold text-ink">Б тобы ({groupB.length})</h3>
            {!eyesClosed && <span className="text-sm text-ink-soft">елтаңба жоғары: <strong className="text-ink">{headsB}</strong></span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {groupB.map((i) => (
              <button key={i} onClick={() => toggle(i)} className="rounded-full" aria-label={`${i + 1}-тиынды А тобына алу`} disabled={flipped || groupA.length >= 3}>
                <Coin up={coins[i]} hidden={eyesClosed} flipping={false} />
              </button>
            ))}
          </div>
        </section>
      </div>

      <div className="flex flex-wrap gap-2">
        <button className="btn-primary" onClick={flip} disabled={groupA.length !== 3 || flipped}>
          А тобындағы 3 тиынды аудару
        </button>
        <button className="btn-secondary" onClick={() => setEyesClosed((v) => !v)} aria-pressed={!eyesClosed}>
          {eyesClosed ? 'Көзді ашу' : 'Көзді жұму'}
        </button>
        <button className="btn-secondary" onClick={reset}>
          Тиындарды қайта араластыру
        </button>
      </div>

      {!eyesClosed && flipped && (
        <p role="status" className={`reveal rounded-lg px-4 py-3 text-[15px] font-medium ${headsA === headsB ? 'bg-ok-soft text-ok' : 'bg-bad-soft text-bad'}`}>
          А тобында {headsA}, Б тобында {headsB} тиын елтаңбасы жоғары қарап тұр — {headsA === headsB ? 'сандар тең.' : 'сандар тең емес.'}
        </p>
      )}

      <div className="surface p-5">
        <p className="eyebrow mb-2">Неге әрдайым шығады?</p>
        <p className="text-[15px] text-ink-soft">
          А тобындағы 3 тиынның k-сы елтаңбасы жоғары болса, Б тобында 3 − k елтаңба қалады. А тобын түгел аударғанда онда да 3 − k елтаңба жоғары болады.
        </p>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button className="btn-secondary" onClick={() => setSim(simulateCoins())}>
            Барлық орналасуды компьютермен тексеру
          </button>
          {sim && (
            <span className="reveal text-[15px] text-ink">
              {sim.total} жағдайдың <strong>{sim.equal}</strong>-інде топтар теңесті.
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
