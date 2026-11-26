/**
 * Dibujo del cuerpo del mapa muscular (mockup aprobado), en un lienzo de 100 × 172.
 * Cada músculo es una lista de figuras; casi todos son pares izquierda/derecha.
 */
import type { BodyView } from '@/domain/enums';
import type { MuscleId } from '@/db/seed/muscles';

import type { ShapeData } from '../svg/Shape';

export const BODY_VIEWBOX = { width: 100, height: 172 } as const;

const ellipse = (cx: number, cy: number, rx: number, ry: number): ShapeData => ({
  kind: 'ellipse',
  cx,
  cy,
  rx,
  ry,
});
const circle = (cx: number, cy: number, r: number): ShapeData => ({ kind: 'circle', cx, cy, r });
const rect = (x: number, y: number, width: number, height: number, rx: number): ShapeData => ({
  kind: 'rect',
  x,
  y,
  width,
  height,
  rx,
});
const path = (d: string): ShapeData => ({ kind: 'path', d });

/** Silueta neutra sobre la que se pintan los músculos: cabeza, cuello, manos, cadera, rodillas, pies. */
export const BODY_BASE: ShapeData[] = [
  circle(50, 13, 8.5),
  rect(45.5, 20, 9, 8, 2),
  circle(23.5, 86, 3.5),
  circle(76.5, 86, 3.5),
  path('M39 82H61L58 92L50 95L42 92Z'),
  circle(43, 131.5, 3.5),
  circle(57, 131.5, 3.5),
  ellipse(43, 167, 4.5, 2.6),
  ellipse(57, 167, 4.5, 2.6),
];

const shoulders = [ellipse(32, 37, 7, 6.5), ellipse(68, 37, 7, 6.5)];
const upperArms = [ellipse(28, 52, 4.6, 9), ellipse(72, 52, 4.6, 9)];
const forearms = [ellipse(25, 72, 4, 10), ellipse(75, 72, 4, 10)];

/** Músculos visibles en cada vista. Hombros y antebrazos aparecen en las dos. */
export const MUSCLE_SHAPES: Record<BodyView, Partial<Record<MuscleId, ShapeData[]>>> = {
  front: {
    hombros: shoulders,
    pecho: [
      path('M38 32C44 30 49 31 49.3 34V49C44 52 39 50 37.5 46C36.5 41 36.5 36 38 32Z'),
      path('M62 32C56 30 51 31 50.7 34V49C56 52 61 50 62.5 46C63.5 41 63.5 36 62 32Z'),
    ],
    biceps: upperArms,
    antebrazos: forearms,
    abs: [rect(43.5, 52, 13, 29, 4)],
    oblicuos: [
      path('M37.5 50L42.5 53V80L39 78C36.5 68 36.5 58 37.5 50Z'),
      path('M62.5 50L57.5 53V80L61 78C63.5 68 63.5 58 62.5 50Z'),
    ],
    cuadriceps: [ellipse(42.5, 111, 7, 18), ellipse(57.5, 111, 7, 18)],
    gemelos: [ellipse(43, 150, 4.3, 13), ellipse(57, 150, 4.3, 13)],
  },
  back: {
    trapecio: [path('M44 24H56L67 32L58 39L50 49L42 39L33 32Z')],
    hombros: shoulders,
    dorsales: [
      path('M37 40L42 41L49.3 52V70L42 67C38 60 36 50 37 40Z'),
      path('M63 40L58 41L50.7 52V70L58 67C62 60 64 50 63 40Z'),
    ],
    triceps: upperArms,
    antebrazos: forearms,
    lumbar: [rect(43, 70, 14, 12, 3)],
    gluteos: [ellipse(44, 91, 7, 8.5), ellipse(56, 91, 7, 8.5)],
    isquios: [ellipse(42.5, 116, 6.5, 15), ellipse(57.5, 116, 6.5, 15)],
    gemelos: [ellipse(43, 147, 5, 12), ellipse(57, 147, 5, 12)],
  },
};

/** Líneas que marcan los cuadros del abdomen en la vista frontal. */
export const ABS_LINES = 'M50 53v27M44 61h12M44 70h12';
