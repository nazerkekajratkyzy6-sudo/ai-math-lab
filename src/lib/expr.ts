import { Frac, F } from './fraction';

/**
 * Арифметикалық өрнекті есептеу: +, −, ×, :, жақшалар.
 * Амалдардың орындалу ретін (алдымен көбейту/бөлу) сақтайды.
 */
type Tok = { t: 'num'; v: number } | { t: 'op'; v: string } | { t: 'par'; v: '(' | ')' };

function tokenize(src: string): Tok[] {
  const s = src.replace(/−/g, '-').replace(/[×·*]/g, '*').replace(/[:÷/]/g, '/');
  const out: Tok[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i];
    if (c === ' ') {
      i++;
      continue;
    }
    if (/\d/.test(c)) {
      let j = i;
      while (j < s.length && /[\d.,]/.test(s[j])) j++;
      out.push({ t: 'num', v: parseFloat(s.slice(i, j).replace(',', '.')) });
      i = j;
      continue;
    }
    if ('+-*/'.includes(c)) out.push({ t: 'op', v: c });
    else if (c === '(' || c === ')') out.push({ t: 'par', v: c });
    else throw new Error(`Белгісіз таңба: ${c}`);
    i++;
  }
  return out;
}

export function evaluate(src: string): Frac {
  const toks = tokenize(src);
  let p = 0;
  const peek = () => toks[p];
  const factor = (): Frac => {
    const t = toks[p++];
    if (!t) throw new Error('Өрнек толық емес');
    if (t.t === 'num') return F(t.v);
    if (t.t === 'op' && t.v === '-') return factor().mul(-1);
    if (t.t === 'par' && t.v === '(') {
      const v = expr();
      p++; // ')'
      return v;
    }
    throw new Error('Өрнек қате');
  };
  const term = (): Frac => {
    let v = factor();
    while (peek() && peek().t === 'op' && (peek().v === '*' || peek().v === '/')) {
      const op = toks[p++].v;
      const r = factor();
      v = op === '*' ? v.mul(r) : v.div(r);
    }
    return v;
  };
  const expr = (): Frac => {
    let v = term();
    while (peek() && peek().t === 'op' && (peek().v === '+' || peek().v === '-')) {
      const op = toks[p++].v;
      const r = term();
      v = op === '+' ? v.add(r) : v.sub(r);
    }
    return v;
  };
  return expr();
}

/** Өрнекті KaTeX форматына келтіру */
export function exprTex(src: string): string {
  return src
    .replace(/−/g, '-')
    .replace(/×/g, '\\times ')
    .replace(/\s:\s/g, ' : ')
    .replace(/÷/g, '\\div ');
}
