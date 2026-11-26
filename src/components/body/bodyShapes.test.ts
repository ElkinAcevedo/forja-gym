import { MUSCLES } from '@/db/seed/muscles';

import { MUSCLE_SHAPES } from './bodyShapes';

describe('dibujo del mapa muscular', () => {
  it.each(MUSCLES.map((m) => [m.id, m.view] as const))(
    '%s está dibujado en su vista (%s)',
    (id, view) => {
      expect(MUSCLE_SHAPES[view][id]?.length).toBeGreaterThan(0);
    },
  );
});
