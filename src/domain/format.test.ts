import { formatClock, formatSet } from './format';

const empty = { weightKg: null, reps: null, durationS: null, distanceM: null };

describe('formatClock', () => {
  it('muestra minutos y segundos con dos cifras', () => {
    expect(formatClock(75)).toBe('1:15');
    expect(formatClock(5)).toBe('0:05');
    expect(formatClock(3725)).toBe('62:05');
  });

  it('nunca muestra tiempos negativos', () => {
    expect(formatClock(-3)).toBe('0:00');
  });
});

describe('formatSet', () => {
  it('peso y repeticiones', () => {
    expect(formatSet({ ...empty, weightKg: 80, reps: 8 })).toBe('80 kg × 8');
  });

  it('tiempo, distancia o ambos', () => {
    expect(formatSet({ ...empty, durationS: 45 })).toBe('45 s');
    expect(formatSet({ ...empty, durationS: 90, distanceM: 400 })).toBe('1:30 · 400 m');
  });
});
