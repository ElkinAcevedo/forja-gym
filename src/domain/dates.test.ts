import { formatLongDate, startOfWeek, weekDates, weekdayIndex } from './dates';

// Jueves 26 de noviembre de 2026, a media tarde (hora local).
const THURSDAY = new Date(2026, 10, 26, 18, 30);

describe('fechas de la semana', () => {
  it('cuenta los días desde el lunes', () => {
    expect(weekdayIndex(THURSDAY)).toBe(3);
    expect(weekdayIndex(new Date(2026, 10, 29))).toBe(6); // domingo
    expect(weekdayIndex(new Date(2026, 10, 23))).toBe(0); // lunes
  });

  it('la semana empieza el lunes a medianoche', () => {
    expect(startOfWeek(THURSDAY)).toEqual(new Date(2026, 10, 23));
  });

  it('un domingo pertenece a la semana que empezó el lunes anterior', () => {
    expect(startOfWeek(new Date(2026, 10, 29, 23, 0))).toEqual(new Date(2026, 10, 23));
  });

  it('devuelve los 7 días aunque la semana cambie de mes', () => {
    const days = weekDates(new Date(2026, 11, 2)); // miércoles 2 de diciembre
    expect(days.map((d) => d.getDate())).toEqual([30, 1, 2, 3, 4, 5, 6]);
  });

  it('escribe la fecha larga en español', () => {
    expect(formatLongDate(THURSDAY)).toBe('Jueves, 26 de noviembre');
  });
});
