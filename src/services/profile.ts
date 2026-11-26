import * as schema from '@/db/schema';
import type { AppDatabase } from '@/db/types';
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
