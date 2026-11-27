import { EXERCISE_LIST } from '@/db/seed/exercises';

import { filterExercises, NO_FILTER } from './exerciseFilter';

// El catálogo real, con el nombre de campo que usan las fichas de la app.
const CATALOG = EXERCISE_LIST.map((e) => ({ ...e, equipmentId: e.equipment }));
const ids = (list: { id: string }[]) => list.map((e) => e.id);

describe('filterExercises', () => {
  it('sin filtro devuelve todo', () => {
    expect(filterExercises(CATALOG, NO_FILTER)).toHaveLength(20);
  });

  it('por músculo: primero los que lo trabajan como principal', () => {
    const chest = ids(filterExercises(CATALOG, { muscle: 'pecho', equipment: null }));
    expect(chest.slice(0, 4).sort()).toEqual(['banca', 'fondos', 'inclinado', 'peckdeck']);
    expect(chest).not.toContain('sentadilla');
  });

  it('incluye los que trabajan el músculo como secundario', () => {
    const triceps = ids(filterExercises(CATALOG, { muscle: 'triceps', equipment: null }));
    expect(triceps).toContain('banca'); // tríceps secundario
    expect(triceps.indexOf('triceppolea')).toBeLessThan(triceps.indexOf('banca'));
  });

  it('combina músculo y equipo', () => {
    expect(ids(filterExercises(CATALOG, { muscle: 'pecho', equipment: 'maquina' }))).toEqual([
      'peckdeck',
    ]);
  });

  it('devuelve una lista vacía si nada coincide', () => {
    expect(filterExercises(CATALOG, { muscle: 'gemelos', equipment: 'polea' })).toEqual([]);
  });
});
