import { lazy, Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import Home from './pages/Home';
import Problems from './pages/Problems';
import ProblemDetail from './pages/ProblemDetail';
const ErrorAnalysis = lazy(() => import('./pages/ErrorAnalysis'));
const Models = lazy(() => import('./pages/Models'));
const ModelPage = lazy(() => import('./pages/ModelPage'));
const Stats = lazy(() => import('./pages/Stats'));
const Report = lazy(() => import('./pages/Report'));
const About = lazy(() => import('./pages/About'));
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Layout>
      <Suspense fallback={<div className="container-page py-24 text-center text-ink-mute">Жүктелуде…</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/esepter" element={<Problems />} />
        <Route path="/esepter/:id" element={<ProblemDetail />} />
        <Route path="/qate" element={<ErrorAnalysis />} />
        <Route path="/modelder" element={<Models />} />
        <Route path="/modelder/:slug" element={<ModelPage />} />
        <Route path="/statistika" element={<Stats />} />
        <Route path="/zertteu-esebi" element={<Report />} />
        <Route path="/joba-turaly" element={<About />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      </Suspense>
    </Layout>
  );
}
