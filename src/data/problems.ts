import { F, Frac } from '../lib/fraction';
import { evaluate, exprTex } from '../lib/expr';
import type { CheckRow, Problem, Verification } from './types';

/* ------------------------------------------------------------------ */
/*  Көмекші функциялар                                                 */
/* ------------------------------------------------------------------ */

const rel = (a: Frac | number, b: Frac | number) => (Frac.of(a).eq(b) ? '=' : '\\neq');
const t = (x: Frac | number) => Frac.of(x).tex();

/** Арифметикалық есептерді тексеру: әр амал, толық өрнек, кері амал */
function arith(full: string, parts: string[], ai: number, inverse?: { expr: string; back: number }): () => Verification {
  return () => {
    const ref = evaluate(full);
    const steps: CheckRow[] = parts.map((p, i) => ({
      label: parts.length > 1 ? `${i + 1}-амал` : 'Амалды орындау',
      tex: `${exprTex(p)} = ${evaluate(p).tex()}`,
    }));
    if (parts.length > 1) {
      steps.push({
        label: 'Толық өрнек (амалдар ретімен)',
        tex: `${exprTex(full)} = ${ref.tex()}`,
      });
    }
    const aiCheck: CheckRow[] = [
      { label: 'AI жауабын есептелген мәнмен салыстыру', tex: `${ai} ${rel(ai, ref)} ${ref.tex()}`, ok: ref.eq(ai) },
    ];
    if (inverse) {
      const v = evaluate(inverse.expr.replace('AI', String(ai)));
      aiCheck.push({
        label: 'Кері амалмен тексеру',
        tex: `${exprTex(inverse.expr.replace('AI', String(ai)))} = ${v.tex()}`,
        ok: v.eq(inverse.back),
      });
    }
    return { steps, aiCheck, reference: ref.text(), aiSatisfies: aiCheck.every((r) => r.ok) };
  };
}

/* ------------------------------------------------------------------ */
/*  30 есеп — ғылыми жұмыстағы бастапқы деректер                       */
/* ------------------------------------------------------------------ */

