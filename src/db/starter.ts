/**
 * Datos con los que arranca la app la primera vez: el perfil del usuario y su rutina.
 * Hasta la Fase 2 (editor y asistente de rutinas) esta es la rutina con la que se entrena.
 */
import { DAY_TEMPLATES, type DayTemplateId } from './seed/templates';
import type { WeekPlan } from './seed/assistant';
import * as schema from './schema';
import type { AppDatabase, IdGenerator } from './types';

/** Rutina elegida por el usuario: PPL con jueves de descanso y tren superior el viernes. */
export const STARTER_ROUTINE = {
  name: 'Mi PPL + Upper',
  // Lunes a domingo
  week: ['push', 'pull', 'legs', 'rest', 'upper', 'legs', 'rest'],
} as const satisfies { name: string; week: WeekPlan };

const STARTER_PROFILE_NAME = 'Atleta';

const dayTemplate = (id: DayTemplateId) => {
  const day = DAY_TEMPLATES.find((d) => d.id === id);
  if (!day) throw new Error(`Día tipo no encontrado: ${id}`);
  return day;
};

/**
 * Crea el perfil y la rutina inicial si la app aún no tiene perfil. Devuelve el id del
 * usuario (el nuevo o el existente). Es idempotente: llamarla de nuevo no duplica nada.
 */
export function ensureStarterData(db: AppDatabase, newId: IdGenerator): string {
  const existing = db.select({ id: schema.userProfile.id }).from(schema.userProfile).get();
  if (existing) return existing.id;

  const userId = newId();

  db.transaction((tx) => {
    tx.insert(schema.userProfile).values({ id: userId, displayName: STARTER_PROFILE_NAME }).run();

    const routineId = newId();
    tx.insert(schema.routine)
      .values({ id: routineId, userId, name: STARTER_ROUTINE.name, isActive: true })
      .run();

    STARTER_ROUTINE.week.forEach((dayId, weekday) => {
      const routineDayId = newId();
      const template = dayId === 'rest' ? null : dayTemplate(dayId);

      tx.insert(schema.routineDay)
        .values({ id: routineDayId, userId, routineId, weekday, name: template?.name ?? null })
        .run();

      if (!template) return;
      tx.insert(schema.routineDayExercise)
        .values(
          template.exercises.map((exerciseId, position) => ({
            id: newId(),
            userId,
            routineDayId,
            exerciseId,
            position,
          })),
        )
        .run();
    });
  });

  return userId;
}
