export interface ModelInfo {
  slug: string;
  problemId: number;
  title: string;
  short: string;
  description: string;
}

/** Ғылыми жұмыстағы есептерге негізделген 8 тереңдетілген модель */
export const MODELS: ModelInfo[] = [
  {
    slug: 'sagat',
    problemId: 22,
    title: 'Сағат тілдері',
    short: '3:30 кезіндегі бұрыш — 75°',
    description: 'Тілдерді жылжытып, сағаттық және минуттық тілдердің бұрышын бақылаңыз.',
  },
  {
    slug: 'figura',
    problemId: 26,
    title: 'Фигура ауданы',
    short: '10×10 квадрат, 4 қиық 2×2 — 84 см²',
    description: 'Квадраттың бұрыштарынан кесілетін бөліктер мен қалған ауданды көрсететін модель.',
  },
  {
    slug: 'payyz',
    problemId: 20,
    title: 'Пайыздық өзгеріс',
    short: '100 → 120 → 96',
    description: '+20% және −20% өзгерістерінің кезектілігі және соңғы бағаның неге өзгеретіні.',
  },
  {
    slug: 'qol-alysu',
    problemId: 30,
    title: 'Қол алысу',
    short: '20 оқушы — 190 қол алысу',
    description: 'Әр жұпты бір рет қана қосатын байланыстарды біртіндеп салу.',
  },
  {
    slug: 'qoraptar',
    problemId: 21,
    title: 'Жеміс қораптары',
    short: 'Үш қате жазу және бір жеміс',
    description: 'Қате белгіленген үш қораптың мазмұнын бір жеміс арқылы логикалық анықтау.',
  },
  {
    slug: 'tiyndar',
    problemId: 25,
    title: 'Монеталар',
    short: '10 тиын, 3 елтаңба жоғары',
    description: 'Тиындарды екі топқа бөліп, үш тиынды аудару арқылы теңестіру.',
  },
  {
    slug: 'bolshekter',
    problemId: 18,
    title: 'Бөлшектер',
    short: 'Кітаптың үлестері — 120 бет',
    description: 'Кітаптың оқылған үлестерін және оқылмай қалған бөлігін көрнекі бөлу.',
  },
  {
    slug: 'ush-san',
    problemId: 14,
    title: 'Үш сан',
    short: 'Қосынды мен екі айырманы тексеру',
    description: 'Үш санды енгізіп, әр шартты жеке тексеру. AI жауабы 30, 38, 28 талдауы.',
  },
];

export const modelBySlug = (slug: string) => MODELS.find((m) => m.slug === slug);
