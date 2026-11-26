import { buildAssistantOptions, DAYS_PER_WEEK, spreadOverWeek } from './assistant';
import { PROGRAMS } from './templates';

const trainingDays = (week: readonly string[]) => week.filter((day) => day !== 'rest').length;

describe('spreadOverWeek', () => {
  it('deja un descanso entre sesiones cuando hay pocos días', () => {
    expect(spreadOverWeek(['push', 'pull', 'legs'])).toEqual([
      'push',
      'rest',
      'pull',
      'rest',
      'legs',
      'rest',
      'rest',
    ]);
  });

  it('rechaza un número de sesiones que el asistente no ofrece', () => {
    expect(() => spreadOverWeek(['full'])).toThrow();
  });
});

describe('buildAssistantOptions', () => {
  it.each(PROGRAMS.flatMap((p) => DAYS_PER_WEEK.map((days) => [p.id, days] as const)))(
    '%s con %i días: opciones de 7 días con ese número de entrenamientos',
    (programId, days) => {
      const options = buildAssistantOptions(programId, days);
      expect(options.length).toBeGreaterThan(0);
      for (const option of options) {
        expect(option.week).toHaveLength(7);
        expect(trainingDays(option.week)).toBe(days);
      }
    },
  );

  it('propone Upper / Lower como alternativa con 4 o más días', () => {
    const names = buildAssistantOptions('bro', 5).map((o) => o.name);
    expect(names).toEqual(['Bro Split · 5 días', 'Upper / Lower']);
  });

  it('propone Full Body como alternativa con 3 o menos días', () => {
    const names = buildAssistantOptions('ul', 3).map((o) => o.name);
    expect(names).toEqual(['Upper / Lower · 3 días', 'Full Body']);
  });
});
