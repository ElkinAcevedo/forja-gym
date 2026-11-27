import { ensureStarterData } from '@/db/starter';
import { createTestDatabase, sequentialIds, type TestDatabase } from '@/db/testing';
import type { SetValues } from '@/domain/workout';

import { getRestPreference, saveRestPreference } from './preferences';
import { deleteSet, finishSession, getWorkoutExercise, getWorkoutPlan, saveSet } from './session';

const MONDAY = new Date('2026-11-23T17:00:00.000Z'); // lunes: Push
const THURSDAY = new Date('2026-11-26T17:00:00.000Z'); // jueves: descanso
const NEXT_MONDAY = new Date('2026-11-30T17:00:00.000Z');

const kg = (weightKg: number, reps: number): SetValues => ({
  weightKg,
  reps,
  durationS: null,
  distanceM: null,
});

describe('servicio de sesión', () => {
  let db: TestDatabase;
  const newId = sequentialIds();

  beforeEach(async () => {
    db = await createTestDatabase({ seed: true });
    ensureStarterData(db, newId);
  });

  /** Registra una serie de banca en el día de la rutina que toque `at`. */
  const logBench = (values: SetValues, at: Date, position = 0) => {
    const plan = getWorkoutPlan(db, at);
    return saveSet(
      db,
      {
        sessionId: plan.session?.id ?? null,
        routineDayId: plan.day?.id ?? null,
        exerciseId: 'banca',
        position,
        values,
      },
      at,
      newId,
    );
  };

  it('el lunes propone Push con el esquema de hipertrofia y sin sesión abierta', () => {
    const plan = getWorkoutPlan(db, MONDAY);
    expect(plan.session).toBeNull();
    expect(plan.day?.name).toBe('Push');
    expect(plan.exercises.map((e) => e.card.id)).toEqual([
      'banca',
      'inclinado',
      'militar',
      'laterales',
      'triceppolea',
    ]);
    expect(plan.exercises[0].scheme).toEqual({ sets: 4, repMin: 6, repMax: 8 });
    expect(plan.settings).toEqual({ autofill: true, incrementKg: 2.5 });
    // Banca es compuesto: 90 s del perfil + 60 s. Las elevaciones laterales, 90 s.
    expect(plan.exercises[0].restSeconds).toBe(150);
    expect(plan.exercises[3].restSeconds).toBe(90);
  });

  it('un día de descanso no propone ejercicios, pero deja elegir otro día de la rutina', () => {
    const plan = getWorkoutPlan(db, THURSDAY);
    expect(plan.day).toBeNull();
    expect(plan.exercises).toEqual([]);
    expect(plan.trainableDays.map((d) => d.name)).toEqual([
      'Push',
      'Pull',
      'Legs',
      'Upper',
      'Legs',
    ]);

    const pull = plan.trainableDays[1];
    expect(getWorkoutPlan(db, THURSDAY, pull.id).exercises[0].card.id).toBe('dominadas');
  });

  it('la primera serie abre la sesión y queda guardada para retomarla', () => {
    const { sessionId, isPr } = logBench(kg(80, 8), MONDAY);
    expect(isPr).toBe(false); // primera vez: no hay récord que superar

    const later = new Date(MONDAY.getTime() + 10 * 60 * 1000);
    const plan = getWorkoutPlan(db, later);
    expect(plan.session?.id).toBe(sessionId);
    expect(plan.exercises[0].savedSets).toEqual([
      expect.objectContaining({ position: 0, values: kg(80, 8) }),
    ]);
  });

  it('la sesión siguiente precarga la anterior y detecta el récord', () => {
    logBench(kg(80, 8), MONDAY, 0);
    logBench(kg(80, 7), MONDAY, 1);
    finishSession(db, getWorkoutPlan(db, MONDAY).session!.id, MONDAY);

    const plan = getWorkoutPlan(db, NEXT_MONDAY);
    expect(plan.session).toBeNull();
    expect(plan.exercises[0].lastSession).toEqual([kg(80, 8), kg(80, 7)]);
    expect(plan.exercises[0].bestWeightKg).toBe(80);

    expect(logBench(kg(82.5, 6), NEXT_MONDAY).isPr).toBe(true);
  });

  it('desmarcar una serie la quita de la sesión', () => {
    const { setId } = logBench(kg(80, 8), MONDAY);
    deleteSet(db, setId, MONDAY);
    expect(getWorkoutPlan(db, MONDAY).exercises[0].savedSets).toEqual([]);
  });

  it('una sesión olvidada abierta más de 12 horas se cierra sola', () => {
    logBench(kg(80, 8), MONDAY);
    const nextDay = new Date(MONDAY.getTime() + 20 * 60 * 60 * 1000);
    expect(getWorkoutPlan(db, nextDay).session).toBeNull();
  });

  it('recuerda el descanso que el usuario elige para un ejercicio', () => {
    saveRestPreference(db, 'banca', 180, MONDAY);
    saveRestPreference(db, 'banca', 165, MONDAY); // lo vuelve a cambiar: se actualiza
    expect(getRestPreference(db, 'banca')).toBe(165);
    expect(getWorkoutPlan(db, MONDAY).exercises[0].restSeconds).toBe(165);
  });

  it('un ejercicio añadido desde el selector trae su historial y su descanso', () => {
    logBench(kg(80, 8), MONDAY);
    finishSession(db, getWorkoutPlan(db, MONDAY).session!.id, MONDAY);

    const bench = getWorkoutExercise(db, 'banca', null);
    expect(bench.lastSession).toEqual([kg(80, 8)]);
    expect(bench.restSeconds).toBe(150);
    expect(bench.savedSets).toEqual([]);
  });

  it('una serie de un ejercicio añadido hace que aparezca al retomar la sesión', () => {
    const plan = getWorkoutPlan(db, MONDAY);
    saveSet(
      db,
      {
        sessionId: null,
        routineDayId: plan.day!.id,
        exerciseId: 'sentadilla', // no es del día Push
        position: 0,
        values: kg(100, 5),
      },
      MONDAY,
      newId,
    );
    const ids = getWorkoutPlan(db, MONDAY).exercises.map((e) => e.card.id);
    expect(ids.at(-1)).toBe('sentadilla');
  });
});
