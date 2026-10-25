import { useMemo, useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { Problem } from '../data/types';
import { parseUserNumber } from '../lib/fraction';
import CheckRows from './CheckRows';
import { OutcomeBadge } from './Badges';
import TripleChecker from '../models/TripleChecker';
import { modelBySlug } from '../models/registry';

type Feedback = { ok: boolean; text: string } | null;

function Step({
  n,
  title,
  active,
  done,
  children,
}: {
  n: number;
  title: string;
  active: boolean;
  done: boolean;
  children: ReactNode;
}) {
  return (
    <li className="group relative pb-8 pl-12 last:pb-0">
      <span
        aria-hidden="true"
        className="absolute left-[15px] top-9 h-[calc(100%-2.25rem)] w-px bg-line group-last:hidden"
      />
      <span
        aria-hidden="true"
        className={`absolute left-0 top-0 flex h-8 w-8 items-center justify-center rounded-full border text-sm font-semibold ${
          done
            ? 'border-brand bg-brand text-white'
            : active
              ? 'border-brand bg-white text-brand'
              : 'border-line bg-surface text-ink-mute'
        }`}
      >
        {done ? '✓' : n}
      </span>
      <h3 className={`pt-1 font-sans text-[15px] font-semibold ${active || done ? 'text-ink' : 'text-ink-mute'}`}>
        <span className="sr-only">{n}-қадам. </span>
        {title}
      </h3>
      <div className="mt-3">{children}</div>
    </li>
  );
}

/** Бір есептің толық интерактивті сценарийі: шарт → AI жауабы → өз тексеруің → негіздеу → нәтиже */
export default function ProblemScenario({ problem }: { problem: Problem }) {
  const [stage, setStage] = useState(0);
  const [value, setValue] = useState('');
  const [values, setValues] = useState<string[]>(['', '']);
  const [choice, setChoice] = useState<number | null>(null);
  const [feedback, setFeedback] = useState<Feedback>(null);
  const v = useMemo(() => problem.verify(), [problem]);
  const model = problem.model ? modelBySlug(problem.model) : undefined;
  const inp = problem.input;

  const reset = () => {
    setStage(0);
    setValue('');
    setValues(['', '']);
    setChoice(null);
    setFeedback(null);
  };

  const submitOwn = () => {
    if (inp.kind === 'number') {
      const f = parseUserNumber(value);
      if (!f) return setFeedback({ ok: false, text: 'Санды дұрыс форматта енгізіңіз (мысалы, 605 немесе 12,5).' });
      const ok = f.eq(inp.expected);
      setFeedback({
        ok,
        text: ok
          ? 'Сіздің жауабыңыз математикалық есептеумен сәйкес келді.'
          : `Сіздің жауабыңыз (${value.trim()}${inp.unit ? ' ' + inp.unit : ''}) есептелген мәнмен сәйкес емес. Төмендегі негіздеуді қарап шығыңыз.`,
      });
    } else if (inp.kind === 'numbers') {
      const fs = values.map(parseUserNumber);
      if (fs.some((x) => !x)) return setFeedback({ ok: false, text: 'Барлық өрісті толтырыңыз.' });
      const ok = fs.every((x, i) => x!.eq(inp.expected[i]));
      setFeedback({
        ok,
        text: ok ? 'Сіздің жауабыңыз шарттың барлығын қанағаттандырады.' : 'Сіздің жауабыңыз шартты толық қанағаттандырмайды. Негіздеуді қарап шығыңыз.',
      });
    } else if (inp.kind === 'choice') {
      if (choice === null) return setFeedback({ ok: false, text: 'Бір нұсқаны таңдаңыз.' });
      const ok = choice === inp.expected;
      setFeedback({
        ok,
        text: ok ? 'Таңдауыңыз логикалық талдаумен сәйкес келді.' : 'Бұл нұсқа логикалық талдауға сәйкес келмейді. Негіздеуді қарап шығыңыз.',
      });
    }
    setStage((s) => Math.max(s, 2));
  };

  return (
    <div className="card p-5 sm:p-7">
      <ol>
        <Step n={1} title="Есеп шарты" active done={stage >= 1}>
          <p className="font-serif text-xl leading-relaxed text-ink sm:text-[22px]">{problem.condition}</p>
          {stage === 0 && (
            <button className="btn-primary mt-4" onClick={() => setStage(1)}>
              Зерттеуде тіркелген AI жауабын ашу
            </button>
          )}
        </Step>

        <Step n={2} title="AI жауабы (зерттеуде тіркелген)" active={stage >= 1} done={stage >= 2}>
          {stage >= 1 ? (
            <div className="reveal">
              <div className="surface flex items-start gap-3 p-4">
                <span className="mt-0.5 rounded-md bg-ink px-2 py-0.5 text-xs font-bold text-white">AI</span>
                <p className="text-[17px] font-medium text-ink">{problem.aiShort ?? problem.aiAnswer}</p>
              </div>
              <p className="mt-2 text-sm text-ink-mute">Бұл жауап ғылыми жұмыстағы тіркеу кестесінен өзгеріссіз алынды.</p>
              {problem.aiShort && stage >= 2 && (
                <p className="mt-1 text-sm text-ink-soft">
                  <span className="font-semibold">Зерттеудегі ескертпе:</span> {problem.aiAnswer.replace(problem.aiShort + '. ', '')}
                </p>
              )}
            </div>
          ) : (
            <p className="text-sm text-ink-mute">Алдыңғы қадамнан кейін ашылады.</p>
          )}
        </Step>

        <Step n={3} title="Өзің тексер" active={stage >= 1} done={stage >= 2}>
          {stage >= 1 ? (
            <div className="reveal">
              <p className="mb-3 text-[15px] text-ink-soft">
                Есепті өзің шығарып, жауабыңды енгіз. Дұрыс жауап сен әрекет жасағаннан кейін ғана ашылады.
              </p>
              {'hint' in inp && inp.hint && <p className="mb-3 text-sm text-teal">Кеңес: {inp.hint}</p>}

              {inp.kind === 'triple14' ? (
                <TripleChecker showPresets={false} onChecked={() => setStage((s) => Math.max(s, 2))} />
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    submitOwn();
                  }}
                >
                  {inp.kind === 'number' && (
                    <label className="block max-w-xs">
                      <span className="mb-1 block text-sm font-medium text-ink-soft">Сенің жауабың{inp.unit ? ` (${inp.unit})` : ''}</span>
                      <input className="input tabular-nums" inputMode="decimal" value={value} onChange={(e) => setValue(e.target.value)} />
                    </label>
                  )}
                  {inp.kind === 'numbers' && (
                    <div className="grid max-w-lg gap-3 sm:grid-cols-2">
                      {inp.labels.map((l, i) => (
                        <label key={l} className="block">
                          <span className="mb-1 block text-sm font-medium text-ink-soft">{l}</span>
                          <input
                            className="input tabular-nums"
                            inputMode="decimal"
                            value={values[i]}
                            onChange={(e) => {
                              const n = [...values];
                              n[i] = e.target.value;
                              setValues(n);
                            }}
                          />
                        </label>
                      ))}
                    </div>
                  )}
                  {inp.kind === 'choice' && (
                    <fieldset className="grid gap-2">
                      <legend className="sr-only">Жауап нұсқалары</legend>
                      {inp.options.map((o, i) => (
                        <label
                          key={o}
                          className={`flex cursor-pointer items-start gap-3 rounded-lg border px-4 py-3 text-[15px] transition-colors ${
                            choice === i ? 'border-brand bg-brand-soft' : 'border-line hover:border-brand/50'
                          }`}
                        >
                          <input
                            type="radio"
                            name={`choice-${problem.id}`}
                            className="mt-1 accent-[#1f4fbf]"
                            checked={choice === i}
                            onChange={() => setChoice(i)}
                          />
                          {o}
                        </label>
                      ))}
                    </fieldset>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button type="submit" className="btn-primary">
                      Жауабымды тексеру
                    </button>
                    {stage < 2 && (
                      <button type="button" className="btn-ghost" onClick={() => setStage(2)}>
                        Жауапсыз негіздеуге өту
                      </button>
                    )}
                  </div>
                </form>
              )}
              {feedback && (
                <p
                  role="status"
                  className={`reveal mt-3 rounded-lg px-4 py-3 text-sm font-medium ${feedback.ok ? 'bg-ok-soft text-ok' : 'bg-bad-soft text-bad'}`}
                >
                  {feedback.ok ? '✓ ' : '✗ '}
                  {feedback.text}
                </p>
              )}
              {inp.kind === 'triple14' && stage < 2 && (
                <button type="button" className="btn-ghost mt-3" onClick={() => setStage(2)}>
                  Жауапсыз негіздеуге өту
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-ink-mute">AI жауабы ашылғаннан кейін белсенді болады.</p>
          )}
        </Step>

        <Step n={4} title="Математикалық негіздеу және AI жауабын тексеру" active={stage >= 2} done={stage >= 3}>
          {stage >= 2 ? (
            <div className="reveal space-y-5">
              <div>
                <p className="eyebrow mb-1">Шешу жолы</p>
                <CheckRows rows={v.steps} />
              </div>
              <div>
                <p className="eyebrow mb-1">AI жауабын шартқа қойып тексеру</p>
                <CheckRows rows={v.aiCheck} />
              </div>
              <div className={`rounded-lg px-4 py-3 text-[15px] ${v.aiSatisfies ? 'bg-ok-soft text-ok' : 'bg-bad-soft text-bad'}`}>
                <strong>Алгоритм қорытындысы:</strong>{' '}
                {v.aiSatisfies ? 'AI жауабы есеп шартын толық қанағаттандырады.' : 'AI жауабы есеп шартының барлығын қанағаттандырмайды.'}{' '}
                <span className="text-ink-soft">Есептелген жауап: {v.reference}.</span>
              </div>
              {stage < 3 && (
                <button className="btn-primary" onClick={() => setStage(3)}>
                  Ғылыми жұмыстағы нәтижені көрсету
                </button>
              )}
            </div>
          ) : (
            <p className="text-sm text-ink-mute">Өз тексеруіңнен кейін ашылады.</p>
          )}
        </Step>

        <Step n={5} title="Ғылыми жұмыстағы нәтиже" active={stage >= 3} done={stage >= 3}>
          {stage >= 3 ? (
            <div className="reveal">
              <dl className="grid gap-3 text-[15px] sm:grid-cols-[12rem_1fr]">
                <dt className="text-ink-mute">Зерттеудегі шешім</dt>
                <dd className="text-ink">{problem.sourceSolution}</dd>
                <dt className="text-ink-mute">Дұрыс жауап</dt>
                <dd className="font-semibold text-ink">{problem.correctAnswer}</dd>
                <dt className="text-ink-mute">AI жауабы</dt>
                <dd className="text-ink">{problem.aiAnswer}</dd>
                <dt className="text-ink-mute">Тіркелген нәтиже</dt>
                <dd>
                  <OutcomeBadge outcome={problem.outcome} />
                </dd>
              </dl>
              <div className="mt-5 flex flex-wrap gap-2">
                <button className="btn-secondary" onClick={reset}>
                  Сценарийді қайта бастау
                </button>
                {model && (
                  <Link to={`/modelder/${model.slug}`} className="btn-ghost">
                    Интерактивті модель: {model.title} →
                  </Link>
                )}
                {problem.id === 14 && (
                  <Link to="/qate" className="btn-ghost">
                    Қатені толық талдау →
                  </Link>
                )}
              </div>
            </div>
          ) : (
            <p className="text-sm text-ink-mute">Негіздеуден кейін ашылады.</p>
          )}
        </Step>
      </ol>
    </div>
  );
}
