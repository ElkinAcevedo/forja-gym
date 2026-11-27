import { combineMuscles } from './muscles';

describe('combineMuscles', () => {
  it('une los principales sin repetir y conserva el orden', () => {
    const result = combineMuscles([
      { primary: ['pecho'], secondary: ['triceps'] },
      { primary: ['deltoide_anterior', 'pecho'], secondary: [] },
    ]);
    expect(result.primary).toEqual(['pecho', 'deltoide_anterior']);
  });

  it('no marca como secundario un músculo que es principal en otro ejercicio', () => {
    const result = combineMuscles([
      { primary: ['pecho'], secondary: ['triceps', 'deltoide_anterior'] },
      { primary: ['triceps'], secondary: ['deltoide_anterior'] },
    ]);
    expect(result).toEqual({ primary: ['pecho', 'triceps'], secondary: ['deltoide_anterior'] });
  });

  it('devuelve listas vacías si no hay ejercicios', () => {
    expect(combineMuscles([])).toEqual({ primary: [], secondary: [] });
  });
});
