/**
 * Carga la semilla en un SQLite real (sql.js) con el esquema completo, con las claves
 * foráneas activas: si algún dato apunta a algo que no existe, la prueba falla.
 */
import { sql } from 'drizzle-orm';

import * as schema from '../schema';
import { createTestDatabase, type TestDatabase } from '../testing';
import { CATALOG_VERSION, seedCatalog } from './index';

describe('seedCatalog', () => {
  let db: TestDatabase;
  const count = (table: string) =>
    db.get<{ n: number }>(sql.raw(`SELECT count(*) AS n FROM ${table}`)).n;

  beforeEach(async () => {
    db = await createTestDatabase();
  });

  it('carga todo el catálogo del mockup', () => {
    expect(seedCatalog(db)).toBe(true);

    expect(count('muscle')).toBe(14);
    expect(count('equipment')).toBe(5);
    expect(count('exercise')).toBe(20);
    expect(count('rep_scheme')).toBe(6);
    expect(count('level_standard')).toBe(25); // 5 ejercicios × 5 niveles
    expect(count('day_template')).toBe(12);
    expect(count('program_template')).toBe(5);
    expect(count('achievement')).toBe(8);
    expect(count('assistant_config')).toBeGreaterThan(0);
  });

  it('guarda los músculos principales y secundarios de cada ejercicio', () => {
    seedCatalog(db);
    const bench = db
      .select({ muscleId: schema.exerciseMuscle.muscleId, role: schema.exerciseMuscle.role })
      .from(schema.exerciseMuscle)
      .where(sql`${schema.exerciseMuscle.exerciseId} = 'banca'`)
      .all();
    expect(bench).toEqual(
      expect.arrayContaining([
        { muscleId: 'pecho', role: 'primary' },
        { muscleId: 'triceps', role: 'secondary' },
        { muscleId: 'hombros', role: 'secondary' },
      ]),
    );
  });

  it('no vuelve a cargar si la versión no cambió', () => {
    seedCatalog(db);
    expect(seedCatalog(db)).toBe(false);
    expect(db.get<{ user_version: number }>(sql`PRAGMA user_version`).user_version).toBe(
      CATALOG_VERSION,
    );
  });

  it('al recargar el catálogo conserva los entrenamientos del usuario', () => {
    seedCatalog(db);
    db.run(sql`INSERT INTO user_profile (id, display_name) VALUES ('u1', 'Atleta')`);
    db.run(sql`INSERT INTO workout_session (id, user_id) VALUES ('s1', 'u1')`);
    db.run(sql`INSERT INTO set_log (id, user_id, session_id, exercise_id, position, weight_kg, reps)
               VALUES ('a', 'u1', 's1', 'banca', 0, 80, 8)`);

    db.run(sql`PRAGMA user_version = 0`); // simula una versión nueva del catálogo
    expect(seedCatalog(db)).toBe(true);

    expect(count('set_log')).toBe(1);
    expect(count('exercise')).toBe(20);
  });
});
