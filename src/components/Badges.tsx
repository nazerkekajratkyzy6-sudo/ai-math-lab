import type { Level, Outcome } from '../data/types';
import { levelName } from '../data/problems';

export function OutcomeBadge({ outcome, size = 'md' }: { outcome: Outcome; size?: 'sm' | 'md' }) {
  const ok = outcome === 'correct';
  const pad = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-semibold ${pad} ${
        ok ? 'bg-ok-soft text-ok' : 'bg-bad-soft text-bad'
      }`}
    >
      <span aria-hidden="true">{ok ? '✓' : '✗'}</span>
      {ok ? 'Дұрыс' : 'Қате'}
    </span>
  );
}

const levelStyle: Record<Level, string> = {
  simple: 'bg-brand-soft text-brand',
  medium: 'bg-teal-soft text-teal',
  complex: 'bg-[#efeafb] text-[#5b3fb0]',
};

export function LevelBadge({ level }: { level: Level }) {
  return (
    <span className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-semibold ${levelStyle[level]}`}>
      {levelName[level]}
    </span>
  );
}

export function TypeTag({ type }: { type: string }) {
  return (
    <span className="inline-flex rounded-full border border-line px-2.5 py-0.5 text-xs font-medium text-ink-soft">
      {type}
    </span>
  );
}

export function CheckMark({ ok }: { ok?: boolean }) {
  if (ok === undefined) return <span aria-hidden="true" className="inline-block h-5 w-5" />;
  return (
    <span
      role="img"
      aria-label={ok ? 'орындалады' : 'орындалмайды'}
      className={`inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
        ok ? 'bg-ok text-white' : 'bg-bad text-white'
      }`}
    >
      {ok ? '✓' : '✗'}
    </span>
  );
}
