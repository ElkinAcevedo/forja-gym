import type { AppDatabase } from '@/db/types';
import { startOfWeek, weekDates, weekdayIndex } from '@/domain/dates';
import type { WeightUnit } from '@/domain/enums';
import { combineMuscles, type MuscleSet } from '@/domain/muscles';
import { estimateWorkoutMinutes, suggestedScheme } from '@/domain/training';

import { getExerciseCards, type ExerciseCard } from './catalog';
import { getProfile, getRepSchemes } from './profile';
import { getActiveRoutine } from './routines';
import { getRecentRecords, getWeekSummary, type RecentRecord, type WeekSummary } from './stats';

const RECENT_RECORDS = 3;

export type WeekDay = {
  date: Date;
  /** Nombre del día de la rutina; nulo = descanso. */
  name: string | null;
  isToday: boolean;
};

export type HomeData = {
  displayName: string;
  unit: WeightUnit;
  routineName: string;
  week: WeekDay[];
  /** Entrenamiento de hoy, o `null` si toca descanso. */
  today: {
    name: string;
    exercises: ExerciseCard[];
    muscles: MuscleSet<ExerciseCard['primary'][number]>;
    estimatedMinutes: number;
  } | null;
  summary: WeekSummary & { plannedSessions: number };
  records: (RecentRecord & { exercise: ExerciseCard })[];
};

/** Todo lo que muestra la pantalla Inicio para el momento `now`. */
export function getHomeData(db: AppDatabase, now: Date): HomeData {
  const profile = getProfile(db);
  const routine = getActiveRoutine(db);
  const days = routine?.days ?? [];
  const todayIndex = weekdayIndex(now);

  const week = weekDates(now).map((date, i) => ({
    date,
    name: days.find((d) => d.weekday === i)?.name ?? null,
    isToday: i === todayIndex,
  }));

  const todayPlan = days.find((d) => d.weekday === todayIndex);
  let today: HomeData['today'] = null;
  if (todayPlan?.name) {
    const exercises = getExerciseCards(db, todayPlan.exerciseIds);
    const rules = getRepSchemes(db);
    const totalSets = exercises.reduce(
      (sum, e) => sum + suggestedScheme(rules, profile.goal, e.isCompound).sets,
      0,
    );
    today = {
      name: todayPlan.name,
      exercises,
      muscles: combineMuscles(exercises),
      estimatedMinutes: estimateWorkoutMinutes(totalSets, profile.restSeconds),
    };
  }

  const monday = startOfWeek(now);
  const nextMonday = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + 7);
  const records = getRecentRecords(db, RECENT_RECORDS);
  const recordCards = getExerciseCards(db, [...new Set(records.map((r) => r.exerciseId))]);

  return {
    displayName: profile.displayName,
    unit: profile.unit,
    routineName: routine?.name ?? '',
    week,
    today,
    summary: {
      ...getWeekSummary(db, monday, nextMonday),
      plannedSessions: days.filter((d) => d.name !== null).length,
    },
    records: records.flatMap((record) => {
      const exercise = recordCards.find((c) => c.id === record.exerciseId);
      return exercise ? [{ ...record, exercise }] : [];
    }),
  };
}
