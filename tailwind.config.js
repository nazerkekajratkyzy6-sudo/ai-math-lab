/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Noto Sans"', 'system-ui', 'sans-serif'],
        serif: ['"Noto Serif"', 'Georgia', 'serif'],
      },
      colors: {
        ink: { DEFAULT: '#0f1d33', soft: '#33435c', mute: '#5b6b82' },
        line: '#dfe5ee',
        surface: '#f5f7fa',
        brand: { DEFAULT: '#1f4fbf', dark: '#173c91', soft: '#e8eefb' },
        teal: { DEFAULT: '#0e7c7b', soft: '#e3f3f2' },
        ok: { DEFAULT: '#177245', soft: '#e6f4ec' },
        bad: { DEFAULT: '#b42318', soft: '#fdecea' },
      },
      maxWidth: { page: '1160px' },
    },
  },
  plugins: [],
};
