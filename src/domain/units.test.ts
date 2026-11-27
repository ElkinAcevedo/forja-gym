import {
  formatVolume,
  formatWeight,
  fromDisplayWeight,
  incrementFor,
  MAX_WEIGHT,
  toDisplayWeight,
} from './units';

describe('conversión de pesos', () => {
  it('en kg no cambia nada', () => {
    expect(toDisplayWeight(82.5, 'kg')).toBe(82.5);
    expect(fromDisplayWeight(82.5, 'kg')).toBe(82.5);
  });

  it('muestra los kilos en libras redondeadas a 0.5', () => {
    expect(toDisplayWeight(80, 'lb')).toBe(176.5); // 176.37
    expect(toDisplayWeight(100, 'lb')).toBe(220.5); // 220.46
  });

  it('un peso escrito en libras se vuelve a mostrar igual', () => {
    for (const lb of [45, 135, 185, 225, 22.5, 7.5]) {
      expect(toDisplayWeight(fromDisplayWeight(lb, 'lb'), 'lb')).toBe(lb);
    }
  });

  it('el máximo en libras no supera el máximo de la base de datos', () => {
    expect(fromDisplayWeight(MAX_WEIGHT.lb, 'lb')).toBeLessThanOrEqual(500);
  });
});

describe('incrementFor', () => {
  it('la misma opción equivale en las dos unidades', () => {
    expect(incrementFor(1, 'kg')).toBe(1);
    expect(incrementFor(1, 'lb')).toBe(2.5);
    expect(incrementFor(2.5, 'lb')).toBe(5);
    expect(incrementFor(5, 'lb')).toBe(10);
  });
});

describe('formatos', () => {
  it('peso con su unidad', () => {
    expect(formatWeight(80, 'kg')).toBe('80 kg');
    expect(formatWeight(80, 'lb')).toBe('176.5 lb');
    expect(formatWeight(15, 'kg', true)).toBe('15 kg c/u');
  });

  it('volumen en miles', () => {
    expect(formatVolume(18400, 'kg')).toBe('18.4 t');
    expect(formatVolume(18400, 'lb')).toBe('40.6k lb');
  });
});
