import { problems, levelName } from '../data/problems';
import type { Level } from '../data/types';

/** Пайызды бір ондық таңбамен, қазақша үтірмен жазу: 96,7% */
export const pct = (part: number, total: number) => {
  const v = Math.round((part / total) * 1000) / 10;
  return `${Number.isInteger(v) ? v : v.toFixed(1).replace('.', ',')}%`;
};

export interface LevelStat {
  level: Level;
  name: string;
  total: number;
  correct: number;
  wrong: number;
  percent: string;
  value: number;
}

/** Барлық статистика 30 жазбадан ғана есептеледі */
export function computeStats() {
  const levels: Level[] = ['simple', 'medium', 'complex'];
  const byLevel: LevelStat[] = levels.map((level) => {
    const list = problems.filter((p) => p.level === level);
    const correct = list.filter((p) => p.outcome === 'correct').length;
    return {
      level,
      name: levelName[level],
      total: list.length,
      correct,
      wrong: list.length - correct,
      percent: pct(correct, list.length),
      value: Math.round((correct / list.length) * 1000) / 10,
    };
  });
  const total = problems.length;
  const correct = problems.filter((p) => p.outcome === 'correct').length;
  const wrong = total - correct;
  const wrongIds = problems.filter((p) => p.outcome === 'wrong').map((p) => p.id);
  const byType = Array.from(new Set(problems.map((p) => p.type))).map((type) => {
    const list = problems.filter((p) => p.type === type);
    return { type, total: list.length, correct: list.filter((p) => p.outcome === 'correct').length };
  });
  return {
    total,
    correct,
    wrong,
    percent: pct(correct, total),
    wrongPercent: pct(wrong, total),
    byLevel,
    byType,
    wrongIds,
  };
}

export const stats = computeStats();
