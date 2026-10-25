import { Link } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Tex from '../components/Tex';
import { CheckMark, OutcomeBadge } from '../components/Badges';
import TripleChecker, { checkTriple } from '../models/TripleChecker';
import { getProblem } from '../data/problems';
import { research } from '../data/research';
import { F } from '../lib/fraction';

function permutations(a: number[]): number[][] {
  if (a.length <= 1) return [a];
  return a.flatMap((x, i) => permutations([...a.slice(0, i), ...a.slice(i + 1)]).map((p) => [x, ...p]));
}

export default function ErrorAnalysis() {
  const p = getProblem(14)!;
  const ai = checkTriple(F(30), F(38), F(28));
  const perms = permutations([30, 38, 28]).map((q) => ({ q, r: checkTriple(F(q[0]), F(q[1]), F(q[2])) }));
  const frac = checkTriple(F(116, 3), F(92, 3), F(80, 3));

  const rows = [
    { cond: 'Үш санның қосындысы 96', formula: 'a + b + c = 96', calc: '30 + 38 + 28 = 96', ok: ai.sumOk },
    { cond: 'Бірінші сан екіншісінен 8-ге артық', formula: 'a - b = 8', calc: '30 - 38 = -8', ok: ai.diff1Ok },
    { cond: 'Үшінші сан екіншісінен 4-ке кем', formula: 'b - c = 4', calc: '38 - 28 = 10', ok: ai.diff2Ok },
  ];

  return (
    <>
      <PageHeader eyebrow="ЖИ қатесін тап" title="№14 есеп: AI жауабы неге қате?">
        Зерттеудегі 30 есептің ішінде жалғыз қате жауап осы есепте тіркелді. AI ұсынған сандардың қосындысы дұрыс, бірақ шарттың басқа бөліктері
        орындалмайды.
      </PageHeader>

      <div className="container-page space-y-12 py-10">
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="card p-6">
            <p className="eyebrow mb-2">Есеп шарты</p>
            <p className="font-serif text-xl leading-relaxed text-ink">{p.condition}</p>
          </div>
          <div className="card border-bad/40 p-6">
            <div className="mb-2 flex items-center justify-between gap-3">
              <p className="eyebrow">Зерттеуде тіркелген AI жауабы</p>
              <OutcomeBadge outcome="wrong" />
            </div>
            <p className="font-serif text-3xl font-bold tabular-nums text-ink">30, 38, 28</p>
            <p className="mt-3 text-[15px] text-ink-soft">{p.aiAnswer}</p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">1. Әр шартты жеке тексеру</h2>
          <p className="mt-2 max-w-3xl text-ink-soft">Белгілеу: a — бірінші сан, b — екінші сан, c — үшінші сан. AI жауабы бойынша a = 30, b = 38, c = 28.</p>
          <div className="mt-5 overflow-x-auto">
            <table className="table-academic min-w-[640px]">
              <thead>
                <tr>
                  <th>Шарт</th>
                  <th>Математикалық жазылуы</th>
                  <th>AI жауабымен тексеру</th>
                  <th className="text-center">Нәтиже</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.cond} className={r.ok ? '' : 'bg-bad-soft/50'}>
                    <td className="font-medium text-ink">{r.cond}</td>
                    <td>
                      <Tex tex={r.formula} />
                    </td>
                    <td>
                      <Tex tex={r.calc} />
                    </td>
                    <td className="text-center">
                      <span className={`inline-flex items-center gap-1.5 text-sm font-semibold ${r.ok ? 'text-ok' : 'text-bad'}`}>
                        <CheckMark ok={r.ok} /> {r.ok ? 'орындалады' : 'бұзылды'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 max-w-3xl text-[15px] text-ink-soft">
            Ғылыми жұмыста 2-шарттың бұзылғаны көрсетілген: 30 саны 38-ден 8-ге кем. Жеке тексеру тағы бір бұзушылықты көрсетеді: 38 − 28 = 10, ал шарт
            бойынша айырма 4 болуы керек. Яғни AI жауабы үш шарттың тек біреуін ғана орындайды.
          </p>
        </section>

        <section className="surface p-6">
          <h3 className="font-sans text-lg font-semibold text-ink">Сандардың ретін ауыстырсақ ше?</h3>
          <p className="mt-1 text-[15px] text-ink-soft">
            AI сандарды басқа ретпен ойлаған болуы мүмкін. Барлық 6 ретті компьютер тексерді — ешбірі үш шартты бірдей қанағаттандырмайды.
          </p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {perms.map(({ q, r }) => {
              const all = r.sumOk && r.diff1Ok && r.diff2Ok;
              return (
                <div key={q.join()} className="flex items-center justify-between rounded-lg border border-line bg-white px-4 py-2.5 text-sm">
                  <span className="font-semibold tabular-nums text-ink">
                    a = {q[0]}, b = {q[1]}, c = {q[2]}
                  </span>
                  <span className={all ? 'text-ok' : 'text-bad'}>{all ? 'сәйкес' : `${[r.sumOk, r.diff1Ok, r.diff2Ok].filter(Boolean).length}/3 шарт`}</span>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold">2. Өзің тексеріп көр</h2>
          <p className="mt-2 max-w-3xl text-ink-soft">Кез келген үш санды енгізіңіз. Қосынды мен екі айырма жеке-жеке тексеріледі.</p>
          <div className="card mt-5 p-5 sm:p-6">
            <TripleChecker />
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-2">
          <div>
            <h2 className="text-2xl font-bold">3. Теңдеу арқылы шешу</h2>
            <div className="card mt-5 space-y-3 p-6 text-[16px]">
              <Tex tex={`\\text{Екінші сан: } x`} />
              <Tex tex={`x + (x + 8) + (x - 4) = 96`} />
              <Tex tex={`3x + 4 = 96`} />
              <Tex tex={`3x = 92 \\;\\Rightarrow\\; x = \\frac{92}{3} = 30\\frac{2}{3}`} />
              <p className="border-t border-line pt-3 text-[15px] text-ink-soft">
                92 саны 3-ке қалдықсыз бөлінбейді (92 = 3 × 30 + 2). Сондықтан екінші сан бүтін бола алмайды, ал онымен бірге бірінші және үшінші сандар да
                бүтін болмайды.
              </p>
            </div>
          </div>
          <div>
            <h2 className="text-2xl font-bold">4. Бүтін сан туралы ескерту</h2>
            <div className="card mt-5 space-y-4 p-6">
              <p className="text-[15px] text-ink">
                Есептің бастапқы шартында сандардың <strong>бүтін</strong> болуы талап етілмеген. Сондықтан «шешім мүлдем жоқ» деп айтуға болмайды. Бөлшек
                сандар рұқсат етілсе, шешім бар:
              </p>
              <div className="rounded-lg bg-teal-soft p-4 text-center">
                <Tex tex={`a = \\frac{116}{3},\\quad b = \\frac{92}{3},\\quad c = \\frac{80}{3}`} block />
              </div>
              <ul className="space-y-1.5 text-[15px]">
                <li className="flex items-center gap-2">
                  <CheckMark ok={frac.sumOk} /> <Tex tex={`\\frac{116}{3} + \\frac{92}{3} + \\frac{80}{3} = \\frac{288}{3} = 96`} />
                </li>
                <li className="flex items-center gap-2">
                  <CheckMark ok={frac.diff1Ok} /> <Tex tex={`\\frac{116}{3} - \\frac{92}{3} = \\frac{24}{3} = 8`} />
                </li>
                <li className="flex items-center gap-2">
                  <CheckMark ok={frac.diff2Ok} /> <Tex tex={`\\frac{92}{3} - \\frac{80}{3} = \\frac{12}{3} = 4`} />
                </li>
              </ul>
              <p className="text-[15px] text-ink-soft">
                Ғылыми жұмыстағы «үш бүтін сан шықпайды» деген тұжырым дұрыс. Ал AI жауабы бүтін сандар болса да, бөлшек сандар болса да шартты орындамайды.
                Сондықтан зерттеудің тіркелген нәтижесі өзгермейді: <strong className="text-bad">AI жауабы — қате</strong>.
              </p>
            </div>
          </div>
        </section>

        <section className="grid gap-8 lg:grid-cols-[1.3fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold">Ғылыми жұмыстағы қатені талдау</h2>
            <div className="mt-4 space-y-3 text-[16px] text-ink-soft">
              {research.errorAnalysis.map((t) => (
                <p key={t}>{t}</p>
              ))}
            </div>
          </div>
          <div className="surface p-6">
            <p className="eyebrow mb-3">Бұл мысалдан шығатын сабақ</p>
            <ul className="space-y-2 text-[15px] text-ink">
              {research.recommendations.slice(2, 5).map((r) => (
                <li key={r} className="flex gap-2">
                  <span className="text-teal">—</span>
                  {r}
                </li>
              ))}
            </ul>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link to="/esepter/14" className="btn-secondary">
                №14 сценарийі
              </Link>
              <Link to="/modelder/ush-san" className="btn-ghost">
                «Үш сан» моделі →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
