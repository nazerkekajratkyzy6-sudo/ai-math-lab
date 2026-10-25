import { lazy, Suspense } from 'react';
import { Link, useParams } from 'react-router-dom';
import { MODELS, modelBySlug } from '../models/registry';
import { getProblem } from '../data/problems';
import { OutcomeBadge } from '../components/Badges';
import NotFound from './NotFound';

const COMPONENTS = {
  sagat: lazy(() => import('../models/ClockModel')),
  figura: lazy(() => import('../models/AreaModel')),
  payyz: lazy(() => import('../models/PercentModel')),
  'qol-alysu': lazy(() => import('../models/HandshakeModel')),
  qoraptar: lazy(() => import('../models/BoxesModel')),
  tiyndar: lazy(() => import('../models/CoinsModel')),
  bolshekter: lazy(() => import('../models/FractionModel')),
  'ush-san': lazy(() => import('../models/ThreeNumbersModel')),
} as const;

export default function ModelPage() {
  const { slug = '' } = useParams();
  const m = modelBySlug(slug);
  if (!m || !(slug in COMPONENTS)) return <NotFound />;
  const p = getProblem(m.problemId)!;
  const Comp = COMPONENTS[slug as keyof typeof COMPONENTS];
  const idx = MODELS.findIndex((x) => x.slug === slug);
  const next = MODELS[(idx + 1) % MODELS.length];

  return (
    <div className="container-page py-8">
      <nav aria-label="Навигация жолы" className="text-sm text-ink-mute">
        <Link to="/modelder" className="hover:text-brand">
          Математикалық модельдер
        </Link>{' '}
        / <span className="text-ink">{m.title}</span>
      </nav>
      <h1 className="mt-4 text-3xl font-bold">
        №{p.id} — {m.title}
      </h1>

      <div className="mt-5 grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="surface p-5">
          <p className="eyebrow mb-1">Ғылыми жұмыстағы шарт</p>
          <p className="font-serif text-lg leading-relaxed text-ink">{p.condition}</p>
        </div>
        <div className="card p-5">
          <div className="flex items-center justify-between gap-2">
            <p className="eyebrow">Тіркелген нәтиже</p>
            <OutcomeBadge outcome={p.outcome} size="sm" />
          </div>
          <dl className="mt-2 space-y-1 text-[15px]">
            <div className="flex justify-between gap-3">
              <dt className="text-ink-mute">Дұрыс жауап</dt>
              <dd className="text-right font-semibold text-ink">{p.correctAnswer}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-ink-mute">AI жауабы</dt>
              <dd className="text-right text-ink">{p.id === 14 ? '30, 38, 28' : p.aiAnswer}</dd>
            </div>
          </dl>
          <p className="mt-2 text-xs text-ink-mute">Модель параметрлерін өзгерту бұл деректерге әсер етпейді.</p>
        </div>
      </div>

      <section className="card mt-6 p-5 sm:p-7" aria-label="Интерактивті модель">
        <Suspense fallback={<p className="py-16 text-center text-ink-mute">Модель жүктелуде…</p>}>
          <Comp />
        </Suspense>
      </section>

      <div className="mt-6 flex flex-wrap justify-between gap-3">
        <Link to={`/esepter/${p.id}`} className="btn-secondary">
          №{p.id} есептің толық сценарийі
        </Link>
        <Link to={`/modelder/${next.slug}`} className="btn-ghost">
          Келесі модель: {next.title} →
        </Link>
      </div>
    </div>
  );
}
