import { MUSCLES } from '@/db/seed/muscles';

import { MUSCLE_DRAWINGS } from './bodyShapes';

describe('dibujo del mapa muscular', () => {
  it.each(MUSCLES.map((m) => [m.id, m.view] as const))(
    '%s está dibujado en su vista (%s)',
    (id, view) => {
      expect(MUSCLE_DRAWINGS[view][id]?.paths.length).toBeGreaterThan(0);
    },
  );
});
