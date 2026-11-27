import { eq } from 'drizzle-orm';

import * as schema from '@/db/schema';
import type { AppDatabase } from '@/db/types';
import { REST_OPTIONS_S, TRAINING_GOALS, WEIGHT_INCREMENTS_KG, WEIGHT_UNITS } from '@/domain/enums';
import type { RepSchemeRule } from '@/domain/training';

export type Profile = typeof schema.userProfile.$inferSelect;

/** El perfil del usuario. Siempre existe: se crea en el primer arranque. */
export function getProfile(db: AppDatabase): Profile {
  const profile = db.select().from(schema.userProfile).get();
  if (!profile) throw new Error('No existe el perfil del usuario');
  return profile;
}

/** Reglas de series × reps del catálogo. */
export function getRepSchemes(db: AppDatabase): RepSchemeRule[] {
  return db.select().from(schema.repScheme).all();
}

/** Ajustes que el usuario puede cambiar desde Perfil. */
export type SettingsPatch = Partial<
  Pick<Profile, 'unit' | 'goal' | 'incrementKg' | 'restSeconds' | 'autofill'>
>;

const isOneOf = <T>(options: readonly T[], value: T) => options.includes(value);

/**
 * Guarda cambios de ajustes. Valida cada valor contra las opciones permitidas antes de
 * escribir: un valor inválido es un error de programación, no algo que deba guardarse.
 */
export function updateSettings(db: AppDatabase, patch: SettingsPatch, now: Date): Profile {
  const { unit, goal, incrementKg, restSeconds } = patch;
  if (unit !== undefined && !isOneOf(WEIGHT_UNITS, unit)) {
    throw new Error(`Unidad no válida: ${unit}`);
  }
  if (goal !== undefined && !isOneOf(TRAINING_GOALS, goal)) {
    throw new Error(`Objetivo no válido: ${goal}`);
  }
  if (incrementKg !== undefined && !isOneOf<number>(WEIGHT_INCREMENTS_KG, incrementKg)) {
    throw new Error(`Incremento no válido: ${incrementKg}`);
  }
  if (restSeconds !== undefined && !isOneOf<number>(REST_OPTIONS_S, restSeconds)) {
    throw new Error(`Descanso no válido: ${restSeconds}`);
  }

  const profile = getProfile(db);
  db.update(schema.userProfile)
    .set({ ...patch, updatedAt: now.toISOString() })
    .where(eq(schema.userProfile.id, profile.id))
    .run();
  return getProfile(db);
}
