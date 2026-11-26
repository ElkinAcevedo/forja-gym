import * as schema from './schema';
import { ensureStarterData, STARTER_ROUTINE } from './starter';
import { createTestDatabase, sequentialIds, type TestDatabase } from './testing';

describe('ensureStarterData', () => {
  let db: TestDatabase;

  beforeEach(async () => {
    db = await createTestDatabase({ seed: true });
  });

  it('crea el perfil y la rutina inicial activa con sus 7 días', () => {
    const userId = ensureStarterData(db, sequentialIds());

    expect(db.select().from(schema.userProfile).all()).toEqual([
      expect.objectContaining({ id: userId, displayName: 'Atleta' }),
    ]);
    expect(db.select().from(schema.routine).all()).toEqual([
      expect.objectContaining({ name: STARTER_ROUTINE.name, isActive: true }),
    ]);
    const days = db.select().from(schema.routineDay).all();
    expect(days.map((d) => d.name)).toEqual(['Push', 'Pull', 'Legs', null, 'Upper', 'Legs', null]);
  });

  it('no duplica nada si se llama otra vez', () => {
    const first = ensureStarterData(db, sequentialIds());
    const second = ensureStarterData(db, sequentialIds());

    expect(second).toBe(first);
    expect(db.select().from(schema.routine).all()).toHaveLength(1);
  });
});
