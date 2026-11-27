/** Filtro del selector de ejercicios: texto buscado, músculo (tocado en el mapa) y equipo. */

export type ExerciseFilter = {
  /** Texto del buscador; vacío = sin buscar. */
  query: string;
  /** Músculo tocado en el mapa; nulo = todos. */
  muscle: string | null;
  /** Equipo elegido; nulo = todos. */
  equipment: string | null;
};

type Filterable = {
  primary: readonly string[];
  secondary: readonly string[];
  equipmentId: string;
};

export const NO_FILTER: ExerciseFilter = { query: '', muscle: null, equipment: null };

/** Minúsculas, sin tildes y sin espacios sobrantes: "Bíceps  " → "biceps". */
export const normalizeSearch = (text: string) =>
  text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/\s+/g, ' ')
    .trim();

/**
 * Si el texto buscado aparece en `text`: cada palabra en cualquier orden ("remo polea" encuentra
 * "Remo cerrado en polea") o todo junto sin espacios ("pull over" encuentra "pullover").
 */
export function matchesSearch(text: string, query: string): boolean {
  const q = normalizeSearch(query);
  if (!q) return true;
  const t = normalizeSearch(text);
  if (q.split(' ').every((word) => t.includes(word))) return true;
  return t.replaceAll(' ', '').includes(q.replaceAll(' ', ''));
}

/**
 * Ejercicios que cumplen el filtro, separados: `main` los que trabajan el músculo como
 * principal (o todos, sin músculo) y `also` los que solo lo trabajan como secundario, que
 * se muestran aparte para no tapar los propios del músculo (un remo no es "de bíceps").
 */
export function filterExercises<T extends Filterable>(
  exercises: readonly T[],
  { query, muscle, equipment }: ExerciseFilter,
  /** Texto en el que se busca cada ejercicio (nombre, músculos, sinónimos…). */
  searchTextOf: (exercise: T) => string,
): { main: T[]; also: T[] } {
  const byEquipment = exercises.filter(
    (e) => (!equipment || e.equipmentId === equipment) && matchesSearch(searchTextOf(e), query),
  );
  if (!muscle) return { main: byEquipment, also: [] };
  return {
    main: byEquipment.filter((e) => e.primary.includes(muscle)),
    also: byEquipment.filter((e) => !e.primary.includes(muscle) && e.secondary.includes(muscle)),
  };
}