export const problems: Problem[] = [
  /* ===================== ҚАРАПАЙЫМ ЕСЕПТЕР ===================== */
  {
    id: 1,
    level: 'simple',
    type: 'Арифметика',
    condition: '348 + 257 = ?',
    sourceSolution: '348 + 257 = 605',
    correctAnswer: '605',
    aiAnswer: '605',
    outcome: 'correct',
    input: { kind: 'number', expected: F(605) },
    verify: arith('348 + 257', ['348 + 257'], 605, { expr: 'AI − 257', back: 348 }),
  },
  {
    id: 2,
    level: 'simple',
    type: 'Арифметика',
    condition: '900 − 467 = ?',
    sourceSolution: '900 − 467 = 433',
    correctAnswer: '433',
    aiAnswer: '433',
    outcome: 'correct',
    input: { kind: 'number', expected: F(433) },
    verify: arith('900 − 467', ['900 − 467'], 433, { expr: 'AI + 467', back: 900 }),
  },
  {
    id: 3,
    level: 'simple',
    type: 'Арифметика',
    condition: '27 × 8 = ?',
    sourceSolution: '27 × 8 = 216',
    correctAnswer: '216',
    aiAnswer: '216',
    outcome: 'correct',
    input: { kind: 'number', expected: F(216) },
    verify: arith('27 × 8', ['27 × 8'], 216, { expr: 'AI : 8', back: 27 }),
  },
  {
    id: 4,
    level: 'simple',
    type: 'Арифметика',
    condition: '144 : 12 = ?',
    sourceSolution: '144 : 12 = 12',
    correctAnswer: '12',
    aiAnswer: '12',
    outcome: 'correct',
    input: { kind: 'number', expected: F(12) },
    verify: arith('144 : 12', ['144 : 12'], 12, { expr: 'AI × 12', back: 144 }),
  },
  {
    id: 5,
    level: 'simple',
    type: 'Арифметика',
    condition: '125 + 375 − 200 = ?',
    sourceSolution: '125 + 375 = 500; 500 − 200 = 300',
    correctAnswer: '300',
    aiAnswer: '300',
    outcome: 'correct',
    input: { kind: 'number', expected: F(300) },
    verify: arith('125 + 375 − 200', ['125 + 375', '500 − 200'], 300, { expr: 'AI + 200 − 375', back: 125 }),
  },
  {
    id: 6,
    level: 'simple',
    type: 'Арифметика',
    condition: '45 × 6 = ?',
    sourceSolution: '45 × 6 = 270',
    correctAnswer: '270',
    aiAnswer: '270',
    outcome: 'correct',
    input: { kind: 'number', expected: F(270) },
    verify: arith('45 × 6', ['45 × 6'], 270, { expr: 'AI : 6', back: 45 }),
  },
  {
    id: 7,
    level: 'simple',
    type: 'Арифметика',
    condition: '720 : 9 = ?',
    sourceSolution: '720 : 9 = 80',
    correctAnswer: '80',
    aiAnswer: '80',
    outcome: 'correct',
    input: { kind: 'number', expected: F(80) },
    verify: arith('720 : 9', ['720 : 9'], 80, { expr: 'AI × 9', back: 720 }),
  },
  {
    id: 8,
    level: 'simple',
    type: 'Арифметика',
    condition: '56 + 78 + 44 = ?',
    sourceSolution: '56 + 78 = 134; 134 + 44 = 178',
    correctAnswer: '178',
    aiAnswer: '178',
    outcome: 'correct',
    input: { kind: 'number', expected: F(178) },
    verify: arith('56 + 78 + 44', ['56 + 78', '134 + 44'], 178, { expr: 'AI − 44 − 78', back: 56 }),
  },
  {
    id: 9,
    level: 'simple',
    type: 'Арифметика',
    condition: '1000 − 375 = ?',
    sourceSolution: '1000 − 375 = 625',
    correctAnswer: '625',
    aiAnswer: '625',
    outcome: 'correct',
    input: { kind: 'number', expected: F(625) },
    verify: arith('1000 − 375', ['1000 − 375'], 625, { expr: 'AI + 375', back: 1000 }),
  },
  {
    id: 10,
    level: 'simple',
    type: 'Арифметика',
    condition: '15 × 4 + 20 = ?',
    sourceSolution: '15 × 4 = 60; 60 + 20 = 80',
    correctAnswer: '80',
    aiAnswer: '80',
    outcome: 'correct',
    input: { kind: 'number', expected: F(80), hint: 'Алдымен көбейту, кейін қосу орындалады.' },
    verify: arith('15 × 4 + 20', ['15 × 4', '60 + 20'], 80, { expr: '(AI − 20) : 4', back: 15 }),
  },

  /* ===================== ОРТАША ДЕҢГЕЙ ===================== */
  {
    id: 11,
    level: 'medium',
    type: 'Пайыз',
    condition:
      'Дәптердің бағасы 240 теңге. Оған 15% жеңілдік жасалды. Оқушы 5 дәптер алды. Барлығы қанша теңге төледі?',
    sourceSolution: '240 × 15 : 100 = 36; 240 − 36 = 204; 204 × 5 = 1020 теңге',
    correctAnswer: '1020 теңге',
    aiAnswer: '1020 теңге',
    outcome: 'correct',
    input: { kind: 'number', unit: 'теңге', expected: F(1020) },
    verify: () => {
      const price = F(240);
      const disc = price.mul(15).div(100);
      const newPrice = price.sub(disc);
      const total = newPrice.mul(5);
      return {
        steps: [
          { label: 'Жеңілдік мөлшері', tex: `240 \\times 15 : 100 = ${t(disc)}\\ \\text{теңге}` },
          { label: 'Бір дәптердің жаңа бағасы', tex: `240 - ${t(disc)} = ${t(newPrice)}\\ \\text{теңге}` },
          { label: '5 дәптердің құны', tex: `${t(newPrice)} \\times 5 = ${t(total)}\\ \\text{теңге}` },
          { label: 'Басқа жолмен: 85% бағамен', tex: `240 \\times 0{,}85 \\times 5 = ${t(price.mul(F(85, 100)).mul(5))}` },
        ],
        aiCheck: [{ label: 'AI жауабы мен есептелген мән', tex: `1020 ${rel(1020, total)} ${t(total)}`, ok: total.eq(1020) }],
        reference: `${total.text()} теңге`,
        aiSatisfies: total.eq(1020),
      };
    },
  },
  {
    id: 12,
    level: 'medium',
    type: 'Пайыз',
    condition: 'Бір санның 25%-ы 18-ге тең. Осы санды тап.',
    sourceSolution: '18 : 0,25 = 72',
    correctAnswer: '72',
    aiAnswer: '72',
    outcome: 'correct',
    input: { kind: 'number', expected: F(72) },
    verify: () => {
      const x = F(18).div(F(25, 100));
      const back = F(72).mul(25).div(100);
      return {
        steps: [
          { label: '25% — санның ширек бөлігі', tex: `25\\% = 0{,}25 = \\frac{1}{4}` },
          { label: 'Бөлігі бойынша бүтінді табу', tex: `18 : 0{,}25 = ${t(x)}` },
        ],
        aiCheck: [
          { label: 'AI жауабының 25%-ын есептеу', tex: `72 \\times 25 : 100 = ${t(back)}`, ok: back.eq(18) },
          { label: 'Шартпен салыстыру', tex: `${t(back)} ${rel(back, 18)} 18`, ok: back.eq(18) },
        ],
        reference: x.text(),
        aiSatisfies: back.eq(18) && x.eq(72),
      };
    },
  },
  {
    id: 13,
    level: 'medium',
    type: 'Геометрия',
    condition: 'Тіктөртбұрыштың периметрі 54 см. Ұзындығы енінен 5 см артық. Ауданын тап.',
    sourceSolution: 'Ені — x; ұзындығы — x + 5; 2(x+x+5)=54; x=11; ұзындығы 16 см; S=16×11=176 см²',
    correctAnswer: '176 см²',
    aiAnswer: '176 см²',
    outcome: 'correct',
    input: { kind: 'number', unit: 'см²', expected: F(176) },
    verify: () => {
      const w = F(54).div(2).sub(5).div(2);
      const l = w.add(5);
      const s = l.mul(w);
      const p = l.add(w).mul(2);
      return {
        steps: [
          { label: 'Белгілеу', tex: `\\text{ені} = x,\\quad \\text{ұзындығы} = x + 5` },
          { label: 'Периметр бойынша теңдеу', tex: `2(x + x + 5) = 54 \\;\\Rightarrow\\; 2x + 5 = 27 \\;\\Rightarrow\\; x = ${t(w)}` },
          { label: 'Ұзындығы', tex: `${t(w)} + 5 = ${t(l)}\\ \\text{см}` },
          { label: 'Аудан', tex: `S = ${t(l)} \\times ${t(w)} = ${t(s)}\\ \\text{см}^2` },
        ],
        aiCheck: [
          { label: 'Периметрді қайта тексеру', tex: `2(${t(l)} + ${t(w)}) = ${t(p)}`, ok: p.eq(54) },
          { label: 'Ұзындық пен ен айырмасы', tex: `${t(l)} - ${t(w)} = ${t(l.sub(w))}`, ok: l.sub(w).eq(5) },
          { label: 'AI жауабы мен аудан', tex: `176 ${rel(176, s)} ${t(s)}`, ok: s.eq(176) },
        ],
        reference: `${s.text()} см²`,
        aiSatisfies: s.eq(176),
      };
    },
  },
  {
    id: 14,
    level: 'medium',
    type: 'Мәтіндік есеп',
    condition:
      'Үш санның қосындысы 96. Бірінші сан екіншісінен 8-ге артық, үшінші сан екіншісінен 4-ке кем. Үш санды тап.',
    sourceSolution:
      'Екінші санды x дейік: x+(x+8)+(x−4)=96; 3x+4=96; x=92/3. Бұл бүтін сан емес. Демек, берілген шарт үш бүтін санды табуға мүмкіндік бермейді.',
    correctAnswer: 'Үш бүтін сан шықпайды',
    aiAnswer: '30, 38, 28. Тексеру кезінде 30 саны 38-ден 8-ге кем, ал шарт бойынша 8-ге артық болуы керек.',
    aiShort: '30, 38, 28',
    outcome: 'wrong',
    input: { kind: 'triple14' },
    model: 'ush-san',
    verify: () => {
      const x = F(96).sub(8).add(4).div(3);
      const a = x.add(8);
      const c = x.sub(4);
      const ai = [30, 38, 28];
      const sum = ai[0] + ai[1] + ai[2];
      return {
        steps: [
          { label: 'Екінші санды x деп белгілейміз', tex: `x + (x + 8) + (x - 4) = 96` },
          { label: 'Ықшамдау', tex: `3x + 4 = 96 \\;\\Rightarrow\\; 3x = 92 \\;\\Rightarrow\\; x = ${t(x)}` },
          { label: 'Бүтін сан ба?', tex: `92 : 3 = 30 \\text{ (қалдық } 2) \\;\\Rightarrow\\; x \\notin \\mathbb{Z}` },
          { label: 'Бөлшек сандар рұқсат етілсе', tex: `${t(a)},\\; ${t(x)},\\; ${t(c)}` },
        ],
        aiCheck: [
          { label: 'Қосынды: a + b + c = 96', tex: `30 + 38 + 28 = ${sum}`, ok: sum === 96 },
          { label: 'Бірінші сан екіншісінен 8-ге артық: a − b = 8', tex: `30 - 38 = ${30 - 38} \\neq 8`, ok: false },
          { label: 'Үшінші сан екіншісінен 4-ке кем: b − c = 4', tex: `38 - 28 = ${38 - 28} \\neq 4`, ok: false },
        ],
        reference: `Бүтін шешім жоқ; бөлшек шешім: ${a.text()}, ${x.text()}, ${c.text()}`,
        aiSatisfies: false,
      };
    },
  },
  {
    id: 15,
    level: 'medium',
    type: 'Мәтіндік есеп',
    condition: 'Автобус 2 сағат бойы 60 км/сағ, кейін 3 сағат бойы 70 км/сағ жылдамдықпен жүрді. Барлығы қанша жол жүрді?',
    sourceSolution: '2×60=120 км; 3×70=210 км; 120+210=330 км',
    correctAnswer: '330 км',
    aiAnswer: '330 км',
    outcome: 'correct',
    input: { kind: 'number', unit: 'км', expected: F(330) },
    verify: () => {
      const s1 = 2 * 60;
      const s2 = 3 * 70;
      const s = s1 + s2;
      return {
        steps: [
          { label: 'Бірінші бөлік: s = v · t', tex: `2 \\times 60 = ${s1}\\ \\text{км}` },
          { label: 'Екінші бөлік', tex: `3 \\times 70 = ${s2}\\ \\text{км}` },
          { label: 'Барлық жол', tex: `${s1} + ${s2} = ${s}\\ \\text{км}` },
        ],
        aiCheck: [{ label: 'AI жауабы мен есептелген жол', tex: `330 ${s === 330 ? '=' : '\\neq'} ${s}`, ok: s === 330 }],
        reference: `${s} км`,
        aiSatisfies: s === 330,
      };
    },
  },
  {
    id: 16,
    level: 'medium',
    type: 'Бөлшек',
    condition: 'Бір жұмысшы жұмысты 6 сағатта, екіншісі 12 сағатта орындайды. Екеуі бірге істесе, жұмысты қанша уақытта аяқтайды?',
    sourceSolution: '1/6 + 1/12 = 3/12 = 1/4. Демек, 4 сағат.',
    correctAnswer: '4 сағат',
    aiAnswer: '4 сағат',
    outcome: 'correct',
    input: { kind: 'number', unit: 'сағат', expected: F(4) },
    verify: () => {
      const r = F(1, 6).add(F(1, 12));
      const time = F(1).div(r);
      const done = F(4, 6).add(F(4, 12));
      return {
        steps: [
          { label: '1 сағаттағы бірлескен өнімділік', tex: `\\frac{1}{6} + \\frac{1}{12} = \\frac{2}{12} + \\frac{1}{12} = \\frac{3}{12} = ${t(r)}` },
          { label: 'Барлық жұмысқа кететін уақыт', tex: `1 : ${t(r)} = ${t(time)}\\ \\text{сағат}` },
        ],
        aiCheck: [
          { label: '4 сағатта орындалатын жұмыс үлесі', tex: `\\frac{4}{6} + \\frac{4}{12} = ${t(done)}`, ok: done.eq(1) },
          { label: 'AI жауабы', tex: `4 ${rel(4, time)} ${t(time)}`, ok: time.eq(4) },
        ],
        reference: `${time.text()} сағат`,
        aiSatisfies: time.eq(4) && done.eq(1),
      };
    },
  },
  {
    id: 17,
    level: 'medium',
    type: 'Бөлшек',
    condition: 'Сынып оқушыларының 3/5 бөлігі қыздар. 12 ұл бар. Барлығы неше оқушы?',
    sourceSolution: 'Ұлдар — 2/5. 12 : 2 × 5 = 30',
    correctAnswer: '30',
    aiAnswer: '30',
    outcome: 'correct',
    input: { kind: 'number', unit: 'оқушы', expected: F(30) },
    verify: () => {
      const boys = F(1).sub(F(3, 5));
      const total = F(12).div(boys);
      const girls = F(30).mul(F(3, 5));
      return {
        steps: [
          { label: 'Ұлдардың үлесі', tex: `1 - \\frac{3}{5} = ${t(boys)}` },
          { label: 'Бөлігі бойынша бүтінді табу', tex: `12 : 2 \\times 5 = ${t(total)}` },
        ],
        aiCheck: [
          { label: 'AI жауабы бойынша қыздар саны', tex: `30 \\times \\frac{3}{5} = ${t(girls)}` },
          { label: 'Қыздар + ұлдар', tex: `${t(girls)} + 12 = ${t(girls.add(12))}`, ok: girls.add(12).eq(30) },
        ],
        reference: total.text(),
        aiSatisfies: total.eq(30),
      };
    },
  },
  {
    id: 18,
    level: 'medium',
    type: 'Бөлшек',
    condition:
      'Кітаптың бірінші күні 1/4 бөлігі оқылды. Екінші күні қалғанының 1/3 бөлігі оқылды. 60 бет оқылмай қалды. Кітапта барлығы қанша бет болған?',
    sourceSolution: 'Қалған бөлік: 3/4×2/3=1/2. Кітаптың жартысы 60 бет: 60×2=120 бет.',
    correctAnswer: '120 бет',
    aiAnswer: '120 бет',
    outcome: 'correct',
    input: { kind: 'number', unit: 'бет', expected: F(120) },
    model: 'bolshekter',
    verify: () => {
      const left = F(3, 4).mul(F(2, 3));
      const total = F(60).div(left);
      const d1 = F(120).div(4);
      const r1 = F(120).sub(d1);
      const d2 = r1.div(3);
      const r2 = r1.sub(d2);
      return {
        steps: [
          { label: '1-күннен кейін қалған үлес', tex: `1 - \\frac{1}{4} = \\frac{3}{4}` },
          { label: '2-күннен кейін қалған үлес', tex: `\\frac{3}{4} \\times \\frac{2}{3} = ${t(left)}` },
          { label: 'Барлық бет', tex: `60 : ${t(left)} = ${t(total)}\\ \\text{бет}` },
        ],
        aiCheck: [
          { label: '1-күні оқылды', tex: `120 : 4 = ${t(d1)};\\; \\text{қалды } ${t(r1)}` },
          { label: '2-күні оқылды', tex: `${t(r1)} : 3 = ${t(d2)};\\; \\text{қалды } ${t(r2)}` },
          { label: 'Оқылмаған беттер шартпен', tex: `${t(r2)} ${rel(r2, 60)} 60`, ok: r2.eq(60) },
        ],
        reference: `${total.text()} бет`,
        aiSatisfies: r2.eq(60),
      };
    },
  },
  {
    id: 19,
    level: 'medium',
    type: 'Мәтіндік есеп',
    condition: 'Әкесі мен баласының жастарының қосындысы 48. Әкесі баласынан 24 жас үлкен. Екеуінің жасы нешеде?',
    sourceSolution: 'Бала — x; әке — x+24; 2x+24=48; x=12; әке=36.',
    correctAnswer: '12 және 36',
    aiAnswer: '12 және 36',
    outcome: 'correct',
    input: { kind: 'numbers', labels: ['Баласының жасы', 'Әкесінің жасы'], expected: [F(12), F(36)] },
    verify: () => {
      const child = (48 - 24) / 2;
      const father = child + 24;
      return {
        steps: [
          { label: 'Теңдеу құру', tex: `x + (x + 24) = 48 \\;\\Rightarrow\\; 2x = 24 \\;\\Rightarrow\\; x = ${child}` },
          { label: 'Әкесінің жасы', tex: `${child} + 24 = ${father}` },
        ],
        aiCheck: [
          { label: 'Қосынды', tex: `12 + 36 = ${12 + 36}`, ok: 12 + 36 === 48 },
          { label: 'Айырма', tex: `36 - 12 = ${36 - 12}`, ok: 36 - 12 === 24 },
        ],
        reference: `${child} және ${father}`,
        aiSatisfies: child === 12 && father === 36,
      };
    },
  },
  {
    id: 20,
    level: 'medium',
    type: 'Пайыз',
    condition: 'Тауар бағасы алдымен 20%-ға өсті, кейін жаңа бағасы 20%-ға төмендеді. Соңғы баға бастапқы бағамен бірдей ме?',
    sourceSolution: '100 теңге деп аламыз: 100→120; 120−24=96. Соңғы баға бастапқы бағамен бірдей емес.',
    correctAnswer: '96 теңге',
    aiAnswer: '96 теңге',
    outcome: 'correct',
    input: {
      kind: 'choice',
      options: [
        'Иә, бірдей: соңғы баға 100 теңге',
        'Жоқ: 100 теңгелік тауар соңында 96 теңге болады',
        'Жоқ: 100 теңгелік тауар соңында 104 теңге болады',
      ],
      expected: 1,
      hint: 'Бастапқы бағаны 100 теңге деп алып, екі өзгерісті ретімен орындаңыз.',
    },
    model: 'payyz',
    verify: () => {
      const up = F(100).mul(F(120, 100));
      const down = up.mul(F(80, 100));
      const k = F(120, 100).mul(F(80, 100));
      return {
        steps: [
          { label: 'Бастапқы баға', tex: `100\\ \\text{теңге}` },
          { label: '20%-ға өсу', tex: `100 + 100 \\times 0{,}2 = ${t(up)}` },
          { label: 'Жаңа бағадан 20%-ға төмендеу', tex: `${t(up)} - ${t(up)} \\times 0{,}2 = ${t(up)} - ${t(up.mul(F(1, 5)))} = ${t(down)}` },
          { label: 'Жалпы коэффициент', tex: `1{,}2 \\times 0{,}8 = ${k.value().toString().replace('.', '{,}')}` },
        ],
        aiCheck: [
          { label: 'AI жауабы мен есептелген соңғы баға', tex: `96 ${rel(96, down)} ${t(down)}`, ok: down.eq(96) },
          { label: 'Бастапқы бағамен салыстыру', tex: `${t(down)} \\neq 100`, ok: !down.eq(100) },
        ],
        reference: `${down.text()} теңге — бірдей емес`,
        aiSatisfies: down.eq(96),
      };
    },
  },

  /* ===================== КҮРДЕЛІ ЖӘНЕ ЛОГИКАЛЫҚ ===================== */
  {
    id: 21,
    level: 'complex',
    type: 'Логика',
    condition:
      'Үш қораптың сыртында «Алма», «Алмұрт», «Алма және алмұрт» деген жазулар бар. Бірақ үш жазудың барлығы қате. Бір ғана жемісті бір қораптан алып көру арқылы барлық қораптың дұрыс атауын анықтауға болады ма?',
    sourceSolution: 'Иә. «Алма және алмұрт» деп жазылған қораптан бір жеміс алу арқылы қалған атауларды логикалық жолмен анықтауға болады.',
    correctAnswer: 'Иә',
    aiAnswer: 'Иә, бір жемісті алу жеткілікті.',
    outcome: 'correct',
    input: {
      kind: 'choice',
      options: [
        'Иә — «Алма және алмұрт» жазуы бар қораптан бір жеміс алу жеткілікті',
        'Иә — «Алма» жазуы бар қораптан бір жеміс алу жеткілікті',
        'Жоқ — бір жеміс арқылы анықтау мүмкін емес',
      ],
      expected: 0,
    },
    model: 'qoraptar',
    verify: () => {
      const r = analyzeBoxes();
      return {
        steps: [
          { label: 'Барлық жазу қате болатын орналасулар саны (алгоритм бойынша)', text: `${r.arrangements.length} орналасу: ${r.arrangements.map((a) => a.join(' / ')).join('; ')}` },
          ...r.byBox.map((b) => ({
            label: `«${b.label}» қорабынан бір жеміс алсақ`,
            text: b.unique ? 'кез келген жеміс орналасуды бірмәнді анықтайды' : 'кейбір жағдайда екі орналасу қалады — анықтау мүмкін емес',
            ok: b.unique,
          })),
        ],
        aiCheck: [
          { label: 'Бір жеміс арқылы анықтауға болатын қорап бар ма?', text: r.possible ? 'Иә: «Алма және алмұрт» қорабы' : 'Жоқ', ok: r.possible },
          { label: 'AI жауабы «Иә»', text: r.possible ? 'алгоритм қорытындысымен сәйкес' : 'сәйкес емес', ok: r.possible },
        ],
        reference: r.possible ? 'Иә' : 'Жоқ',
        aiSatisfies: r.possible,
      };
    },
  },
  {
    id: 22,
    level: 'complex',
    type: 'Геометрия',
    condition: 'Сағат 3:30 кезінде тілдердің арасындағы бұрыш қанша?',
    sourceSolution: 'Минуттық тіл 6-да, сағаттық тіл 3 пен 4 аралығында орналасады. Бұрыш 75°.',
    correctAnswer: '75°',
    aiAnswer: '75°',
    outcome: 'correct',
    input: { kind: 'number', unit: '°', expected: F(75) },
    model: 'sagat',
    verify: () => {
      const { hourDeg, minDeg, angle } = clockAngle(3, 30);
      return {
        steps: [
          { label: 'Минуттық тіл (1 минутта 6°)', tex: `30 \\times 6^\\circ = ${minDeg}^\\circ` },
          { label: 'Сағаттық тіл (1 сағатта 30°, 1 минутта 0,5°)', tex: `3 \\times 30^\\circ + 30 \\times 0{,}5^\\circ = ${hourDeg}^\\circ` },
          { label: 'Тілдер арасындағы кіші бұрыш', tex: `|${minDeg}^\\circ - ${hourDeg}^\\circ| = ${angle}^\\circ` },
        ],
        aiCheck: [{ label: 'AI жауабы', tex: `75^\\circ ${angle === 75 ? '=' : '\\neq'} ${angle}^\\circ`, ok: angle === 75 }],
        reference: `${angle}°`,
        aiSatisfies: angle === 75,
      };
    },
  },
  {
    id: 23,
    level: 'complex',
    type: 'Комбинаторика',
    condition: 'Сыныпта 30 оқушы бар. 18 оқушы футболды, 16 оқушы шахматты ұнатады. Екі ойынды да ұнататындар ең аз дегенде қанша?',
    sourceSolution: '18+16=34; 34−30=4.',
    correctAnswer: '4',
    aiAnswer: '4',
    outcome: 'correct',
    input: { kind: 'number', unit: 'оқушы', expected: F(4) },
    verify: () => {
      // Барлық мүмкін «екеуін де ұнататындар» санын іріктеу
      let min = -1;
      for (let both = 0; both <= 16; both++) {
        const onlyF = 18 - both;
        const onlyC = 16 - both;
        if (onlyF + onlyC + both <= 30) {
          min = both;
          break;
        }
      }
      return {
        steps: [
          { label: 'Ұнатулар саны барлығы', tex: `18 + 16 = 34` },
          { label: 'Оқушылар санынан артығы — екі рет саналғандар', tex: `34 - 30 = ${min}` },
          { label: 'Мысал үлестіру', tex: `${18 - min} + ${16 - min} + ${min} = ${18 - min + 16 - min + min}` },
        ],
        aiCheck: [
          { label: 'Егер екеуін де ұнататындар 3 болса', tex: `15 + 13 + 3 = 31 > 30`, text: 'сыныпта 30 оқушы ғана бар — мүмкін емес' },
          { label: 'AI жауабы 4', tex: `14 + 12 + 4 = 30`, ok: min === 4 },
        ],
        reference: String(min),
        aiSatisfies: min === 4,
      };
    },
  },
  {
    id: 24,
    level: 'complex',
    type: 'Логика',
    condition: 'Бір санды 5-ке бөлгенде қалдық 3, 3-ке бөлгенде қалдық 1. 20-дан кіші ең кіші санды тап.',
    sourceSolution: '5-ке бөлгенде 3 қалдық беретіндер: 3, 8, 13, 18. 13:3=4 қалдық 1. Жауабы 13.',
    correctAnswer: '13',
    aiAnswer: '13',
    outcome: 'correct',
    input: { kind: 'number', expected: F(13) },
    verify: () => {
      const cand: number[] = [];
      for (let n = 0; n < 20; n++) if (n % 5 === 3) cand.push(n);
      const ok = cand.filter((n) => n % 3 === 1);
      return {
        steps: [
          { label: '5-ке бөлгенде 3 қалдық беретін сандар (< 20)', text: cand.join(', ') },
          ...cand.map((n) => ({
            label: `${n} : 3`,
            tex: `${n} = 3 \\times ${Math.floor(n / 3)} + ${n % 3}`,
            ok: n % 3 === 1,
          })),
        ],
        aiCheck: [
          { label: '13 : 5', tex: `13 = 5 \\times 2 + 3`, ok: 13 % 5 === 3 },
          { label: '13 : 3', tex: `13 = 3 \\times 4 + 1`, ok: 13 % 3 === 1 },
          { label: 'Ең кіші ме?', text: `шартқа сай сандар: ${ok.join(', ')}`, ok: ok[0] === 13 },
        ],
        reference: String(ok[0]),
        aiSatisfies: ok[0] === 13,
      };
    },
  },
  {
    id: 25,
    level: 'complex',
    type: 'Логика',
    condition:
      '10 тиынның 3-еуі елтаңбасы жоғары қарап жатыр. Көзіңді жұмып, оларды екі топқа бөліп, екі топтағы жоғары қарап тұрған тиындар санын теңестіру керек.',
    sourceSolution: 'Үш тиынды жеке топқа бөліп, сол үш тиынды түгел аудару арқылы екі топтағы жоғары қарап тұрған тиындар санын теңестіруге болады.',
    correctAnswer: 'Үш тиынды аудару',
    aiAnswer: 'Үш тиынды бөліп алып, аудару керек.',
    outcome: 'correct',
    input: {
      kind: 'choice',
      options: [
        'Кез келген 3 тиынды бөлек топқа алып, үшеуін де аудару',
        'Тиындарды 5 және 5 етіп бөлу',
        'Кез келген 3 тиынды бөлек топқа алып, ешқайсысын аудармау',
      ],
      expected: 0,
    },
    model: 'tiyndar',
    verify: () => {
      const r = simulateCoins();
      return {
        steps: [
          { label: 'А тобы: 3 тиын, ішінде k елтаңба жоғары', tex: `k \\in \\{0, 1, 2, 3\\}` },
          { label: 'Б тобы: 7 тиын', tex: `3 - k \\ \\text{елтаңба жоғары}` },
          { label: 'А тобын түгел аударғаннан кейін', tex: `3 - k \\ \\text{елтаңба жоғары}` },
          { label: 'Нәтиже', tex: `3 - k = 3 - k` },
        ],
        aiCheck: [
          {
            label: 'Барлық орналасуларды компьютерлік тексеру',
            text: `${r.total} жағдайдың ${r.equal}-інде топтар теңесті`,
            ok: r.equal === r.total,
          },
        ],
        reference: 'Үш тиынды бөліп, түгел аудару',
        aiSatisfies: r.equal === r.total,
      };
    },
  },
  {
    id: 26,
    level: 'complex',
    type: 'Геометрия',
    condition: 'Қабырғасы 10 см квадраттың төрт бұрышынан қабырғасы 2 см төрт квадрат қиылды. Қалған аудан қанша?',
    sourceSolution: '10×10=100 см²; 4×(2×2)=16 см²; 100−16=84 см².',
    correctAnswer: '84 см²',
    aiAnswer: '84 см²',
    outcome: 'correct',
    input: { kind: 'number', unit: 'см²', expected: F(84) },
    model: 'figura',
    verify: () => {
      const big = 10 * 10;
      const cut = 4 * 2 * 2;
      const rest = big - cut;
      // Басқа тәсіл: «крест» пішінін тіктөртбұрыштарға бөлу
      const cross = 10 * 6 + 2 * (2 * 6);
      return {
        steps: [
          { label: 'Квадрат ауданы', tex: `10 \\times 10 = ${big}\\ \\text{см}^2` },
          { label: 'Қиылған бөліктер', tex: `4 \\times (2 \\times 2) = ${cut}\\ \\text{см}^2` },
          { label: 'Қалған аудан', tex: `${big} - ${cut} = ${rest}\\ \\text{см}^2` },
        ],
        aiCheck: [
          { label: 'Басқа тәсіл: пішінді тіктөртбұрыштарға бөлу', tex: `10 \\times 6 + 2 \\times (2 \\times 6) = ${cross}`, ok: cross === 84 },
          { label: 'AI жауабы', tex: `84 ${rest === 84 ? '=' : '\\neq'} ${rest}`, ok: rest === 84 },
        ],
        reference: `${rest} см²`,
        aiSatisfies: rest === 84,
      };
    },
  },
  {
    id: 27,
    level: 'complex',
    type: 'Геометрия',
    condition: 'Бөлменің ұзындығы 6 м, ені 4 м. Қабырғасы 50 см квадрат плиткамен еден төселеді. Қанша плитка керек?',
    sourceSolution: '50 см=0,5 м; бөлме 24 м²; бір плитка 0,25 м²; 24:0,25=96.',
    correctAnswer: '96 плитка',
    aiAnswer: '96 плитка',
    outcome: 'correct',
    input: { kind: 'number', unit: 'плитка', expected: F(96) },
    verify: () => {
      const room = F(6).mul(4);
      const tile = F(1, 2).mul(F(1, 2));
      const n = room.div(tile);
      const rows = F(6).div(F(1, 2));
      const cols = F(4).div(F(1, 2));
      return {
        steps: [
          { label: 'Бірлікті ауыстыру', tex: `50\\ \\text{см} = 0{,}5\\ \\text{м}` },
          { label: 'Бөлме ауданы', tex: `6 \\times 4 = ${t(room)}\\ \\text{м}^2` },
          { label: 'Бір плитка ауданы', tex: `0{,}5 \\times 0{,}5 = 0{,}25\\ \\text{м}^2` },
          { label: 'Плиткалар саны', tex: `${t(room)} : 0{,}25 = ${t(n)}` },
        ],
        aiCheck: [
          { label: 'Қатар бойынша санау', tex: `(6 : 0{,}5) \\times (4 : 0{,}5) = ${t(rows)} \\times ${t(cols)} = ${t(rows.mul(cols))}`, ok: rows.mul(cols).eq(96) },
          { label: 'AI жауабы', tex: `96 ${rel(96, n)} ${t(n)}`, ok: n.eq(96) },
        ],
        reference: `${n.text()} плитка`,
        aiSatisfies: n.eq(96),
      };
    },
  },
  {
    id: 28,
    level: 'complex',
    type: 'Мәтіндік есеп',
    condition: 'Бір санның жартысына 10 қоссақ, 25 болады. Сан қандай?',
    sourceSolution: 'x/2+10=25; x/2=15; x=30.',
    correctAnswer: '30',
    aiAnswer: '30',
    outcome: 'correct',
    input: { kind: 'number', expected: F(30) },
    verify: () => {
      const half = 25 - 10;
      const x = half * 2;
      return {
        steps: [
          { label: 'Теңдеу', tex: `\\frac{x}{2} + 10 = 25` },
          { label: 'Кері амал', tex: `\\frac{x}{2} = 25 - 10 = ${half}` },
          { label: 'Сан', tex: `x = ${half} \\times 2 = ${x}` },
        ],
        aiCheck: [{ label: 'AI жауабын шартқа қою', tex: `30 : 2 + 10 = ${30 / 2 + 10}`, ok: 30 / 2 + 10 === 25 }],
        reference: String(x),
        aiSatisfies: x === 30,
      };
    },
  },
  {
    id: 29,
    level: 'complex',
    type: 'Логика',
    condition: 'Үш ағайындының әрқайсысында екі қарындасы бар. Отбасында барлығы неше бала?',
    sourceSolution: 'Екі қарындас үш ағайындыға ортақ болуы мүмкін. 3+2=5 бала.',
    correctAnswer: '5',
    aiAnswer: '5',
    outcome: 'correct',
    input: { kind: 'number', unit: 'бала', expected: F(5), hint: 'Қарындастар әр ағайындыға жеке ме, әлде ортақ па?' },
    verify: () => {
      // Отбасын модельдеу: 3 ұл + g қыз; әр ұлдың қарындастары — отбасындағы барлық қыздар
      let girls = -1;
      for (let g = 0; g <= 10 && girls < 0; g++) {
        const family = [...Array(3).fill('ұл'), ...Array(g).fill('қыз')] as string[];
        const sistersOfEachBoy = family.filter((_, i) => family[i] === 'ұл').map(() => family.filter((x) => x === 'қыз').length);
        if (sistersOfEachBoy.every((n) => n === 2)) girls = g;
      }
      const total = 3 + girls;
      return {
        steps: [
          { label: 'Ұлдар саны', tex: `3` },
          { label: 'Әр ұлдың қарындастары — отбасындағы барлық қыздар', tex: `\\text{қыздар} = 2` },
          { label: 'Балалар саны', tex: `3 + ${girls} = ${total}` },
        ],
        aiCheck: [
          { label: 'Әр ұл үшін қарындастар санын тексеру', text: `әр ағайындыда ${girls} қарындас бар`, ok: girls === 2 },
          { label: 'Жиі кездесетін қате жол', tex: `3 + 3 \\times 2 = 9`, text: 'бұл жағдайда әр ағайындыда 6 қарындас болар еді — шартқа қайшы' },
          { label: 'AI жауабы', tex: `5 ${total === 5 ? '=' : '\\neq'} ${total}`, ok: total === 5 },
        ],
        reference: String(total),
        aiSatisfies: total === 5,
      };
    },
  },
  {
    id: 30,
    level: 'complex',
    type: 'Комбинаторика',
    condition: '20 оқушының әрқайсысы бір-бірімен бір реттен қол алысты. Барлығы неше қол алысу болды?',
    sourceSolution: '19+18+...+1 = 19×20:2 = 190.',
    correctAnswer: '190',
    aiAnswer: '190',
    outcome: 'correct',
    input: { kind: 'number', expected: F(190) },
    model: 'qol-alysu',
    verify: () => {
      let pairs = 0;
      for (let i = 0; i < 20; i++) for (let j = i + 1; j < 20; j++) pairs++;
      const formula = (20 * 19) / 2;
      return {
        steps: [
          { label: 'Әр жаңа оқушы алдыңғылармен ғана қол алысады', tex: `19 + 18 + \\dots + 1` },
          { label: 'Формула', tex: `\\frac{n(n-1)}{2} = \\frac{20 \\times 19}{2} = ${formula}` },
        ],
        aiCheck: [
          { label: 'Барлық жұптарды компьютермен санау', text: `${pairs} жұп`, ok: pairs === 190 },
          { label: 'AI жауабы', tex: `190 ${formula === 190 ? '=' : '\\neq'} ${formula}`, ok: formula === 190 },
        ],
        reference: String(pairs),
        aiSatisfies: pairs === 190,
      };
    },
  },
];

