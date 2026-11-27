import { ensureStarterData } from '@/db/starter';
import { createTestDatabase, sequentialIds, type TestDatabase } from '@/db/testing';

import { getHomeData } from './home';

const MONDAY = new Date(2026, 10, 23, 9, 0);
const THURSDAY = new Date(2026, 10, 26, 9, 0);

describe('getHomeData', () => {
  let db: TestDatabase;

  beforeEach(async () => {
    db = await createTestDatabase({ seed: true });
    ensureStarterData(db, sequentialIds());
  });

  it('el lunes toca Push con sus 5 ejercicios, músculos y duración estimada', () => {
    const home = getHomeData(db, MONDAY);

    expect(home.displayName).toBe('Atleta');
    expect(home.routineName).toBe('Mi PPL + Upper');
    expect(home.today?.name).toBe('Push');
    expect(home.today?.exercises.map((e) => e.id)).toEqual([
      'banca',
      'inclinado',
      'militar',
      'laterales',
      'triceppolea',
    ]);
    expect(home.today?.muscles.primary).toEqual([
      'pecho',
      'deltoide_anterior',
      'deltoide_lateral',
      'triceps',
    ]);
    // Hipertrofia: banca y militar 4 series, el resto 3, con el descanso de cada ejercicio.
    expect(home.today?.estimatedMinutes).toBe(45);
  });

  it('el jueves es descanso', () => {
    expect(getHomeData(db, THURSDAY).today).toBeNull();
  });

  it('marca hoy en la semana y cuenta los 5 entrenamientos planeados', () => {
    const home = getHomeData(db, THURSDAY);
    expect(home.week.map((d) => d.isToday)).toEqual([
      false,
      false,
      false,
      true,
      false,
      false,
      false,
    ]);
    expect(home.week.map((d) => d.date.getDate())).toEqual([23, 24, 25, 26, 27, 28, 29]);
    expect(home.summary).toEqual({ sessions: 0, volumeKg: 0, records: 0, plannedSessions: 5 });
    expect(home.records).toEqual([]);
  });
});
