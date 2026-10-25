import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import { stats } from '../lib/stats';

const CONTENTS = [
  'Титул: жоба тақырыбы, автор, ғылыми жетекші, мектеп',
  'Негізгі көрсеткіштер: 30 есеп, 29 дұрыс, 1 қате, 96,7%, 3,3%',
  '1. Зерттеудің мақсаты, сұрағы және болжамы',
  '2. Зерттеу әдістемесі',
  '3. Үш тәжірибе: зерттеу сұрағы, нәтиже және қорытынды',
  '4. Деңгейлер бойынша кесте және екі диаграмма',
  '5. AI жауаптарын тіркеу кестесі — 30 есептің шарты мен нәтижесі',
  '6. №14 есептің талдауы: әр шартты жеке тексеру',
  '7. Ғылыми жұмыстың қорытындысы мен ұсыныстары',
];

type State = 'idle' | 'building' | 'ready' | 'error';

export default function Report() {
  const [state, setState] = useState<State>('idle');
  const [url, setUrl] = useState<string | null>(null);
  const [err, setErr] = useState('');

  useEffect(() => () => {
    if (url) URL.revokeObjectURL(url);
  }, [url]);

  const build = async (mode: 'download' | 'preview') => {
    setState('building');
    setErr('');
    try {
      const { buildReport, REPORT_FILENAME } = await import('../lib/pdf');
      const doc = await buildReport();
      if (mode === 'download') {
        doc.save(REPORT_FILENAME);
      }
      const blob = doc.output('blob');
      if (url) URL.revokeObjectURL(url);
      setUrl(URL.createObjectURL(blob));
      setState('ready');
    } catch (e) {
      setErr(e instanceof Error ? e.message : 'Белгісіз қате');
      setState('error');
    }
  };

  return (
    <>
      <PageHeader eyebrow="Есеп" title="PDF зерттеу есебі">
        A4 форматындағы есеп тек ғылыми жұмыстағы бастапқы деректерден құрылады: 30 есеп, тіркелген AI жауаптары, деңгейлер бойынша нәтиже және
        қорытынды.
      </PageHeader>

      <div className="container-page grid gap-8 py-10 lg:grid-cols-[1fr_1.2fr]">
        <div className="space-y-6">
          <div className="card p-6">
            <h2 className="font-sans text-lg font-semibold text-ink">Есептің мазмұны</h2>
            <ol className="mt-4 space-y-2.5">
              {CONTENTS.map((c) => (
                <li key={c} className="flex gap-3 text-[15px] text-ink-soft">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-brand" />
                  {c}
                </li>
              ))}
            </ol>
            <div className="mt-6 flex flex-wrap gap-2">
              <button className="btn-primary px-5 py-3" onClick={() => build('download')} disabled={state === 'building'}>
                <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                  <path d="M12 4v11m0 0l-4.5-4.5M12 15l4.5-4.5M5 19h14" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                PDF жүктеп алу
              </button>
              <button className="btn-secondary px-5 py-3" onClick={() => build('preview')} disabled={state === 'building'}>
                Алдын ала қарау
              </button>
            </div>
            <p className="mt-3 min-h-[1.5rem] text-sm" role="status" aria-live="polite">
              {state === 'building' && <span className="text-ink-mute">PDF дайындалуда…</span>}
              {state === 'ready' && <span className="text-ok">✓ PDF дайын.</span>}
              {state === 'error' && <span className="text-bad">PDF жасау мүмкін болмады: {err}</span>}
            </p>
          </div>
          <div className="surface p-5 text-sm text-ink-soft">
            Есептегі көрсеткіштер платформадағы статистикамен бірдей көзден алынады: {stats.correct}/{stats.total} дұрыс, жалпы дұрыстық{' '}
            {stats.percent}. Қазақ әріптері PDF ішіне енгізілген қаріппен беріледі.
          </div>
        </div>

        <div className="card flex min-h-[520px] flex-col overflow-hidden">
          <div className="border-b border-line bg-surface px-4 py-2.5 text-sm font-medium text-ink-soft">Алдын ала қарау</div>
          {url ? (
            <>
              <iframe title="PDF есептің алдын ала көрінісі" src={url} className="h-[640px] w-full flex-1 bg-white" />
              <a href={url} target="_blank" rel="noopener" className="border-t border-line px-4 py-2.5 text-sm font-semibold text-brand hover:underline">
                PDF-ті жаңа бетте ашу
              </a>
            </>
          ) : (
            <div className="flex flex-1 items-center justify-center p-8 text-center text-ink-mute">
              «Алдын ала қарау» батырмасын басқанда есептің беттері осында көрсетіледі.
            </div>
          )}
        </div>
      </div>
    </>
  );
}
