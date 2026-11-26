const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// Redondea al múltiplo más cercano de `precision` (0.5 en kg: no existen pesos de 7.2 kg; 1 en reps).
// Redondear también evita que 2.5 + 2.5 + … acumule errores de coma flotante.
export const roundTo = (n: number, precision: number) => Math.round(n / precision) * precision;

export const stepValue = (value: number, delta: number, min: number, max: number, precision: number) =>
  clamp(roundTo(value + delta, precision), min, max);

// Texto del teclado → número válido, o null si no lo es. Acepta coma decimal ("82,5").
export const parseInput = (text: string, min: number, max: number, precision: number) => {
  const n = Number(text.trim().replace(',', '.'));
  if (text.trim() === '' || !Number.isFinite(n)) return null;
  return clamp(roundTo(n, precision), min, max);
};
