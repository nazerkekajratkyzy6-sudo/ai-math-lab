import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container-page py-24 text-center">
      <p className="font-serif text-6xl font-bold text-brand">404</p>
      <h1 className="mt-4 text-2xl font-bold">Бет табылмады</h1>
      <p className="mt-2 text-ink-soft">Сілтеме қате болуы мүмкін. Басты бетке оралыңыз.</p>
      <Link to="/" className="btn-primary mt-6">
        Басты бет
      </Link>
    </div>
  );
}
