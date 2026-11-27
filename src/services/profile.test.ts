import { ensureStarterData } from '@/db/starter';
import { createTestDatabase, sequentialIds, type TestDatabase } from '@/db/testing';

import { getProfile, updateSettings, type SettingsPatch } from './profile';
import { getWorkoutPlan } from './session';

const NOW = new Date('2026-11-23T17:00:00.000Z'); // lunes

describe('updateSettings', () => {
  let db: TestDatabase;

  beforeEach(async () => {
    db = await createTestDatabase({ seed: true });
    ensureStarterData(db, sequentialIds());
  });

  it('guarda los ajustes y la app los usa', () => {
    updateSettings(
      db,
      { unit: 'lb', goal: 'strength', incrementKg: 5, restSeconds: 120, autofill: false },
      NOW,
    );
    const profile = getProfile(db);
    expect(profile).toMatchObject({
      unit: 'lb',
      goal: 'strength',
      incrementKg: 5,
      restSeconds: 120,
      autofill: false,
    });
    expect(profile.updatedAt).toBe(NOW.toISOString());

    const plan = getWorkoutPlan(db, NOW);
    expect(plan.settings).toEqual({ autofill: false, incrementKg: 5, unit: 'lb' });
    expect(plan.exercises[0].scheme).toEqual({ sets: 5, repMin: 3, repMax: 5 }); // fuerza
    expect(plan.exercises[0].restSeconds).toBe(180); // compuesto: 120 + 60
  });

  it('cambiar un ajuste no toca los demás', () => {
    updateSettings(db, { unit: 'lb' }, NOW);
    expect(getProfile(db)).toMatchObject({ unit: 'lb', goal: 'hypertrophy', incrementKg: 2.5 });
  });

  it.each<SettingsPatch>([
    { unit: 'st' as never },
    { goal: 'power' as never },
    { incrementKg: 1.25 },
    { restSeconds: 45 },
  ])('rechaza un valor no permitido: %o', (patch) => {
    expect(() => updateSettings(db, patch, NOW)).toThrow();
    expect(getProfile(db).unit).toBe('kg');
  });
});
