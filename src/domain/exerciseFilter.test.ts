import { EXERCISE_LIST } from '@/db/seed/exercises';
import { exerciseSearchText } from '@/db/seed/searchAliases';

import { filterExercises, matchesSearch, NO_FILTER, type ExerciseFilter } from './exerciseFilter';

// El catálogo real, con el nombre de campo que usan las fichas de la app.
const CATALOG = EXERCISE_LIST.map((e) => ({ ...e, equipmentId: e.equipment }));
const ids = (list: { id: string }[]) => list.map((e) => e.id);
const filter = (f: Partial<ExerciseFilter>) =>
  filterExercises(CATALOG, { ...NO_FILTER, ...f }, exerciseSearchText);

describe('filterExercises', () => {
  it('sin filtro devuelve todo', () => {
    expect(filter({}).main).toHaveLength(CATALOG.length);
  });

  it('por músculo: separa los de músculo principal de los que lo trabajan como secundario', () => {
    const { main, also } = filter({ muscle: 'biceps' });
    expect(ids(main)).toContain('curl');
    expect(ids(main)).not.toContain('remo');
    expect(ids(also)).toContain('remo'); // bíceps secundario
    expect(ids(also)).not.toContain('curl');
  });

  it('combina músculo y equipo', () => {
    const { main } = filter({ muscle: 'pecho', equipment: 'maquina' });
    expect(main.every((e) => e.equipmentId === 'maquina' && e.primary.includes('pecho'))).toBe(
      true,
    );
  });

  it('devuelve listas vacías si nada coincide', () => {
    expect(filter({ muscle: 'gemelos', equipment: 'polea' })).toEqual({
      main: [],
      also: [],
    });
  });

  // Búsquedas reales del usuario en el gym, con sus palabras.
  it.each([
    ['press inclinado barra', 'inclinadobarra'],
    ['pantorrilla prensa', 'gemelosprensa'],
    ['pantorrilla barra guiada', 'gemelossmith'],
    ['pantorrilla hack', 'gemeloshack'],
    ['abrir piernas', 'abductoresmaquina'],
    ['cerrar piernas', 'aductoresmaquina'],
    ['pull over', 'pullover'],
    ['peck deck invertido', 'peckinvertido'],
    ['lower back', 'hiperextensiones'],
    ['remo polea', 'remocerrado'],
  ])('buscar "%s" encuentra %s', (query, id) => {
    expect(ids(filter({ query }).main)).toContain(id);
  });

  it('buscar no distingue tildes ni mayúsculas', () => {
    expect(matchesSearch('Extensión de cuádriceps', 'EXTENSION cuadriceps')).toBe(true);
    expect(matchesSearch('Curl femoral', 'remo')).toBe(false);
  });
});
