import { EXERCISE_LIST } from '@/db/seed/exercises';

import { filterExercises, NO_FILTER } from './exerciseFilter';

// El catálogo real, con el nombre de campo que usan las fichas de la app.
const CATALOG = EXERCISE_LIST.map((e) => ({ ...e, equipmentId: e.equipment }));
const ids = (list: { id: string }[]) => list.map((e) => e.id);

describe('filterExercises', () => {
  it('sin filtro devuelve todo', () => {
    expect(filterExercises(CATALOG, NO_FILTER).main).toHaveLength(CATALOG.length);
  });

  it('por músculo: separa los de músculo principal de los que lo trabajan como secundario', () => {
    const { main, also } = filterExercises(CATALOG, { muscle: 'biceps', equipment: null });
    expect(ids(main)).toContain('curl');
    expect(ids(main)).not.toContain('remo');
    expect(ids(also)).toContain('remo'); // bíceps secundario
    expect(ids(also)).not.toContain('curl');
  });

  it('combina músculo y equipo', () => {
    const { main } = filterExercises(CATALOG, { muscle: 'pecho', equipment: 'maquina' });
    expect(main.every((e) => e.equipmentId === 'maquina' && e.primary.includes('pecho'))).toBe(
      true,
    );
  });

  it('devuelve listas vacías si nada coincide', () => {
    expect(filterExercises(CATALOG, { muscle: 'gemelos', equipment: 'polea' })).toEqual({
      main: [],
      also: [],
    });
  });
});
