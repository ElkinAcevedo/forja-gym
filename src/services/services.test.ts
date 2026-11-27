import { sql } from 'drizzle-orm';

import { seedCatalog } from '@/db/seed';
import { EXERCISE_LIST } from '@/db/seed/exercises';
import { ensureStarterData } from '@/db/starter';
import { createTestDatabase, sequentialIds, type TestDatabase } from '@/db/testing';

import { createExercise, getExerciseCards } from './catalog';
import { getActiveRoutine } from './routines';
import { getRecentRecords, getWeekSummary } from './stats';

describe('servicios de lectura', () => {
  let db: TestDatabase;
  let userId: string;

  beforeEach(async () => {
    db = await createTestDatabase({ seed: true });
    userId = ensureStarterData(db, sequentialIds());
  });

  describe('getActiveRoutine', () => {
    it('devuelve los 7 días con sus ejercicios en orden', () => {
      const routine = getActiveRoutine(db);
      expect(routine?.name).toBe('Mi PPL + Upper');
      expect(routine?.days).toHaveLength(7);
      expect(routine?.days[0]).toMatchObject({
        weekday: 0,
        name: 'Push',
        exerciseIds: ['banca', 'inclinado', 'militar', 'laterales', 'triceppolea'],
      });
      expect(routine?.days[3]).toMatchObject({ weekday: 3, name: null, exerciseIds: [] });
    });
  });

  describe('getExerciseCards', () => {
    it('devuelve los ejercicios pedidos en ese orden y con sus músculos', () => {
      const cards = getExerciseCards(db, ['sentadilla', 'banca']);
      expect(cards.map((c) => c.id)).toEqual(['sentadilla', 'banca']);
      expect(cards[1]).toEqual({
        id: 'banca',
        name: 'Press de banca con barra',
        equipmentId: 'barra',
        isCompound: true,
        restSeconds: 180,
        tracking: 'weight_reps',
        primary: ['pecho'],
        secondary: ['triceps', 'deltoide_anterior'],
      });
    });

    it('sin ids devuelve todo el catálogo', () => {
      expect(getExerciseCards(db)).toHaveLength(EXERCISE_LIST.length);
    });
  });

  describe('createExercise', () => {
    const input = {
      name: '  Remo  Pendlay ',
      equipmentId: 'barra' as const,
      primary: ['dorsales' as const],
    };

    it('crea un ejercicio propio con el nombre limpio y su músculo', () => {
      const card = createExercise(db, input, () => 'propio1');
      expect(card).toMatchObject({
        id: 'propio1',
        name: 'Remo Pendlay',
        equipmentId: 'barra',
        primary: ['dorsales'],
        restSeconds: 90,
      });
    });

    it('rechaza nombres repetidos (sin distinguir mayúsculas), vacíos y sin músculo', () => {
      expect(() =>
        createExercise(db, { ...input, name: 'press de BANCA con barra' }, () => 'x'),
      ).toThrow();
      expect(() => createExercise(db, { ...input, name: '   ' }, () => 'x')).toThrow();
      expect(() => createExercise(db, { ...input, primary: [] }, () => 'x')).toThrow();
    });

    it('recargar el catálogo conserva sus músculos', () => {
      createExercise(db, input, () => 'propio1');
      db.run(sql`PRAGMA user_version = 0`);
      seedCatalog(db);
      expect(getExerciseCards(db, ['propio1'])[0].primary).toEqual(['dorsales']);
    });
  });

  describe('estadísticas', () => {
    // Dos entrenamientos de banca: el segundo con un récord de 82.5 kg.
    beforeEach(() => {
      db.run(
        sql`INSERT INTO workout_session (id, user_id) VALUES ('s1', ${userId}), ('s2', ${userId})`,
      );
      db.run(sql`INSERT INTO set_log (id, user_id, session_id, exercise_id, position, weight_kg, reps, completed_at, is_pr) VALUES
        ('a', ${userId}, 's1', 'banca', 0, 80, 8, '2026-11-23T18:00:00.000Z', 0),
        ('b', ${userId}, 's1', 'banca', 1, 80, 8, '2026-11-23T18:05:00.000Z', 0),
        ('c', ${userId}, 's2', 'banca', 0, 82.5, 6, '2026-11-25T18:00:00.000Z', 1),
        ('d', ${userId}, 's2', 'banca', 1, 75, 10, '2026-11-25T18:05:00.000Z', 0)`);
    });

    it('resume la semana: entrenamientos, volumen y récords', () => {
      const summary = getWeekSummary(
        db,
        new Date('2026-11-23T00:00:00.000Z'),
        new Date('2026-11-30T00:00:00.000Z'),
      );
      // 80×8 + 80×8 + 82.5×6 + 75×10 = 640 + 640 + 495 + 750
      expect(summary).toEqual({ sessions: 2, volumeKg: 2525, records: 1 });
    });

    it('no cuenta las series fuera del rango', () => {
      const summary = getWeekSummary(
        db,
        new Date('2026-11-24T00:00:00.000Z'),
        new Date('2026-11-30T00:00:00.000Z'),
      );
      expect(summary.sessions).toBe(1);
    });

    it('lista los récords con lo que superaron al anterior', () => {
      expect(getRecentRecords(db, 3)).toEqual([
        expect.objectContaining({ exerciseId: 'banca', weightKg: 82.5, reps: 6, gainKg: 2.5 }),
      ]);
    });
  });
});