/* ------------------------------------------------------------------ */
/*  Логикалық есептерге арналған алгоритмдер                           */
/* ------------------------------------------------------------------ */

export type Fruit = 'Алма' | 'Алмұрт' | 'Алма және алмұрт';
export const BOX_LABELS: Fruit[] = ['Алма', 'Алмұрт', 'Алма және алмұрт'];

function permutations<T>(arr: T[]): T[][] {
  if (arr.length <= 1) return [arr];
  return arr.flatMap((x, i) => permutations([...arr.slice(0, i), ...arr.slice(i + 1)]).map((p) => [x, ...p]));
}

/** №21: барлық жазу қате болатын орналасуларды табу және әр қораптан алудың нәтижесін талдау */
export function analyzeBoxes() {
  const arrangements = permutations(BOX_LABELS).filter((p) => p.every((c, i) => c !== BOX_LABELS[i]));
  const fruitsOf = (c: Fruit) => (c === 'Алма және алмұрт' ? ['алма', 'алмұрт'] : [c === 'Алма' ? 'алма' : 'алмұрт']);
  const byBox = BOX_LABELS.map((label, i) => {
    const groups = new Map<string, number>();
    arrangements.forEach((a) => fruitsOf(a[i]).forEach((f) => groups.set(f, (groups.get(f) ?? 0) + 1)));
    const unique = [...groups.values()].every((n) => n === 1);
    return { label, index: i, unique };
  });
  return { arrangements, byBox, possible: byBox.some((b) => b.unique) };
}

