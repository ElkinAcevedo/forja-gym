import {
  addSetCopy,
  buildDraftSets,
  fieldsFor,
  isExerciseDone,
  isSessionStale,
  planSets,
} from './workout';

const set = (weightKg: number, reps: number) => ({
  weightKg,
  reps,
  durationS: null,
  distanceM: null,
});

describe('fieldsFor', () => {
  it('peso y reps para los ejercicios con carga; tiempo para los isométricos', () => {
    expect(fieldsFor('weight_reps').map((f) => f.field)).toEqual(['weightKg', 'reps']);
    expect(fieldsFor('time').map((f) => f.field)).toEqual(['durationS']);
    expect(fieldsFor('time_distance').map((f) => f.field)).toEqual(['durationS', 'distanceM']);
  });

  it('el peso va de 0.5 en 0.5 kg', () => {
    expect(fieldsFor('weight_reps')[0]).toMatchObject({ unit: 'kg', precision: 0.5, max: 500 });
  });

  it('en libras el campo de peso muestra y guarda convirtiendo', () => {
    const weight = fieldsFor('weight_reps', 'lb')[0];
    expect(weight).toMatchObject({ unit: 'lb', max: 1102 });
    expect(weight.toDisplay(80)).toBe(176.5);
    expect(weight.toDisplay(weight.fromDisplay(135))).toBe(135);
    expect(fieldsFor('weight_reps', 'lb')[1].toDisplay(8)).toBe(8); // las reps no cambian
  });
});

describe('planSets', () => {
  const last = [set(80, 8), set(80, 7)];

  it('copia la última sesión serie a serie y repite la última si faltan', () => {
    const sets = planSets(4, 'weight_reps', last, true);
    expect(sets.map((s) => s.values.reps)).toEqual([8, 7, 7, 7]);
    expect(sets.every((s) => s.savedSetId === null)).toBe(true);
  });

  it('sin autollenado empieza en 0', () => {
    expect(planSets(2, 'weight_reps', last, false)[0].values).toEqual(set(0, 0));
  });

  it('sin historial empieza en 0 solo los campos del ejercicio', () => {
    expect(planSets(1, 'time', [], true)[0].values).toEqual({
      weightKg: null,
      reps: null,
      durationS: 0,
      distanceM: null,
    });
  });

  it('cada serie es independiente: cambiar una no cambia las demás', () => {
    const sets = planSets(2, 'weight_reps', [set(80, 8)], true);
    sets[0].values.weightKg = 100;
    expect(sets[1].values.weightKg).toBe(80);
  });
});

describe('addSetCopy', () => {
  it('copia los valores de la última serie, sin confirmar', () => {
    const sets = addSetCopy([{ values: set(82.5, 6), savedSetId: 'x' }], 'weight_reps');
    expect(sets[1]).toEqual({ values: set(82.5, 6), savedSetId: null });
  });

  it('sin series, añade una en 0', () => {
    expect(addSetCopy([], 'weight_reps')[0].values).toEqual(set(0, 0));
  });
});

describe('isExerciseDone', () => {
  it('solo cuando todas las series están confirmadas', () => {
    expect(isExerciseDone([{ values: set(1, 1), savedSetId: 'a' }])).toBe(true);
    expect(
      isExerciseDone([
        { values: set(1, 1), savedSetId: 'a' },
        { values: set(1, 1), savedSetId: null },
      ]),
    ).toBe(false);
    expect(isExerciseDone([])).toBe(false);
  });
});

describe('isSessionStale', () => {
  const started = '2026-11-26T08:00:00.000Z';
  it('se retoma dentro de las 12 horas', () => {
    expect(isSessionStale(started, new Date('2026-11-26T19:00:00.000Z'))).toBe(false);
  });
  it('pasadas 12 horas ya no se retoma', () => {
    expect(isSessionStale(started, new Date('2026-11-26T20:30:00.000Z'))).toBe(true);
  });
});

describe('buildDraftSets', () => {
  it('muestra lo confirmado y completa con series precargadas hasta las sugeridas', () => {
    const drafts = buildDraftSets(4, 'weight_reps', [set(80, 8)], true, [
      { id: 'a', position: 0, values: set(82.5, 8) },
      { id: 'b', position: 1, values: set(82.5, 7) },
    ]);
    expect(drafts.map((d) => d.savedSetId)).toEqual(['a', 'b', null, null]);
    expect(drafts[2].values).toEqual(set(80, 8));
  });

  it('conserva las series extra confirmadas aunque superen las sugeridas', () => {
    const drafts = buildDraftSets(1, 'weight_reps', [], true, [
      { id: 'a', position: 0, values: set(80, 8) },
      { id: 'b', position: 1, values: set(80, 8) },
    ]);
    expect(drafts).toHaveLength(2);
  });
});
