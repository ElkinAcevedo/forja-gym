import { adjustRest, restSecondsFor } from './rest';

describe('restSecondsFor', () => {
  it('los accesorios usan el descanso general del perfil', () => {
    expect(restSecondsFor(90, false, null)).toBe(90);
  });

  it('los compuestos descansan un minuto más', () => {
    expect(restSecondsFor(90, true, null)).toBe(150);
  });

  it('si el usuario eligió un descanso para el ejercicio, se usa ese', () => {
    expect(restSecondsFor(90, true, 180)).toBe(180);
    expect(restSecondsFor(90, false, 45)).toBe(45);
  });
});

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
