import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { problems, levelName } from '../data/problems';
import type { Level } from '../data/types';
import { LevelBadge, OutcomeBadge, TypeTag } from '../components/Badges';
import { modelBySlug } from '../models/registry';
import { EXPERIMENTS } from '../data/experiments';

type Filter = { level: Level | 'all'; type: string; outcome: 'all' | 'correct' | 'wrong' };

export default function Problems() {
  const [f, setF] = useState<Filter>({ level: 'all', type: 'all', outcome: 'all' });
  const types = useMemo(() => Array.from(new Set(problems.map((p) => p.type))), []);
  const list = problems.filter(
    (p) => (f.level === 'all' || p.level === f.level) && (f.type === 'all' || p.type === f.type) && (f.outcome === 'all' || p.outcome === f.outcome),
  );

  const levels: (Level | 'all')[] = ['all', 'simple', 'medium', 'complex'];

  return (
    <>
      <PageHeader eyebrow="Тәжірибе" title="30 есеп – 30 тәжірибе">
        30 есеп үш тәжірибеге бөлінген. Әр есеп жеке сценарий ретінде ашылады: бастапқы шарт → зерттеуде тіркелген AI жауабы → өз тексеруің → математикалық негіздеу → ғылыми
        жұмыстағы нәтиже.
      </PageHeader>

      <div className="container-page py-8">
        <div className="surface flex flex-col gap-4 p-4 lg:flex-row lg:items-end">
          <fieldset className="flex-1">
            <legend className="mb-1.5 text-sm font-medium text-ink-soft">Деңгей</legend>
            <div className="flex flex-wrap gap-1.5">
              {levels.map((l) => (
                <button
                  key={l}
                  aria-pressed={f.level === l}
                  onClick={() => setF({ ...f, level: l })}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    f.level === l ? 'border-brand bg-brand text-white' : 'border-line bg-white text-ink-soft hover:border-brand'
                  }`}
                >
                  {l === 'all' ? 'Барлығы' : levelName[l]}
                </button>
              ))}
            </div>
          </fieldset>
          <label className="block lg:w-56">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">Есеп түрі</span>
            <select className="input py-2" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value })}>
              <option value="all">Барлық түр</option>
              {types.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>
          <label className="block lg:w-44">
            <span className="mb-1.5 block text-sm font-medium text-ink-soft">Нәтиже</span>
            <select className="input py-2" value={f.outcome} onChange={(e) => setF({ ...f, outcome: e.target.value as Filter['outcome'] })}>
              <option value="all">Барлығы</option>
              <option value="correct">Дұрыс</option>
              <option value="wrong">Қате</option>
            </select>
          </label>
        </div>
        <p className="mt-4 text-sm text-ink-mute" aria-live="polite">
          Көрсетілді: {list.length} есеп
        </p>

        {EXPERIMENTS.map((ex) => {
          const group = list.filter((p) => p.id >= ex.ids[0] && p.id <= ex.ids[1]);
          if (group.length === 0) return null;
          const all = problems.filter((p) => p.id >= ex.ids[0] && p.id <= ex.ids[1]);
          const ok = all.filter((p) => p.outcome === 'correct').length;
          return (
            <section key={ex.n} className="mt-10" aria-labelledby={`ex-${ex.n}`}>
              <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-3">
                <div>
                  <p className="eyebrow">
                    {ex.title} · №{ex.ids[0]}–{ex.ids[1]}
                  </p>
                  <h2 id={`ex-${ex.n}`} className="mt-1 text-2xl font-bold">
                    {ex.question}
                  </h2>
                </div>
                <span className="text-sm font-semibold tabular-nums text-ink-soft">
                  Нәтиже: {ok}/{all.length} дұрыс
                </span>
              </div>
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {group.map((p) => {
                  const m = p.model ? modelBySlug(p.model) : undefined;
                  return (
                    <li key={p.id}>
                      <Link
                        to={`/esepter/${p.id}`}
                        className={`card group flex h-full flex-col p-5 transition-colors hover:border-brand ${p.outcome === 'wrong' ? 'border-bad/40' : ''}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-serif text-2xl font-bold tabular-nums text-ink">№{p.id}</span>
                          <OutcomeBadge outcome={p.outcome} size="sm" />
                        </div>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          <LevelBadge level={p.level} />
                          <TypeTag type={p.type} />
                        </div>
                        <p className="mt-3 line-clamp-3 flex-1 text-[15px] text-ink">{p.condition}</p>
                        <div className="mt-4 flex items-center justify-between gap-2 border-t border-line pt-3 text-sm">
                          <span className="text-ink-mute">{m ? `Модель: ${m.title}` : 'Интерактивті тексеру'}</span>
                          <span className="font-semibold text-brand group-hover:underline">Ашу →</span>
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
        {list.length === 0 && <p className="mt-6 text-ink-soft">Таңдалған сүзгілерге сәйкес есеп жоқ.</p>}
      </div>
    </>
  );
}
