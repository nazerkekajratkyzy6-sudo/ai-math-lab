import { useEffect, useState, type ReactNode } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { research } from '../data/research';

export const NAV = [
  { to: '/', label: 'Басты бет', end: true },
  { to: '/esepter', label: '30 есеп – 30 тәжірибе' },
  { to: '/qate', label: 'ЖИ қатесін тап' },
  { to: '/modelder', label: 'Математикалық модельдер' },
  { to: '/statistika', label: 'Зерттеу нәтижелері' },
  { to: '/zertteu-esebi', label: 'PDF зерттеу есебі' },
  { to: '/joba-turaly', label: 'Жоба туралы' },
];

function Logo() {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="AI MATH LAB — басты бет">
      <svg viewBox="0 0 32 32" className="h-9 w-9" aria-hidden="true">
        <rect width="32" height="32" rx="8" fill="#1f4fbf" />
        <path d="M8 22 L13 10 L18 22 M10 18 H16" stroke="#fff" strokeWidth="2.4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="23" cy="13" r="2.2" fill="#5fd3cf" />
        <path d="M21 21 h4" stroke="#5fd3cf" strokeWidth="2.4" strokeLinecap="round" />
      </svg>
      <span className="leading-tight">
        <span className="block font-serif text-[17px] font-bold tracking-tight text-ink">AI MATH LAB</span>
        <span className="block text-[11px] font-medium text-ink-mute">AI математикалық зертханасы</span>
      </span>
    </Link>
  );
}

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    setOpen(false);
    window.scrollTo({ top: 0 });
  }, [pathname]);

  const linkCls = ({ isActive }: { isActive: boolean }) =>
    `block whitespace-nowrap rounded-md px-2 py-1.5 text-[13px] xl:px-3 xl:text-[14px] font-medium transition-colors ${
      isActive ? 'bg-brand-soft text-brand' : 'text-ink-soft hover:bg-surface hover:text-ink'
    }`;

  return (
    <div className="flex min-h-screen flex-col">
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:px-4 focus:py-2 focus:shadow">
        Негізгі мазмұнға өту
      </a>
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="container-page flex h-16 items-center justify-between gap-4">
          <Logo />
          <p className="hidden text-right text-xs leading-snug text-ink-mute lg:block">
            «Зерде» республикалық конкурсы
            <br />
            Математика және қолданбалы математика
          </p>
          <button
            type="button"
            className="btn-secondary lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
              {open ? (
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
            Мәзір
          </button>
        </div>
        <nav aria-label="Негізгі навигация" className="hidden border-t border-line lg:block">
          <ul className="container-page flex items-center justify-between gap-1 py-1.5">
            {NAV.map((n) => (
              <li key={n.to}>
                <NavLink to={n.to} end={n.end} className={linkCls}>
                  {n.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
        {open && (
          <nav id="mobile-nav" aria-label="Мобильді навигация" className="border-t border-line bg-white lg:hidden">
            <ul className="container-page grid gap-1 py-3 sm:grid-cols-2">
              {NAV.map((n) => (
                <li key={n.to}>
                  <NavLink to={n.to} end={n.end} className={({ isActive }) => `${linkCls({ isActive })} block text-[15px]`}>
                    {n.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </header>

      <main id="main" className="flex-1">
        {children}
      </main>

      <footer className="mt-16 border-t border-line bg-surface">
        <div className="container-page grid gap-6 py-10 text-sm text-ink-soft md:grid-cols-[1.4fr_1fr]">
          <div>
            <p className="font-serif text-base font-semibold text-ink">«{research.topic}»</p>
            <p className="mt-2">
              Ғылыми жоба авторы: {research.author}, {research.grade} оқушысы, {research.school}.
            </p>
            <p>Ғылыми жетекшісі: {research.supervisor}, {research.supervisorRole}.</p>
          </div>
          <div className="md:text-right">
            <p>{research.contest}</p>
            <p className="mt-2">Платформадағы барлық көрсеткіштер тек зерттеуге енгізілген 30 есепке қатысты.</p>
            <p className="mt-2 text-ink-mute">{research.cityYear}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
