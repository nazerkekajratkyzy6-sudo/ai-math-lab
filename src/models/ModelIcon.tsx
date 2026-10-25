/** Модельдердің шағын белгішелері */
export default function ModelIcon({ slug }: { slug: string }) {
  const common = { width: 26, height: 26, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const, 'aria-hidden': true };
  switch (slug) {
    case 'sagat':
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="9" />
          <path d="M12 12V6.5M12 12l3.5 5" />
        </svg>
      );
    case 'figura':
      return (
        <svg {...common}>
          <path d="M7 3h10v4h4v10h-4v4H7v-4H3V7h4z" />
        </svg>
      );
    case 'payyz':
      return (
        <svg {...common}>
          <path d="M5 19L19 5" />
          <circle cx="7" cy="7" r="2.2" />
          <circle cx="17" cy="17" r="2.2" />
        </svg>
      );
    case 'qol-alysu':
      return (
        <svg {...common}>
          <circle cx="12" cy="4.5" r="1.8" />
          <circle cx="4.5" cy="17" r="1.8" />
          <circle cx="19.5" cy="17" r="1.8" />
          <path d="M11 6.2L5.5 15.3M13 6.2l5.5 9.1M6.3 17h11.4" />
        </svg>
      );
    case 'qoraptar':
      return (
        <svg {...common}>
          <rect x="2.5" y="9" width="5.5" height="9" rx="1" />
          <rect x="9.25" y="9" width="5.5" height="9" rx="1" />
          <rect x="16" y="9" width="5.5" height="9" rx="1" />
          <path d="M5.25 6v1.5M12 6v1.5M18.75 6v1.5" />
        </svg>
      );
    case 'tiyndar':
      return (
        <svg {...common}>
          <ellipse cx="9" cy="12" rx="6" ry="6" />
          <path d="M17 6.5a6 6 0 010 11" />
          <path d="M9 9v6" />
        </svg>
      );
    case 'bolshekter':
      return (
        <svg {...common}>
          <rect x="3" y="7" width="18" height="10" rx="1.5" />
          <path d="M7.5 7v10M12 7v10M16.5 7v10" />
        </svg>
      );
    default:
      return (
        <svg {...common}>
          <path d="M4 7h4M6 5v4M15 7h5M4 17h4M15 15.5h5M15 18.5h5" />
          <path d="M10 12h4" />
        </svg>
      );
  }
}
