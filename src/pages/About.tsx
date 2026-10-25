import type { ReactNode } from 'react';
import PageHeader from '../components/PageHeader';
import { research as r } from '../data/research';

const TOC = [
  ['tuyndy', 'Жоба деректері'],
  ['annotation', 'Аннотация'],
  ['kirispe', 'Кіріспе'],
  ['maqsat', 'Мақсат пен міндеттер'],
  ['bolzham', 'Сұрақ пен болжам'],
  ['adisteme', 'Әдістеме'],
  ['teoriya', 'Теориялық бөлім'],
  ['onim', 'Практикалық өнім'],
  ['qorytyndy', 'Қорытынды'],
  ['usynystar', 'Ұсыныстар'],
  ['kundelik', 'Зерттеу күнделігі'],
  ['adebiet', 'Әдебиеттер'],
] as const;

function Sec({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-32 border-t border-line pt-8">
      <h2 className="text-2xl font-bold">{title}</h2>
      <div className="mt-4 space-y-3 text-[16px] leading-relaxed text-ink-soft">{children}</div>
    </section>
  );
}

export default function About() {
  return (
    <>
      <PageHeader eyebrow="Жоба туралы" title={`«${r.topic}»`}>
        {r.contest}. Бағыт: {r.direction}. Секция: {r.section}.
      </PageHeader>

      <div className="container-page grid gap-10 py-10 lg:grid-cols-[220px_1fr]">
        <nav aria-label="Бөлім мазмұны" className="hidden lg:block">
          <ul className="sticky top-32 space-y-1 border-l border-line text-sm">
            {TOC.map(([id, t]) => (
              <li key={id}>
                <a href={`#${id}`} className="-ml-px block border-l-2 border-transparent py-1 pl-4 text-ink-soft hover:border-brand hover:text-brand">
                  {t}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <article className="min-w-0 max-w-3xl space-y-10">
          <section id="tuyndy" className="scroll-mt-32">
            <dl className="card grid gap-x-6 gap-y-3 p-6 text-[15px] sm:grid-cols-[11rem_1fr]">
              <dt className="text-ink-mute">Қатысушы</dt>
              <dd className="font-semibold text-ink">
                {r.author}, {r.grade} оқушысы
              </dd>
              <dt className="text-ink-mute">Мектеп</dt>
              <dd className="text-ink">{r.school}</dd>
              <dt className="text-ink-mute">Ғылыми жетекшісі</dt>
              <dd className="text-ink">
                {r.supervisor}, {r.supervisorRole}
              </dd>
              <dt className="text-ink-mute">Ұйымдастырушы</dt>
              <dd className="text-ink">{r.organizer}</dd>
              <dt className="text-ink-mute">Жас санаты</dt>
              <dd className="text-ink">«Орта буын»</dd>
              <dt className="text-ink-mute">Қала, жыл</dt>
              <dd className="text-ink">{r.cityYear}</dd>
            </dl>
          </section>

          <Sec id="annotation" title="Аннотация">
            {r.annotation.map((t) => (
              <p key={t}>{t}</p>
            ))}
            <p>
              <span className="font-semibold text-ink">Тірек сөздер:</span> {r.keywords}.
            </p>
          </Sec>

          <Sec id="kirispe" title="Кіріспе">
            {r.introduction.map((t) => (
              <p key={t}>{t}</p>
            ))}
          </Sec>

          <Sec id="maqsat" title="Зерттеудің мақсаты мен міндеттері">
            <p className="rounded-lg border-l-4 border-brand bg-brand-soft p-4 text-ink">{r.goal}</p>
            <ol className="list-decimal space-y-1 pl-6">
              {r.tasks.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </Sec>

          <Sec id="bolzham" title="Зерттеу сұрағы мен болжамы">
            <p>
              <span className="font-semibold text-ink">Зерттеу сұрағы:</span> {r.question}
            </p>
            <p>
              <span className="font-semibold text-ink">Зерттеу болжамы:</span> {r.hypothesis}
            </p>
            <p>
              <span className="font-semibold text-ink">Зерттеу нысаны:</span> {r.object}
            </p>
            <p>
              <span className="font-semibold text-ink">Зерттеу пәні:</span> {r.subject}
            </p>
          </Sec>

          <Sec id="adisteme" title="Зерттеу әдістері мен жаңалығы">
            <p>{r.methods}</p>
            <p>
              <span className="font-semibold text-ink">Жобаның жаңалығы:</span> {r.novelty}
            </p>
            <p>{r.organization}</p>
            <table className="table-academic max-w-md">
              <thead>
                <tr>
                  <th>Деңгей</th>
                  <th className="text-right">Есеп саны</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Қарапайым</td>
                  <td className="text-right">10</td>
                </tr>
                <tr>
                  <td>Орташа</td>
                  <td className="text-right">10</td>
                </tr>
                <tr>
                  <td>Күрделі және логикалық</td>
                  <td className="text-right">10</td>
                </tr>
              </tbody>
              <tfoot>
                <tr>
                  <td>Барлығы</td>
                  <td className="text-right">30</td>
                </tr>
              </tfoot>
            </table>
          </Sec>

          <Sec id="teoriya" title="І тарау. Жасанды интеллект және математика">
            {r.theory.map((s) => (
              <div key={s.title} className="pt-2">
                <h3 className="font-sans text-lg font-semibold text-ink">{s.title}</h3>
                {s.text.map((t) => (
                  <p key={t} className="mt-2">
                    {t}
                  </p>
                ))}
              </div>
            ))}
          </Sec>

          <Sec id="onim" title="Практикалық өнім">
            <p className="font-semibold text-ink">{r.product.title}</p>
            <p>{r.product.text} Макет бес бөлімнен тұрады:</p>
            <ol className="grid gap-2 sm:grid-cols-5">
              {r.product.parts.map((p, i) => (
                <li key={p} className="surface p-3 text-sm">
                  <span className="block font-serif text-lg font-bold text-brand">{i + 1}</span>
                  <span className="text-ink">{p}</span>
                </li>
              ))}
            </ol>
            <p>Осы веб-платформа макеттің бес бөлімін интерактивті түрде жүзеге асырады.</p>
          </Sec>

          <Sec id="qorytyndy" title="Қорытынды">
            {r.conclusion.map((t) => (
              <p key={t}>{t}</p>
            ))}
            <p className="rounded-lg border-l-4 border-teal bg-teal-soft p-4 font-serif text-lg text-ink">
              Зерттеудің негізгі қорытындысы: {r.mainConclusion}
            </p>
          </Sec>

          <Sec id="usynystar" title="Ұсыныстар">
            <ul className="space-y-2">
              {r.recommendations.map((t) => (
                <li key={t} className="flex gap-3">
                  <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-teal" />
                  {t}
                </li>
              ))}
            </ul>
          </Sec>

          <Sec id="kundelik" title="Ғылыми жобаның зерттеу күнделігі">
            <div className="overflow-x-auto">
              <table className="table-academic min-w-[600px]">
                <thead>
                  <tr>
                    <th>Күні</th>
                    <th>Жұмыс кезеңі</th>
                    <th>Орындалған жұмыс</th>
                  </tr>
                </thead>
                <tbody>
                  {r.diary.map((d) => (
                    <tr key={d.date}>
                      <td className="whitespace-nowrap tabular-nums text-ink">{d.date}</td>
                      <td className="font-medium text-ink">{d.stage}</td>
                      <td>{d.work}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Sec>

          <Sec id="adebiet" title="Пайдаланылған әдебиеттер">
            <ol className="list-decimal space-y-1 pl-6">
              {r.references.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </ol>
          </Sec>
        </article>
      </div>
    </>
  );
}
