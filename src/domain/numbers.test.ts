import { parseInput, roundTo, stepValue } from './numbers';

const KG = { min: 0, max: 500, precision: 0.5 };

describe('roundTo', () => {
  it('redondea al múltiplo de 0.5 más cercano', () => {
    expect(roundTo(7.2, 0.5)).toBe(7);
    expect(roundTo(7.3, 0.5)).toBe(7.5);
    expect(roundTo(16, 0.5)).toBe(16);
  });
});

describe('stepValue', () => {
  it('no acumula errores de coma flotante al sumar muchas veces', () => {
    let kg = 0;
    for (let i = 0; i < 33; i++) kg = stepValue(kg, 2.5, KG.min, KG.max, KG.precision);
    expect(kg).toBe(82.5);
  });

  it('mantiene el resultado en múltiplos de 0.5', () => {
    expect(stepValue(80, 1.25, KG.min, KG.max, KG.precision)).toBe(81.5);
  });

  it('no baja del mínimo ni sube del máximo', () => {
    expect(stepValue(0, -2.5, KG.min, KG.max, KG.precision)).toBe(0);
    expect(stepValue(499, 2.5, KG.min, KG.max, KG.precision)).toBe(500);
  });
});

describe('parseInput', () => {
  const parseKg = (text: string) => parseInput(text, KG.min, KG.max, KG.precision);

  it('acepta coma o punto decimal y espacios', () => {
    expect(parseKg('82,5')).toBe(82.5);
    expect(parseKg(' 80 ')).toBe(80);
  });

  it('redondea los pesos a 0.5 y las reps a entero', () => {
    expect(parseKg('7.2')).toBe(7);
    expect(parseInput('8.6', 0, 100, 1)).toBe(9);
  });

  it('limita al rango permitido', () => {
    expect(parseKg('900')).toBe(500);
    expect(parseKg('-5')).toBe(0);
  });

  it('devuelve null si no es un número', () => {
    expect(parseKg('')).toBeNull();
    expect(parseKg('abc')).toBeNull();
  });
});
