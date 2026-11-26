/**
 * Reglas numéricas de los valores que registra el usuario (pesos y repeticiones).
 * Funciones puras: no dependen de React Native, así se prueban sin simular la app.
 */

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

/**
 * Redondea al múltiplo más cercano de `precision`: 0.5 en kg (no existen pesos de 7.2 kg)
 * y 1 en reps. Redondear también evita que 2.5 + 2.5 + … acumule errores de coma flotante.
 */
export const roundTo = (n: number, precision: number) => Math.round(n / precision) * precision;

/** Suma `delta` al valor y lo deja redondeado y dentro de [min, max]. */
export const stepValue = (
  value: number,
  delta: number,
  min: number,
  max: number,
  precision: number,
) => clamp(roundTo(value + delta, precision), min, max);

/**
 * Convierte lo escrito en el teclado en un valor válido, o `null` si no es un número.
 * Acepta coma decimal ("82,5"), redondea a `precision` y limita a [min, max].
 */
export const parseInput = (text: string, min: number, max: number, precision: number) => {
  const trimmed = text.trim();
  const n = Number(trimmed.replace(',', '.'));
  if (trimmed === '' || !Number.isFinite(n)) return null;
  return clamp(roundTo(n, precision), min, max);
};
