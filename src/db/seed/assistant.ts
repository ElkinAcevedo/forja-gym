/**
 * Configuraciones que propone el asistente (paso 3) para cada rutina popular y cada número
 * de días por semana. Se calculan una vez al cargar el catálogo y se guardan como datos.
 */
import { DAY_TEMPLATES, PROGRAMS, type DayTemplateId, type ProgramId } from './templates';

export const DAYS_PER_WEEK = [2, 3, 4, 5, 6] as const;
export type DaysPerWeek = (typeof DAYS_PER_WEEK)[number];

/** Plan de lunes a domingo: un día tipo o descanso. */
export type WeekPlan = readonly (DayTemplateId | 'rest')[];

export type AssistantOption = { name: string; explanation: string; week: WeekPlan };

const R = 'rest';

/** Días de la semana (0 = lunes) en que caen N sesiones, dejando descansos entre ellas. */
const TRAINING_WEEKDAYS: Record<DaysPerWeek, readonly number[]> = {
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 4, 5],
  6: [0, 1, 2, 3, 4, 5],
};

/** Coloca las sesiones en la semana según `TRAINING_WEEKDAYS`; el resto son descansos. */
export function spreadOverWeek(sessions: readonly DayTemplateId[]): WeekPlan {
  const weekdays = TRAINING_WEEKDAYS[sessions.length as DaysPerWeek];
  if (!weekdays) throw new Error(`No se pueden repartir ${sessions.length} sesiones`);

  const week: (DayTemplateId | 'rest')[] = Array(7).fill(R);
  weekdays.forEach((weekday, i) => (week[weekday] = sessions[i]));
  return week;
}

/** PPL tiene opciones pensadas a mano para cada número de días (mockup). */
const PPL_OPTIONS: Record<DaysPerWeek, AssistantOption[]> = {
  2: [
    {
      name: 'Full Body ×2',
      explanation:
        'Con 2 días, PPL dejaría músculos sin entrenar durante semanas. Mejor cuerpo completo dos veces.',
      week: spreadOverWeek(['full', 'full']),
    },
    {
      name: 'Upper / Lower',
      explanation: 'Tren superior un día, inferior otro. Cada músculo 1× por semana.',
      week: spreadOverWeek(['upper', 'lower']),
    },
  ],
  3: [
    {
      name: 'PPL clásico',
      explanation: 'Cada patrón una vez por semana, con un día de descanso entre sesiones.',
      week: spreadOverWeek(['push', 'pull', 'legs']),
    },
    {
      name: 'PPL rotativo',
      explanation:
        'La secuencia P → P → L continúa la semana siguiente donde quedaste. Frecuencia media 1.3×.',
      week: spreadOverWeek(['push', 'pull', 'legs']),
    },
    {
      name: 'Full Body ×3',
      explanation: 'Alternativa si quieres frecuencia 3× con solo 3 días.',
      week: spreadOverWeek(['full', 'full', 'full']),
    },
  ],
  4: [
    {
      name: 'PPL + Upper',
      explanation:
        'Agregas un día de tren superior: pecho, espalda y hombro llegan a 2× por semana.',
      week: ['push', 'pull', R, 'legs', 'upper', R, R],
    },
    {
      name: 'PPL + Lower',
      explanation: 'Prioriza pierna y glúteo con un segundo día de tren inferior.',
      week: ['legs', 'push', R, 'pull', 'lower', R, R],
    },
    {
      name: 'Upper / Lower ×2',
      explanation: 'Si te importa más la frecuencia que el estilo PPL: todo 2× por semana.',
      week: ['upper', 'lower', R, 'upper', 'lower', R, R],
    },
  ],
  5: [
    {
      name: 'PPL + Upper/Lower',
      explanation: 'El híbrido más usado: 5 días y todos los grupos a 2× por semana.',
      week: ['push', 'pull', 'legs', R, 'upper', 'lower', R],
    },
    {
      name: 'PPL + Push/Pull',
      explanation: 'Énfasis en tren superior; pierna 1×.',
      week: ['push', 'pull', 'legs', R, 'push', 'pull', R],
    },
  ],
  6: [
    {
      name: 'PPL ×2',
      explanation: 'PPL completo: cada músculo dos veces por semana, domingo libre.',
      week: ['push', 'pull', 'legs', 'push', 'pull', 'legs', R],
    },
    {
      name: 'PPL ×2 con miércoles libre',
      explanation: 'Mismo volumen, pero con un descanso a mitad de semana. Usa el domingo.',
      week: ['push', 'pull', 'legs', R, 'push', 'pull', 'legs'],
    },
    {
      name: 'Arnold Split',
      explanation: 'Alternativa de volumen alto con pares de músculos.',
      week: ['chestback', 'armsh', 'legs', 'chestback', 'armsh', 'legs', R],
    },
  ],
};

const dayName = (id: DayTemplateId) => DAY_TEMPLATES.find((day) => day.id === id)?.name ?? id;

/**
 * Opciones del asistente para una rutina y unos días por semana.
 * Fuera de PPL: reparte la secuencia de la rutina y añade alternativas con mejor frecuencia
 * (Upper/Lower con 4 o más días, Full Body con 3 o menos).
 */
export function buildAssistantOptions(programId: ProgramId, days: DaysPerWeek): AssistantOption[] {
  if (programId === 'ppl') return PPL_OPTIONS[days];

  const program = PROGRAMS.find((p) => p.id === programId);
  if (!program) throw new Error(`Rutina desconocida: ${programId}`);

  const sequence = Array.from({ length: days }, (_, i) => program.plan[i % program.plan.length]);
  const options: AssistantOption[] = [
    {
      name: `${program.name} · ${days} días`,
      explanation: `Repartimos la secuencia ${program.plan.map(dayName).join(' → ')} en ${days} días con descansos para recuperar.`,
      week: spreadOverWeek(sequence),
    },
  ];

  if (days >= 4 && programId !== 'ul') {
    options.push({
      name: 'Upper / Lower',
      explanation: 'Alternativa con más frecuencia por músculo.',
      week: spreadOverWeek(Array.from({ length: days }, (_, i) => (i % 2 ? 'lower' : 'upper'))),
    });
  }
  if (days <= 3 && programId !== 'fb') {
    options.push({
      name: 'Full Body',
      explanation: 'Con pocos días, el cuerpo completo da mejor frecuencia.',
      week: spreadOverWeek(Array(days).fill('full')),
    });
  }
  return options;
}
