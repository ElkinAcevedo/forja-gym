import { isNewRecord } from './records';

describe('isNewRecord', () => {
  it('es récord si supera el mejor peso anterior', () => {
    expect(isNewRecord(82.5, 80)).toBe(true);
  });

  it('igualar el récord no cuenta', () => {
    expect(isNewRecord(80, 80)).toBe(false);
  });

  it('la primera vez que se hace un ejercicio no es récord', () => {
    expect(isNewRecord(80, null)).toBe(false);
  });

  it('una serie sin peso (por tiempo o distancia) no es récord de peso', () => {
    expect(isNewRecord(null, 80)).toBe(false);
  });
});
