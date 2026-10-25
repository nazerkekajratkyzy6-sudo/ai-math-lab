import type { Frac } from '../lib/fraction';

export type Level = 'simple' | 'medium' | 'complex';
export type ProblemType =
  | 'Арифметика'
  | 'Мәтіндік есеп'
  | 'Пайыз'
  | 'Бөлшек'
  | 'Геометрия'
  | 'Логика'
  | 'Комбинаторика';

export type Outcome = 'correct' | 'wrong';

/** Пайдаланушының өз тексеруіне арналған енгізу түрі */
export type InputSpec =
  | { kind: 'number'; unit?: string; expected: Frac; hint?: string }
  | { kind: 'numbers'; labels: string[]; unit?: string; expected: Frac[]; hint?: string }
  | { kind: 'triple14' }
  | { kind: 'choice'; options: string[]; expected: number; hint?: string };

/** Математикалық тексерудің бір жолы */
export interface CheckRow {
  label: string;
  tex?: string;
  text?: string;
  ok?: boolean;
}

export interface Verification {
  /** Шешім жолдары (TypeScript-те нақты есептелген) */
  steps: CheckRow[];
  /** AI жауабын шартқа қою арқылы тексеру */
  aiCheck: CheckRow[];
  /** Алгоритм бойынша алынған эталон жауап */
  reference: string;
  /** AI жауабы шарттың барлығын қанағаттандыра ма (алгоритм қорытындысы) */
  aiSatisfies: boolean;
}

export interface Problem {
  id: number;
  level: Level;
  type: ProblemType;
  /** Бастапқы шарт — ғылыми жұмыстағы мәтін */
  condition: string;
  /** Ғылыми жұмыстағы «Дұрыс шешуі / Дұрыс талдау» мәтіні */
  sourceSolution: string;
  /** Қосымша 3: «Дұрыс жауап» бағаны */
  correctAnswer: string;
  /** Қосымша 3: «AI жауабы» бағаны (зерттеуде тіркелген) */
  aiAnswer: string;
  /** AI жауабының тек өзі (тіркеу кестесінде ескертпемен бірге жазылған жағдайда) */
  aiShort?: string;
  /** Зерттеуде тіркелген нәтиже */
  outcome: Outcome;
  input: InputSpec;
  verify: () => Verification;
  /** Тереңдетілген интерактивті модель (бар болса) */
  model?: string;
}
