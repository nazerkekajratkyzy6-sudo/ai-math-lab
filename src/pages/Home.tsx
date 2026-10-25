import { Link } from 'react-router-dom';
import { research } from '../data/research';
import { stats } from '../lib/stats';
import { problems } from '../data/problems';
import { OutcomeBadge } from '../components/Badges';
import { EXPERIMENTS } from '../data/experiments';

const SECTIONS = [
  { to: '/esepter', title: '30 есеп – 30 тәжірибе', text: 'Әр есептің бастапқы шарты, AI жауабы, өз тексеруің және математикалық негіздеу.' },
  { to: '/qate', title: 'ЖИ қатесін тап', text: 'Зерттеудегі жалғыз қате жауап — №14 есептің шарттарын жеке тексеру.' },
  { to: '/modelder', title: 'Математикалық модельдер', text: 'Сағат, аудан, пайыз, қол алысу, қораптар, тиындар, бөлшектер және үш сан.' },
  { to: '/statistika', title: 'Зерттеу нәтижелері', text: 'Деңгейлер бойынша кесте мен диаграммалар: 10/10, 9/10, 10/10.' },
  { to: '/zertteu-esebi', title: 'PDF зерттеу есебі', text: 'Бастапқы деректер негізінде A4 форматындағы PDF есепті жүктеу.' },
  { to: '/joba-turaly', title: 'Жоба туралы', text: 'Тақырып, мақсат, болжам, әдістеме, күнделік және қорытынды.' },
];

const FLOW = ['Есепті ұсыну', 'AI жауабын алу', 'Шешімді тексеру', 'Нәтижені салыстыру'];

