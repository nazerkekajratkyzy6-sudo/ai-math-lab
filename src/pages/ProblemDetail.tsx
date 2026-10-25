import { Link, useParams } from 'react-router-dom';
import { getProblem, problems } from '../data/problems';
import ProblemScenario from '../components/ProblemScenario';
import { LevelBadge, TypeTag } from '../components/Badges';
import NotFound from './NotFound';

export default function ProblemDetail() {
  const { id } = useParams();
  const p = getProblem(Number(id));
  if (!p) return <NotFound />;
  const prev = getProblem(p.id - 1);
  const next = getProblem(p.id + 1);

  return (
    <div className="container-page py-8">
      <nav aria-label="Навигация жолы" className="text-sm text-ink-mute">
        <Link to="/esepter" className="hover:text-brand">
          30 есеп – 30 тәжірибе
        </Link>{' '}
        / <span className="text-ink">№{p.id}</span>
      </nav>

      <div className="mt-4 grid gap-8 lg:grid-cols-[1fr_260px]">
        <div>
          <div className="mb-5 flex flex-wrap items-center gap-3">
            <h1 className="text-3xl font-bold">{p.id}-есеп</h1>
            <LevelBadge level={p.level} />
            <TypeTag type={p.type} />
          </div>
          <ProblemScenario key={p.id} problem={p} />
          <div className="mt-6 flex justify-between gap-3">
            {prev ? (
              <Link to={`/esepter/${prev.id}`} className="btn-secondary">
                ← {prev.id}-есеп
              </Link>
            ) : (
              <span />
            )}
            {next ? (
              <Link to={`/esepter/${next.id}`} className="btn-secondary">
                {next.id}-есеп →
              </Link>
            ) : (
              <Link to="/statistika" className="btn-secondary">
                Нәтижелер →
              </Link>
            )}
          </div>
        </div>

        <aside className="lg:sticky lg:top-32 lg:self-start">
          <div className="surface p-4">
            <p className="mb-3 text-sm font-semibold text-ink">Барлық есептер</p>
            <div className="grid grid-cols-6 gap-1.5 lg:grid-cols-5">
              {problems.map((q) => (
                <Link
                  key={q.id}
                  to={`/esepter/${q.id}`}
                  aria-current={q.id === p.id ? 'page' : undefined}
                  className={`flex h-9 items-center justify-center rounded-md text-sm font-semibold tabular-nums transition-colors ${
                    q.id === p.id
                      ? 'bg-brand text-white'
                      : q.outcome === 'wrong'
                        ? 'bg-bad-soft text-bad hover:bg-bad hover:text-white'
                        : 'bg-white text-ink-soft hover:bg-brand-soft hover:text-brand'
                  }`}
                >
                  {q.id}
                </Link>
              ))}
            </div>
            <div className="mt-4 space-y-1 text-xs text-ink-mute">
              <p>1–10 — қарапайым, 11–20 — орташа, 21–30 — күрделі/логикалық.</p>
              <p>
                <span className="inline-block h-2.5 w-2.5 rounded-sm bg-bad-soft align-middle" /> зерттеуде қате деп тіркелген есеп
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