/** №25: 10 тиынның 3-еуі жоғары қарап тұрған барлық C(10,3) орналасуын тексеру */
export function simulateCoins() {
  let total = 0;
  let equal = 0;
  for (let a = 0; a < 10; a++)
    for (let b = a + 1; b < 10; b++)
      for (let c = b + 1; c < 10; c++) {
        const coins = Array.from({ length: 10 }, (_, i) => i === a || i === b || i === c);
        // А тобы — алғашқы 3 тиын (көзді жұмып алынған кез келген 3 тиын), оларды түгел аударамыз
        const groupA = coins.slice(0, 3).map((up) => !up);
        const groupB = coins.slice(3);
        const headsA = groupA.filter(Boolean).length;
        const headsB = groupB.filter(Boolean).length;
        total++;
        if (headsA === headsB) equal++;
      }
  return { total, equal };
}

/** №22: сағат тілдерінің бұрышы */
export function clockAngle(h: number, m: number) {
  const minDeg = m * 6;
  const hourDeg = (h % 12) * 30 + m * 0.5;
  let diff = Math.abs(minDeg - hourDeg) % 360;
  if (diff > 180) diff = 360 - diff;
  return { hourDeg, minDeg, angle: Math.round(diff * 100) / 100 };
}

export const levelName: Record<Problem['level'], string> = {
  simple: 'Қарапайым',
  medium: 'Орташа',
  complex: 'Күрделі/логикалық',
};

export const getProblem = (id: number) => problems.find((p) => p.id === id);
