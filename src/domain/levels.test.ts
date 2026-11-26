import { scaleThresholds, strengthLevel } from './levels';

// Press de banca en el catálogo (mockup): umbrales para 75 kg de peso corporal.
const BENCH_AT_75 = [45, 60, 80, 105, 130];

describe('scaleThresholds', () => {
  it('no cambia los umbrales para 75 kg', () => {
    expect(scaleThresholds(BENCH_AT_75, 75)).toEqual(BENCH_AT_75);
  });

  it('los escala al peso corporal y redondea a 2.5 kg', () => {
    // 90 kg: 54 → 55, 72 → 72.5, 96 → 95, 126 → 125, 156 → 155
    expect(scaleThresholds(BENCH_AT_75, 90)).toEqual([55, 72.5, 95, 125, 155]);
  });
});

describe('strengthLevel', () => {
  it('80 kg en banca a 75 kg corporales es Intermedio y faltan 25 kg para Avanzado', () => {
    expect(strengthLevel(80, BENCH_AT_75)).toEqual({
      level: 2,
      name: 'Intermedio',
      next: { level: 3, name: 'Avanzado', kgToGo: 25 },
    });
  });

  it('por debajo del primer umbral es Principiante', () => {
    expect(strengthLevel(30, BENCH_AT_75)).toMatchObject({ level: 0, name: 'Principiante' });
  });

  it('en Élite no hay siguiente nivel', () => {
    expect(strengthLevel(140, BENCH_AT_75)).toMatchObject({ level: 4, name: 'Élite', next: null });
  });

  it('rechaza una tabla de umbrales incompleta', () => {
    expect(() => strengthLevel(80, [45, 60])).toThrow();
  });
});