export default function Home() {
  return (
    <>
      <section className="border-b border-line bg-gradient-to-b from-surface via-white to-white">
        <div className="container-page grid gap-10 py-12 sm:py-16 lg:grid-cols-[1.25fr_1fr] lg:items-center">
          <div>
            <p className="eyebrow mb-4">«Зерде» республикалық конкурсы · {research.section}</p>
            <h1 className="text-[32px] font-bold leading-[1.15] sm:text-[44px]">«{research.topic}»</h1>
            <p className="mt-5 max-w-2xl text-[17px] text-ink-soft">
              <span className="font-semibold text-ink">Зерттеу мақсаты:</span> {research.goal}
            </p>
            <p className="mt-3 text-sm text-ink-mute">
              Автор: {research.author}, {research.grade} · Ғылыми жетекшісі: {research.supervisor}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/esepter" className="btn-primary px-5 py-3 text-[15px]">
                30 есепті тексеру
              </Link>
              <Link to="/qate" className="btn-secondary px-5 py-3 text-[15px]">
                №14 қатені талдау
              </Link>
            </div>
          </div>

          <div className="card p-6 shadow-[0_1px_2px_rgba(15,29,51,.04),0_12px_32px_-12px_rgba(15,29,51,.12)]">
            <p className="text-sm font-medium text-ink-soft">Зерттеуде тіркелген көрсеткіштер</p>
            <div className="mt-3 flex items-end gap-6">
              <div>
                <div className="font-serif text-5xl font-bold tabular-nums text-brand">{stats.percent}</div>
                <div className="text-sm text-ink-soft">жалпы дұрыстық</div>
              </div>
              <div className="pb-1">
                <div className="font-serif text-3xl font-bold tabular-nums text-ink">
                  {stats.correct}/{stats.total}
                </div>
                <div className="text-sm text-ink-soft">дұрыс жауап</div>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {stats.byLevel.map((l) => (
                <div key={l.level}>
                  <div className="flex justify-between text-sm">
                    <span className="text-ink-soft">{l.name}</span>
                    <span className="font-semibold tabular-nums text-ink">
                      {l.correct}/{l.total} · {l.percent}
                    </span>
                  </div>
                  <div className="mt-1 h-2 rounded-full bg-surface">
                    <div className="h-2 rounded-full bg-teal" style={{ width: `${l.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 grid grid-cols-10 gap-1" aria-label="30 есептің нәтижесі">
              {problems.map((p) => (
                <Link
                  key={p.id}
                  to={`/esepter/${p.id}`}
                  title={`№${p.id}: ${p.outcome === 'correct' ? 'дұрыс' : 'қате'}`}
                  aria-label={`№${p.id} есеп: ${p.outcome === 'correct' ? 'дұрыс' : 'қате'}`}
                  className={`flex aspect-square items-center justify-center rounded text-[10px] font-semibold transition-transform hover:scale-110 ${
                    p.outcome === 'correct' ? 'bg-ok-soft text-ok' : 'bg-bad text-white'
                  }`}
                >
                  {p.id}
                </Link>
              ))}
            </div>
            <p className="mt-4 text-xs text-ink-mute">Көрсеткіштер тек осы зерттеуге енгізілген 30 есепке қатысты және AI-дың жалпы дәлдігін білдірмейді.</p>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow mb-3">Әдістеме</p>
            <h2 className="text-2xl font-bold sm:text-3xl">Зерттеу қалай жүргізілді</h2>
            <p className="mt-4 text-[16px] text-ink-soft">{research.organization}</p>
            <div className="mt-6 flex flex-wrap items-center gap-2 font-serif text-xl text-ink">
              {stats.byLevel.map((l, i) => (
                <span key={l.level} className="flex items-center gap-2">
                  <span className="rounded-md bg-surface px-3 py-1 tabular-nums">{l.total}</span>
                  <span className="text-ink-mute">{i < 2 ? '+' : '='}</span>
                </span>
              ))}
              <span className="rounded-md bg-brand px-3 py-1 tabular-nums text-white">{stats.total}</span>
            </div>
            <ul className="mt-6 space-y-2 text-[15px]">
              {EXPERIMENTS.map((ex) => (
                <li key={ex.n} className="flex gap-3">
                  <span className="shrink-0 font-semibold text-teal">{ex.title}.</span>
                  <span className="text-ink">{ex.question}</span>
                </li>
              ))}
            </ul>
          </div>
          <ol className="grid gap-3 sm:grid-cols-2">
            {FLOW.map((f, i) => (
              <li key={f} className="card flex gap-4 p-5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-soft font-semibold text-brand">{i + 1}</span>
                <div>
                  <div className="font-semibold text-ink">{f}</div>
                  <div className="mt-1 text-sm text-ink-soft">
                    {
                      [
                        'Әр деңгейдегі есеп жасанды интеллектке бірдей нұсқаумен берілді.',
                        'AI жауабы тіркеу кестесіне өзгеріссіз жазылды.',
                        'Жауап математикалық шешіммен және есеп шартымен тексерілді.',
                        'Нәтиже «дұрыс» немесе «қате» деп белгіленіп, пайызбен есептелді.',
                      ][i]
                    }
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="border-y border-line bg-surface">
        <div className="container-page py-14">
          <p className="eyebrow mb-3">Платформа бөлімдері</p>
          <h2 className="text-2xl font-bold sm:text-3xl">AI математикалық зертханасы</h2>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {SECTIONS.map((s) => (
              <Link key={s.to} to={s.to} className="card group p-6 transition-colors hover:border-brand">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-sans text-lg font-semibold text-ink group-hover:text-brand">{s.title}</h3>
                  <span aria-hidden="true" className="text-ink-mute transition-transform group-hover:translate-x-1 group-hover:text-brand">
                    →
                  </span>
                </div>
                <p className="mt-2 text-[15px] text-ink-soft">{s.text}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="card border-bad/30 p-6">
            <div className="flex items-center justify-between gap-3">
              <p className="eyebrow text-bad">Жалғыз қате</p>
              <OutcomeBadge outcome="wrong" />
            </div>
            <h3 className="mt-3 text-xl font-bold">№14. Үш сан</h3>
            <p className="mt-2 text-[15px] text-ink-soft">{problems[13].condition}</p>
            <p className="mt-3 text-[15px] text-ink">
              AI жауабы: <strong>30, 38, 28</strong>. Қосындысы 96, бірақ 30 саны 38-ден 8-ге кем.
            </p>
            <Link to="/qate" className="btn-ghost -ml-4 mt-3">
              Шарттарды тексеру →
            </Link>
          </div>
          <blockquote className="flex flex-col justify-center border-l-4 border-teal pl-6">
            <p className="eyebrow mb-3">Зерттеудің негізгі қорытындысы</p>
            <p className="font-serif text-2xl leading-snug text-ink">«{research.mainConclusion}»</p>
            <footer className="mt-4 text-sm text-ink-mute">— {research.author}</footer>
          </blockquote>
        </div>
      </section>
    </>
  );
}
