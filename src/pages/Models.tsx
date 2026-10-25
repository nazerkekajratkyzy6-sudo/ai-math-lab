import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { MODELS } from '../models/registry';
import { getProblem, levelName } from '../data/problems';
import ModelIcon from '../models/ModelIcon';

export default function Models() {
  return (
    <>
      <PageHeader eyebrow="Интерактивті модельдер" title="Математикалық модельдер">
        Ғылыми жұмыстағы 30 есептің сегізі тереңдетілген интерактивті модель ретінде берілген. Параметрлерді өзгертуге болады, бірақ зерттеудің
        тіркелген нәтижесі өзгермейді.
      </PageHeader>
      <div className="container-page py-10">
        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {MODELS.map((m) => {
            const p = getProblem(m.problemId)!;
            return (
              <li key={m.slug}>
                <Link to={`/modelder/${m.slug}`} className="card group flex h-full flex-col p-5 transition-colors hover:border-brand">
                  <div className="flex items-center justify-between">
                    <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-soft text-brand">
                      <ModelIcon slug={m.slug} />
                    </span>
                    <span className="text-sm font-semibold tabular-nums text-ink-mute">№{m.problemId}</span>
                  </div>
                  <h2 className="mt-4 font-sans text-lg font-semibold text-ink group-hover:text-brand">{m.title}</h2>
                  <p className="mt-1 text-sm font-medium text-teal">{m.short}</p>
                  <p className="mt-2 flex-1 text-sm text-ink-soft">{m.description}</p>
                  <p className="mt-4 text-xs text-ink-mute">{levelName[p.level]} деңгей · {p.type}</p>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-8 max-w-3xl text-sm text-ink-mute">
          Қалған 22 есептің әрқайсысы «30 есеп – 30 тәжірибе» бөлімінде жеке интерактивті тексеру сценарийі ретінде жұмыс істейді.
        </p>
      </div>
    </>
  );
}
