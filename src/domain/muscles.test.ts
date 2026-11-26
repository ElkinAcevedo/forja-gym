import { combineMuscles } from './muscles';

describe('combineMuscles', () => {
  it('une los principales sin repetir y conserva el orden', () => {
    const result = combineMuscles([
      { primary: ['pecho'], secondary: ['triceps'] },
      { primary: ['hombros', 'pecho'], secondary: [] },
    ]);
    expect(result.primary).toEqual(['pecho', 'hombros']);
  });

  it('no marca como secundario un músculo que es principal en otro ejercicio', () => {
    const result = combineMuscles([
      { primary: ['pecho'], secondary: ['triceps', 'hombros'] },
      { primary: ['triceps'], secondary: ['hombros'] },
    ]);
    expect(result).toEqual({ primary: ['pecho', 'triceps'], secondary: ['hombros'] });
  });

  it('devuelve listas vacías si no hay ejercicios', () => {
    expect(combineMuscles([])).toEqual({ primary: [], secondary: [] });
  });
});
