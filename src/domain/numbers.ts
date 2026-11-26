const round2 = (n: number) => Math.round(n * 100) / 100;
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

// Redondea a 2 decimales para que 2.5 + 2.5 + … no acumule errores de coma flotante.
export const stepValue = (value: number, delta: number, min: number, max: number) =>
  clamp(round2(value + delta), min, max);

// Texto del teclado → número válido, o null si no lo es. Acepta coma decimal ("82,5").
export const parseInput = (text: string, min: number, max: number, decimals: boolean) => {
  const n = Number(text.trim().replace(',', '.'));
  if (text.trim() === '' || !Number.isFinite(n)) return null;
  return clamp(decimals ? round2(n) : Math.round(n), min, max);
};
