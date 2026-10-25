import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { problems, levelName } from '../data/problems';
import { research as r } from '../data/research';
import { stats } from './stats';
import { EXPERIMENTS } from '../data/experiments';

/* PDF есеп тек бастапқы 30 жазба мен ғылыми жұмыс мәтіндерінен құрылады. */

const FONT = 'DejaVu';
const BLUE: [number, number, number] = [31, 79, 191];
const ORANGE: [number, number, number] = [217, 72, 15];
const INK: [number, number, number] = [15, 29, 51];
const SOFT: [number, number, number] = [51, 67, 92];
const MUTE: [number, number, number] = [91, 107, 130];
const LINE: [number, number, number] = [210, 218, 230];

const M = 18; // жиек, мм
const W = 210;
const H = 297;
const CW = W - 2 * M;

async function loadFont(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Қаріп жүктелмеді: ${url}`);
  const buf = new Uint8Array(await res.arrayBuffer());
  let bin = '';
  const chunk = 0x8000;
  for (let i = 0; i < buf.length; i += chunk) bin += String.fromCharCode(...buf.subarray(i, i + chunk));
  return btoa(bin);
}

export async function buildReport(): Promise<jsPDF> {
  const [regular, bold] = await Promise.all([loadFont(`${import.meta.env.BASE_URL}fonts/DejaVuSans.ttf`), loadFont(`${import.meta.env.BASE_URL}fonts/DejaVuSans-Bold.ttf`)]);
  const doc = new jsPDF({ unit: 'mm', format: 'a4', compress: true });
  doc.addFileToVFS('DejaVuSans.ttf', regular);
  doc.addFont('DejaVuSans.ttf', FONT, 'normal');
  doc.addFileToVFS('DejaVuSans-Bold.ttf', bold);
  doc.addFont('DejaVuSans-Bold.ttf', FONT, 'bold');
  doc.setFont(FONT, 'normal');
  doc.setProperties({
    title: `AI MATH LAB — ${r.topic}`,
    subject: 'Зерттеу есебі',
    author: r.author,
    keywords: r.keywords,
    creator: 'AI MATH LAB',
  });

  let y = M;

  const ensure = (h: number) => {
    if (y + h > H - 20) {
      doc.addPage();
      y = M + 4;
    }
  };

  /** Сөздер бойынша нақты ені өлшеніп тасымалданады */
  const wrap = (text: string, maxW: number): string[] => {
    const words = text.split(/\s+/);
    const lines: string[] = [];
    let cur = '';
    for (const w of words) {
      const test = cur ? `${cur} ${w}` : w;
      if (doc.getTextWidth(test) <= maxW || !cur) cur = test;
      else {
        lines.push(cur);
        cur = w;
      }
    }
    if (cur) lines.push(cur);
    return lines;
  };

  const para = (text: string, opts: { size?: number; color?: [number, number, number]; bold?: boolean; gap?: number; indent?: number } = {}) => {
    const size = opts.size ?? 10.5;
    doc.setFont(FONT, opts.bold ? 'bold' : 'normal');
    doc.setFontSize(size);
    doc.setTextColor(...(opts.color ?? SOFT));
    const lines = wrap(text, CW - (opts.indent ?? 0));
    const lh = size * 0.5;
    for (const ln of lines) {
      ensure(lh);
      doc.text(ln, M + (opts.indent ?? 0), y + lh * 0.8);
      y += lh;
    }
    y += opts.gap ?? 2.5;
  };

  const heading = (text: string) => {
    ensure(18);
    y += 3;
    doc.setFont(FONT, 'bold');
    doc.setFontSize(13);
    doc.setTextColor(...INK);
    doc.text(text, M, y + 5);
    y += 8;
    doc.setDrawColor(...BLUE);
    doc.setLineWidth(0.6);
    doc.line(M, y, M + 18, y);
    y += 4;
  };

  const tableBase = {
    styles: { font: FONT, fontSize: 9, cellPadding: 2, textColor: INK, lineColor: LINE, lineWidth: 0.2 },
    headStyles: { font: FONT, fontStyle: 'bold' as const, fillColor: [232, 238, 251] as [number, number, number], textColor: INK },
    footStyles: { font: FONT, fontStyle: 'bold' as const, fillColor: [245, 247, 250] as [number, number, number], textColor: INK },
    margin: { left: M, right: M, top: M + 4, bottom: 22 },
    theme: 'grid' as const,
  };
  const afterTable = () => {
    y = ((doc as unknown as { lastAutoTable: { finalY: number } }).lastAutoTable.finalY ?? y) + 6;
  };

  /* ---------- Титул ---------- */
  doc.setFillColor(...BLUE);
  doc.rect(0, 0, W, 4, 'F');
  y = 16;
  para(r.organizer, { size: 9, color: MUTE, gap: 0.5 });
  para(r.contest, { size: 9, color: MUTE, gap: 6 });
  para('AI MATH LAB · ЗЕРТТЕУ ЕСЕБІ', { size: 10, color: BLUE, bold: true, gap: 2 });
  para(`«${r.topic}»`, { size: 18, color: INK, bold: true, gap: 5 });

  const meta = [
    ['Қатысушы', `${r.author}, ${r.grade} оқушысы`],
    ['Мектеп', r.school],
    ['Ғылыми жетекшісі', `${r.supervisor}, ${r.supervisorRole}`],
    ['Бағыт / секция', `${r.direction} / ${r.section}`],
    ['Қала, жыл', r.cityYear],
  ];
  autoTable(doc, {
    ...tableBase,
    startY: y,
    theme: 'plain',
    body: meta,
    styles: { ...tableBase.styles, fontSize: 9.5, cellPadding: 1.4 },
    columnStyles: { 0: { cellWidth: 42, textColor: MUTE }, 1: { textColor: INK } },
  });
  afterTable();

  // Негізгі көрсеткіштер жолағы
  ensure(28);
  const boxes = [
    ['Барлық есеп', String(stats.total)],
    ['Дұрыс жауап', String(stats.correct)],
    ['Қате жауап', String(stats.wrong)],
    ['Жалпы дұрыстық', stats.percent],
    ['Қате үлесі', stats.wrongPercent],
  ];
  const bw = (CW - 4 * 3) / 5;
  boxes.forEach(([k, v], i) => {
    const x = M + i * (bw + 3);
    doc.setDrawColor(...LINE);
    doc.setFillColor(i === 3 ? 232 : 248, i === 3 ? 238 : 249, i === 3 ? 251 : 251);
    doc.roundedRect(x, y, bw, 22, 2, 2, 'FD');
    doc.setFont(FONT, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTE);
    doc.text(k, x + 3, y + 6);
    doc.setFont(FONT, 'bold');
    doc.setFontSize(16);
    doc.setTextColor(...(i === 3 ? BLUE : INK));
    doc.text(v, x + 3, y + 16);
  });
  y += 28;
  para('Көрсеткіштер тек осы зерттеуге енгізілген 30 есепке қатысты және жасанды интеллекттің жалпы дәлдігін білдірмейді.', {
    size: 8.5,
    color: MUTE,
    gap: 4,
  });

  /* ---------- 1. Мақсат, сұрақ, болжам ---------- */
  heading('1. Зерттеудің мақсаты, сұрағы және болжамы');
  para(`Мақсаты: ${r.goal}`);
  para(`Зерттеу сұрағы: ${r.question}`);
  para(`Болжам: ${r.hypothesis}`);
  para(`Зерттеу нысаны: ${r.object} Зерттеу пәні: ${r.subject}`);

  /* ---------- 2. Әдістеме ---------- */
  heading('2. Зерттеу әдістемесі');
  para(r.organization);
  para(r.methods);
  para('Зерттеу тәртібі: есепті ұсыну → AI жауабын алу → шешімді тексеру → нәтижені салыстыру.');

  /* ---------- 3. Үш тәжірибе ---------- */
  heading('3. Үш тәжірибе');
  autoTable(doc, {
    ...tableBase,
    startY: y,
    head: [['Тәжірибе', 'Зерттеу сұрағы', 'Есептер', 'Нәтиже', 'Қорытынды']],
    body: EXPERIMENTS.map((ex) => {
      const list = problems.filter((p) => p.id >= ex.ids[0] && p.id <= ex.ids[1]);
      const ok = list.filter((p) => p.outcome === 'correct').length;
      return [ex.title, ex.question, `№${ex.ids[0]}–${ex.ids[1]}`, `${ok}/${list.length}`, ex.conclusion];
    }),
    styles: { ...tableBase.styles, fontSize: 8.5, valign: 'top' },
    columnStyles: { 0: { cellWidth: 22 }, 1: { cellWidth: 38 }, 2: { cellWidth: 18 }, 3: { cellWidth: 16, halign: 'center' }, 4: { cellWidth: 80 } },
  });
  afterTable();

  /* ---------- 3. Деңгейлер бойынша нәтиже ---------- */
  heading('4. Деңгейлер бойынша нәтиже');
  autoTable(doc, {
    ...tableBase,
    startY: y,
    head: [['Деңгей', 'Есеп саны', 'Дұрыс', 'Қате', 'Дұрыстық']],
    body: stats.byLevel.map((l) => [l.name, l.total, l.correct, l.wrong, l.percent]),
    foot: [['Барлығы', stats.total, stats.correct, stats.wrong, stats.percent]],
    columnStyles: { 1: { halign: 'right' }, 2: { halign: 'right' }, 3: { halign: 'right' }, 4: { halign: 'right' } },
  });
  afterTable();

  // Диаграмма 1: деңгейлер бойынша дұрыс/қате (жинақталған бағандар)
  ensure(86);
  doc.setFont(FONT, 'bold');
  doc.setFontSize(10);
  doc.setTextColor(...INK);
  doc.text('1-диаграмма. Деңгейлер бойынша дұрыс және қате жауаптар саны', M, y + 4);
  y += 15;
  const chX = M + 10;
  const chY = y;
  const chH = 52;
  const chW = CW * 0.62;
  doc.setFontSize(8);
  doc.setFont(FONT, 'normal');
  for (let v = 0; v <= 10; v += 2) {
    const yy = chY + chH - (v / 10) * chH;
    doc.setDrawColor(230, 235, 242);
    doc.setLineWidth(0.2);
    doc.line(chX, yy, chX + chW, yy);
    doc.setTextColor(...MUTE);
    doc.text(String(v), chX - 2, yy + 1, { align: 'right' });
  }
  const slot = chW / 3;
  stats.byLevel.forEach((l, i) => {
    const bwid = slot * 0.46;
    const x = chX + i * slot + (slot - bwid) / 2;
    const hc = (l.correct / 10) * chH;
    const hw = (l.wrong / 10) * chH;
    doc.setFillColor(...BLUE);
    doc.rect(x, chY + chH - hc, bwid, hc, 'F');
    if (hw > 0) {
      doc.setFillColor(...ORANGE);
      doc.rect(x, chY + chH - hc - hw, bwid, hw, 'F');
      doc.setDrawColor(255, 255, 255);
      doc.setLineWidth(0.6);
      doc.line(x, chY + chH - hc, x + bwid, chY + chH - hc);
    }
    doc.setFont(FONT, 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...INK);
    doc.text(`${l.correct}/${l.total} · ${l.percent}`, x + bwid / 2, chY + chH - hc - hw - 2, { align: 'center' });
    doc.setFont(FONT, 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(...SOFT);
    doc.text(l.name, x + bwid / 2, chY + chH + 5, { align: 'center' });
  });
  doc.setDrawColor(...MUTE);
  doc.setLineWidth(0.3);
  doc.line(chX, chY + chH, chX + chW, chY + chH);
  // Шартты белгілер
  const lx = chX + chW + 8;
  doc.setFillColor(...BLUE);
  doc.rect(lx, chY + 6, 4, 4, 'F');
  doc.setFillColor(...ORANGE);
  doc.rect(lx, chY + 14, 4, 4, 'F');
  doc.setFontSize(9);
  doc.setTextColor(...INK);
  doc.text('Дұрыс', lx + 6, chY + 9.3);
  doc.text('Қате', lx + 6, chY + 17.3);
  y = chY + chH + 12;

  // Диаграмма 2: жалпы нәтиже 29/30
  ensure(30);
  doc.setFont(FONT, 'bold');
  doc.setFontSize(10);
  doc.text(`2-диаграмма. Жалпы нәтиже: ${stats.correct}/${stats.total} дұрыс (${stats.percent})`, M, y + 4);
  y += 8;
  const wc = (stats.correct / stats.total) * CW;
  doc.setFillColor(...BLUE);
  doc.rect(M, y, wc, 10, 'F');
  doc.setFillColor(...ORANGE);
  doc.rect(M + wc, y, CW - wc, 10, 'F');
  doc.setDrawColor(255, 255, 255);
  doc.setLineWidth(0.6);
  doc.line(M + wc, y, M + wc, y + 10);
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(9);
  doc.text(`Дұрыс: ${stats.correct} (${stats.percent})`, M + 3, y + 6.6);
  doc.setTextColor(...INK);
  doc.setFont(FONT, 'normal');
  doc.text(`Қате: ${stats.wrong} (${stats.wrongPercent})`, M + CW, y + 15, { align: 'right' });
  y += 20;
  para(`Есептеу: ${stats.correct} ÷ ${stats.total} × 100% ≈ ${stats.percent}; ${stats.wrong} ÷ ${stats.total} × 100% ≈ ${stats.wrongPercent}.`, { size: 9.5 });

  /* ---------- 4. 30 есептің нәтижесі ---------- */
  doc.addPage();
  y = M + 4;
  heading('5. AI жауаптарын тіркеу кестесі (30 есеп)');
  autoTable(doc, {
    ...tableBase,
    startY: y,
    head: [['№', 'Деңгей', 'Есеп шарты', 'Дұрыс жауап', 'AI жауабы', 'Нәтиже']],
    body: problems.map((p) => [p.id, levelName[p.level], p.condition, p.correctAnswer, p.aiAnswer, p.outcome === 'correct' ? '✓ Дұрыс' : '✗ Қате']),
    styles: { ...tableBase.styles, fontSize: 7.8, cellPadding: 1.6, valign: 'top' },
    columnStyles: {
      0: { cellWidth: 8, halign: 'center' },
      1: { cellWidth: 27 },
      2: { cellWidth: 64 },
      3: { cellWidth: 22 },
      4: { cellWidth: 35 },
      5: { cellWidth: 18 },
    },
    didParseCell: (d) => {
      if (d.section === 'body' && d.column.index === 5) {
        d.cell.styles.textColor = String(d.cell.raw).includes('Қате') ? [180, 35, 24] : [23, 114, 69];
        d.cell.styles.fontStyle = 'bold';
      }
      if (d.section === 'body' && problems[d.row.index]?.outcome === 'wrong') {
        d.cell.styles.fillColor = [253, 236, 234];
      }
    },
  });
  afterTable();

  /* ---------- 5. №14 талдауы ---------- */
  heading('6. №14 есептің талдауы — зерттеудегі жалғыз қате');
  para(`Шарт: ${problems[13].condition}`, { color: INK });
  para('AI жауабы: 30, 38, 28. Белгілеу: a — бірінші, b — екінші, c — үшінші сан.');
  autoTable(doc, {
    ...tableBase,
    startY: y,
    head: [['Шарт', 'Жазылуы', 'AI жауабымен тексеру', 'Нәтиже']],
    body: [
      ['Үш санның қосындысы 96', 'a + b + c = 96', '30 + 38 + 28 = 96', '✓ орындалады'],
      ['Бірінші сан екіншісінен 8-ге артық', 'a − b = 8', '30 − 38 = −8', '✗ бұзылды'],
      ['Үшінші сан екіншісінен 4-ке кем', 'b − c = 4', '38 − 28 = 10', '✗ бұзылды'],
    ],
    didParseCell: (d) => {
      if (d.section === 'body' && d.column.index === 3) {
        d.cell.styles.textColor = String(d.cell.raw).includes('бұзылды') ? [180, 35, 24] : [23, 114, 69];
        d.cell.styles.fontStyle = 'bold';
      }
    },
  });
  afterTable();
  para('Теңдеу арқылы шешу: x + (x + 8) + (x − 4) = 96; 3x + 4 = 96; 3x = 92; x = 92/3. 92 саны 3-ке қалдықсыз бөлінбейді, сондықтан үш бүтін сан шықпайды.');
  para(
    'Ескерту: бастапқы шартта сандардың бүтін болуы талап етілмеген. Бөлшек сандар рұқсат етілсе, шешім бар: 116/3, 92/3, 80/3 (қосындысы 96, айырмалары 8 және 4). AI ұсынған 30, 38, 28 сандары бұл шарттарды орындамайды, сондықтан зерттеудің тіркелген нәтижесі өзгермейді: AI жауабы — қате.',
  );
  r.errorAnalysis.slice(2).forEach((t) => para(t));

  /* ---------- 6. Қорытынды ---------- */
  heading('7. Қорытынды');
  r.conclusion.forEach((t) => para(t));
  ensure(16);
  doc.setFillColor(227, 243, 242);
  doc.setFont(FONT, 'bold');
  doc.setFontSize(10.5);
  const mc = wrap(`Зерттеудің негізгі қорытындысы: ${r.mainConclusion}`, CW - 8);
  const mh = mc.length * 5 + 6;
  ensure(mh);
  doc.rect(M, y, CW, mh, 'F');
  doc.setFont(FONT, 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(...INK);
  mc.forEach((ln, i) => doc.text(ln, M + 4, y + 7 + i * 5));
  y += mh + 5;

  heading('Ұсыныстар');
  r.recommendations.forEach((t) => para(`• ${t}`, { gap: 1.2 }));

  /* ---------- Беттің төменгі колонтитулы ---------- */
  const pages = doc.getNumberOfPages();
  for (let i = 1; i <= pages; i++) {
    doc.setPage(i);
    doc.setDrawColor(...LINE);
    doc.setLineWidth(0.2);
    doc.line(M, H - 13, W - M, H - 13);
    doc.setFont(FONT, 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...MUTE);
    doc.text('AI MATH LAB · «Жасанды интеллект математикалық есептерді қаншалықты дұрыс шығарады?»', M, H - 8);
    doc.text(`${i} / ${pages} бет`, W - M, H - 8, { align: 'right' });
  }
  return doc;
}

export const REPORT_FILENAME = 'AI_MATH_LAB_zertteu_esebi.pdf';
