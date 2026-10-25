import { Link } from 'react-router-dom';
import { Bar, BarChart, CartesianGrid, Cell, LabelList, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PageHeader from '../components/PageHeader';
import Tex from '../components/Tex';
import { OutcomeBadge } from '../components/Badges';
import { problems, levelName } from '../data/problems';
import { research } from '../data/research';
import { stats, pct } from '../lib/stats';
import { EXPERIMENTS } from '../data/experiments';

const CHART = { correct: '#1f4fbf', wrong: '#d9480f', grid: '#e6ebf2', axis: '#5b6b82' };

const tooltipStyle = {
  contentStyle: { borderRadius: 8, border: '1px solid #dfe5ee', fontSize: 13, fontFamily: 'Noto Sans, sans-serif' },
  cursor: { fill: 'rgba(31,79,191,0.06)' },
};

export default function Stats() {
  const levelData = stats.byLevel.map((l) => ({ name: l.name, Дұрыс: l.correct, Қате: l.wrong, pct: l.value, label: `${l.correct}/${l.total}` }));
  const pie = [
    { name: 'Дұрыс', value: stats.correct },
    { name: 'Қате', value: stats.wrong },
  ];

  return (
    <>
      <PageHeader eyebrow="Нәтижелер" title="Зерттеу нәтижелері">
        Барлық кесте мен диаграмма 30 есептің бір ғана деректер жиынынан автоматты түрде есептеледі.
      </PageHeader>

      <div className="container-page space-y-12 py-10">
        <section className="grid gap-3 sm:grid-cols-3 lg:grid-cols-5">
          {[
            { k: 'Барлық есеп', v: String(stats.total) },
            { k: 'Дұрыс жауап', v: String(stats.correct) },
            { k: 'Қате жауап', v: String(stats.wrong) },
            { k: 'Жалпы дұрыстық', v: stats.percent, accent: true },
            { k: 'Қате үлесі', v: stats.wrongPercent },
          ].map((x) => (
            <div key={x.k} className={`card p-5 ${x.accent ? 'border-brand bg-brand-soft' : ''}`}>
              <div className="text-sm text-ink-soft">{x.k}</div>
              <div className={`mt-1 font-serif text-4xl font-bold tabular-nums ${x.accent ? 'text-brand' : 'text-ink'}`}>{x.v}</div>
            </div>
          ))}
        </section>

        <section>
          <h2 className="text-2xl font-bold">Үш тәжірибенің нәтижесі</h2>
          <div className="mt-5 grid gap-4 lg:grid-cols-3">
            {EXPERIMENTS.map((ex) => {
              const all = problems.filter((p) => p.id >= ex.ids[0] && p.id <= ex.ids[1]);
              const ok = all.filter((p) => p.outcome === 'correct').length;
              return (
                <article key={ex.n} className="card flex flex-col p-5">
                  <p className="eyebrow">
                    {ex.title} · №{ex.ids[0]}–{ex.ids[1]}
                  </p>
                  <h3 className="mt-1 font-sans text-lg font-semibold text-ink">{ex.question}</h3>
                  <div className="mt-3 flex items-baseline gap-2">
                    <span className="font-serif text-3xl font-bold tabular-nums text-brand">
                      {ok}/{all.length}
                    </span>
                    <span className="text-sm text-ink-soft">дұрыс · {pct(ok, all.length)}</span>
                  </div>
                  <div className="mt-3 grid grid-cols-10 gap-1">
                    {all.map((p) => (
                      <Link
                        key={p.id}
                        to={`/esepter/${p.id}`}
                        aria-label={`№${p.id}: ${p.outcome === 'correct' ? 'дұрыс' : 'қате'}`}
                        className={`flex aspect-square items-center justify-center rounded text-[10px] font-semibold ${
                          p.outcome === 'correct' ? 'bg-brand-soft text-brand' : 'bg-[#d9480f] text-white'
                        }`}
                      >
                        {p.id}
                      </Link>
                    ))}
                  </div>
                  <p className="mt-4 text-sm text-ink-soft">
                    <span className="font-semibold text-ink">Тексеру: </span>
                    {ex.check}
                  </p>
                  <p className="mt-3 flex-1 rounded-lg bg-surface p-3 text-sm text-ink">
                    <span className="font-semibold">Қорытынды: </span>
                    {ex.conclusion}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <figure className="card min-w-0 p-5">
            <figcaption className="mb-1 font-semibold text-ink">Деңгейлер бойынша дұрыс және қате жауаптар</figcaption>
            <p className="mb-4 text-sm text-ink-mute">Әр деңгейде 10 есептен</p>
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={levelData} margin={{ top: 22, right: 8, left: -18, bottom: 0 }} barCategoryGap="32%">
                  <CartesianGrid vertical={false} stroke={CHART.grid} />
                  <XAxis dataKey="name" tick={{ fill: CHART.axis, fontSize: 12 }} axisLine={{ stroke: '#a9b5c6' }} tickLine={false} />
                  <YAxis domain={[0, 10]} ticks={[0, 2, 4, 6, 8, 10]} tick={{ fill: CHART.axis, fontSize: 12 }} axisLine={false} tickLine={false} allowDecimals={false} />
                  <Tooltip {...tooltipStyle} />
                  <Legend wrapperStyle={{ fontSize: 13 }} iconType="square" />
                  <Bar dataKey="Дұрыс" stackId="a" fill={CHART.correct} stroke="#fff" strokeWidth={2} />
                  <Bar dataKey="Қате" stackId="a" fill={CHART.wrong} stroke="#fff" strokeWidth={2} radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="label" position="top" offset={8} fill="#0f1d33" fontSize={13} fontWeight={600} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </figure>

          <figure className="card min-w-0 p-5">
            <figcaption className="mb-1 font-semibold text-ink">Жалпы нәтиже</figcaption>
            <p className="mb-2 text-sm text-ink-mute">
              {stats.correct}/{stats.total} дұрыс
            </p>
            <div className="relative h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pie} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="88%" startAngle={90} endAngle={-270} stroke="#fff" strokeWidth={2}>
                    <Cell fill={CHART.correct} />
                    <Cell fill={CHART.wrong} />
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
              <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-serif text-3xl font-bold tabular-nums text-ink">{stats.percent}</span>
                <span className="text-xs text-ink-mute">дұрыстық</span>
              </div>
            </div>
            <ul className="mt-2 flex justify-center gap-5 text-sm text-ink-soft">
              <li className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm" style={{ background: CHART.correct }} /> Дұрыс — {stats.correct}
              </li>
              <li className="flex items-center gap-1.5">
                <span className="h-3 w-3 rounded-sm" style={{ background: CHART.wrong }} /> Қате — {stats.wrong}
              </li>
            </ul>
          </figure>
        </section>

        <section className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <div className="min-w-0">
            <h2 className="text-2xl font-bold">Деңгейлер бойынша нәтиже</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="table-academic min-w-[520px]">
                <thead>
                  <tr>
                    <th>Деңгей</th>
                    <th className="text-right">Есеп саны</th>
                    <th className="text-right">Дұрыс</th>
                    <th className="text-right">Қате</th>
                    <th className="text-right">Дұрыстық</th>
                  </tr>
                </thead>
                <tbody>
                  {stats.byLevel.map((l) => (
                    <tr key={l.level}>
                      <td>{l.name}</td>
                      <td className="text-right tabular-nums">{l.total}</td>
                      <td className="text-right tabular-nums">{l.correct}</td>
                      <td className="text-right tabular-nums">{l.wrong}</td>
                      <td className="text-right font-semibold tabular-nums">{l.percent}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td>Барлығы</td>
                    <td className="text-right tabular-nums">{stats.total}</td>
                    <td className="text-right tabular-nums">{stats.correct}</td>
                    <td className="text-right tabular-nums">{stats.wrong}</td>
                    <td className="text-right tabular-nums">{stats.percent}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
          <div className="surface p-5">
            <p className="eyebrow mb-3">Пайыздық есептеу</p>
            <div className="space-y-2 text-[15px]">
              {stats.byLevel.map((l) => (
                <div key={l.level}>
                  <span className="text-sm text-ink-mute">{l.name}</span>
                  <Tex tex={`${l.correct} \\div ${l.total} \\times 100\\% = ${l.percent.replace('%', '\\%').replace(',', '{,}')}`} block />
                </div>
              ))}
              <div className="border-t border-line pt-2">
                <span className="text-sm text-ink-mute">Жалпы дұрыстық</span>
                <Tex tex={`${stats.correct} \\div ${stats.total} \\times 100\\% \\approx ${stats.percent.replace('%', '\\%').replace(',', '{,}')}`} block />
                <span className="text-sm text-ink-mute">Қате үлесі</span>
                <Tex tex={`${stats.wrong} \\div ${stats.total} \\times 100\\% \\approx ${stats.wrongPercent.replace('%', '\\%').replace(',', '{,}')}`} block />
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">AI жауаптарын тіркеу кестесі</h2>
          <p className="mt-2 text-ink-soft">Ғылыми жұмыстың 3-қосымшасы бойынша. Есеп нөмірін басып, тексеру сценарийін ашыңыз.</p>
          <div className="mt-4 overflow-x-auto">
            <table className="table-academic min-w-[760px]">
              <thead>
                <tr>
                  <th>№</th>
                  <th>Деңгей</th>
                  <th>Түрі</th>
                  <th>Дұрыс жауап</th>
                  <th>AI жауабы</th>
                  <th>Нәтиже</th>
                </tr>
              </thead>
              <tbody>
                {problems.map((p) => (
                  <tr key={p.id} className={p.outcome === 'wrong' ? 'bg-bad-soft/50' : ''}>
                    <td>
                      <Link to={`/esepter/${p.id}`} className="font-semibold text-brand hover:underline">
                        {p.id}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap text-ink-soft">{levelName[p.level]}</td>
                    <td className="whitespace-nowrap text-ink-soft">{p.type}</td>
                    <td>{p.correctAnswer}</td>
                    <td className="max-w-[320px]">{p.aiAnswer}</td>
                    <td>
                      <OutcomeBadge outcome={p.outcome} size="sm" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold">Нәтижені талдау</h2>
            <div className="mt-4 space-y-3 text-[16px] text-ink-soft">
              {research.analysis.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </div>
          <div className="surface self-start p-5">
            <p className="eyebrow mb-2">Болжаммен салыстыру</p>
            <p className="text-[15px] text-ink-soft">
              <strong className="text-ink">Болжам:</strong> {research.hypothesis}
            </p>
            <p className="mt-3 text-[15px] text-ink-soft">
              <strong className="text-ink">Нәтиже:</strong> күрделі және логикалық есептерде дұрыстық {stats.byLevel[2].percent}, жалғыз қате орташа деңгейде (№
              {stats.wrongIds.join(', ')}). Болжам осы 30 есеп көлемінде толық расталмады.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
