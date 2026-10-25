import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, HashRouter } from 'react-router-dom';
import '@fontsource/noto-sans/latin-400.css';
import '@fontsource/noto-sans/latin-ext-400.css';
import '@fontsource/noto-sans/cyrillic-400.css';
import '@fontsource/noto-sans/cyrillic-ext-400.css';
import '@fontsource/noto-sans/latin-500.css';
import '@fontsource/noto-sans/latin-ext-500.css';
import '@fontsource/noto-sans/cyrillic-500.css';
import '@fontsource/noto-sans/cyrillic-ext-500.css';
import '@fontsource/noto-sans/latin-600.css';
import '@fontsource/noto-sans/latin-ext-600.css';
import '@fontsource/noto-sans/cyrillic-600.css';
import '@fontsource/noto-sans/cyrillic-ext-600.css';
import '@fontsource/noto-sans/latin-700.css';
import '@fontsource/noto-sans/latin-ext-700.css';
import '@fontsource/noto-sans/cyrillic-700.css';
import '@fontsource/noto-sans/cyrillic-ext-700.css';
import '@fontsource/noto-serif/latin-600.css';
import '@fontsource/noto-serif/latin-ext-600.css';
import '@fontsource/noto-serif/cyrillic-600.css';
import '@fontsource/noto-serif/cyrillic-ext-600.css';
import '@fontsource/noto-serif/latin-700.css';
import '@fontsource/noto-serif/latin-ext-700.css';
import '@fontsource/noto-serif/cyrillic-700.css';
import '@fontsource/noto-serif/cyrillic-ext-700.css';
import 'katex/dist/katex.min.css';
import './index.css';
import App from './App';

// Әдепкі: BrowserRouter (Vercel). VITE_HASH_ROUTER=1 болса — бір беттік хостингке арналған HashRouter.
const Router = import.meta.env.VITE_HASH_ROUTER === '1' ? HashRouter : BrowserRouter;

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>,
);
