import { adjustRest } from './rest';

describe('adjustRest', () => {
  it('suma y resta de 15 en 15 segundos', () => {
    expect(adjustRest(90, 15)).toBe(105);
    expect(adjustRest(90, -15)).toBe(75);
  });

  it('no baja de 15 s ni pasa de 10 min', () => {
    expect(adjustRest(15, -15)).toBe(15);
    expect(adjustRest(600, 15)).toBe(600);
  });
});
