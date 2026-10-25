import type { ReactNode } from 'react';

export default function PageHeader({ eyebrow, title, children }: { eyebrow?: string; title: string; children?: ReactNode }) {
  return (
    <header className="border-b border-line bg-gradient-to-b from-surface to-white">
      <div className="container-page py-10 sm:py-14">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">{title}</h1>
        {children && <div className="mt-4 max-w-3xl text-[17px] text-ink-soft">{children}</div>}
      </div>
    </header>
  );
}
