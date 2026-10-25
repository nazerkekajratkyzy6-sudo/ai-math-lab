import type { CheckRow } from '../data/types';
import Tex from './Tex';
import { CheckMark } from './Badges';

/** Математикалық тексеру жолдарының тізімі */
export default function CheckRows({ rows }: { rows: CheckRow[] }) {
  return (
    <ol className="divide-y divide-line">
      {rows.map((r, i) => (
        <li key={i} className="grid gap-1 py-3 sm:grid-cols-[minmax(0,15rem)_1fr_auto] sm:items-center sm:gap-4">
          <div className="text-sm text-ink-soft">{r.label}</div>
          <div className="min-w-0 overflow-x-auto text-ink">
            {r.tex && <Tex tex={r.tex} />}
            {r.text && <span className={r.tex ? 'ml-2 text-sm text-ink-soft' : 'text-[15px]'}>{r.text}</span>}
          </div>
          <div className="hidden sm:block">
            <CheckMark ok={r.ok} />
          </div>
          {r.ok !== undefined && (
            <div className="sm:hidden">
              <span className={`text-xs font-semibold ${r.ok ? 'text-ok' : 'text-bad'}`}>
                {r.ok ? '✓ орындалады' : '✗ орындалмайды'}
              </span>
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}
