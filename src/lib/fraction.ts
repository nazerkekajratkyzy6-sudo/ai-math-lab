// Дәл рационал сандар арифметикасы (бөлшектерді жуықтамай есептеу үшін)
const gcd = (a: number, b: number): number => {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b) [a, b] = [b, a % b];
  return a || 1;
};

export class Frac {
  readonly n: number;
  readonly d: number;
  constructor(n: number, d = 1) {
    if (d === 0) throw new Error('Нөлге бөлу');
    // ондық бөлшекті бүтін санға келтіру
    let scale = 1;
    while (!Number.isInteger(n * scale) || !Number.isInteger(d * scale)) {
      scale *= 10;
      if (scale > 1e9) break;
    }
    n = Math.round(n * scale);
    d = Math.round(d * scale);
    const s = d < 0 ? -1 : 1;
    const g = gcd(n, d);
    this.n = (s * n) / g;
    this.d = (s * d) / g;
  }
  static of(x: number | Frac): Frac {
    return x instanceof Frac ? x : new Frac(x);
  }
  add(o: number | Frac) {
    const b = Frac.of(o);
    return new Frac(this.n * b.d + b.n * this.d, this.d * b.d);
  }
  sub(o: number | Frac) {
    const b = Frac.of(o);
    return new Frac(this.n * b.d - b.n * this.d, this.d * b.d);
  }
  mul(o: number | Frac) {
    const b = Frac.of(o);
    return new Frac(this.n * b.n, this.d * b.d);
  }
  div(o: number | Frac) {
    const b = Frac.of(o);
    return new Frac(this.n * b.d, this.d * b.n);
  }
  eq(o: number | Frac) {
    const b = Frac.of(o);
    return this.n === b.n && this.d === b.d;
  }
  isInt() {
    return this.d === 1;
  }
  value() {
    return this.n / this.d;
  }
  tex() {
    if (this.d === 1) return String(this.n);
    const sign = this.n < 0 ? '-' : '';
    return `${sign}\\frac{${Math.abs(this.n)}}{${this.d}}`;
  }
  text() {
    return this.d === 1 ? String(this.n) : `${this.n}/${this.d}`;
  }
}

export const F = (n: number, d = 1) => new Frac(n, d);

/** Пайдаланушы енгізген мәтінді санға айналдыру: «12», «12,5», «116/3», «−8» */
export function parseUserNumber(raw: string): Frac | null {
  const s = raw
    .trim()
    .replace(/\s+/g, '')
    .replace(/[−–—]/g, '-')
    .replace(',', '.');
  if (!s) return null;
  const m = s.match(/^(-?\d+(?:\.\d+)?)(?:\/(-?\d+(?:\.\d+)?))?$/);
  if (!m) return null;
  const a = parseFloat(m[1]);
  const b = m[2] !== undefined ? parseFloat(m[2]) : 1;
  if (!isFinite(a) || !isFinite(b) || b === 0) return null;
  return new Frac(a, b);
}

/** Санды қазақша жазу дәстүрімен көрсету (ондық үтір) */
export function fmt(x: number, digits = 1): string {
  if (Number.isInteger(x)) return String(x);
  return x.toFixed(digits).replace('.', ',');
}
