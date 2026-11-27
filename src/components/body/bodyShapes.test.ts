import { MUSCLES } from '@/db/seed/muscles';

import { MUSCLE_DRAWINGS, muscleLayers } from './bodyShapes';

describe('dibujo del mapa muscular', () => {
  it.each(MUSCLES.map((m) => [m.id, m.view] as const))(
    '%s está dibujado en su vista (%s)',
    (id, view) => {
      expect(MUSCLE_DRAWINGS[view][id]?.paths.length).toBeGreaterThan(0);
    },
  );
});

describe('muscleLayers', () => {
  it('junta en una capa por color todos los trazados de la vista', () => {
    const layers = muscleLayers('front', (id) => (id === 'pecho' ? 'lima' : 'gris'));
    expect(layers.map((l) => l.fill)).toEqual(['gris', 'lima']);

    const all = Object.values(MUSCLE_DRAWINGS.front).flatMap((m) => m?.paths ?? []);
    const drawn = layers.flatMap((l) => l.d.split(' M').length);
    expect(drawn.reduce((a, b) => a + b, 0)).toBe(all.length);
    expect(layers[1].d).toBe(MUSCLE_DRAWINGS.front.pecho?.paths.join(' '));
    expect(layers[1].mirroredD).toBe(layers[1].d); // el pecho es par: se refleja
  });
});
