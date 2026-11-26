import type { ColorValue } from 'react-native';

import type { ShapeData } from '../svg/Shape';
import { StrokeIcon } from './StrokeIcon';

/** Íconos de la barra de navegación (mockup). */
const ICONS = {
  home: [{ kind: 'path', d: 'M3 11l9-7 9 7v9a1 1 0 01-1 1h-5v-6H9v6H4a1 1 0 01-1-1z' }],
  routines: [
    { kind: 'rect', x: 4, y: 3, width: 16, height: 18, rx: 2 },
    { kind: 'path', d: 'M8 8h8M8 12h8M8 16h5' },
  ],
  train: [{ kind: 'path', d: 'M12 5v14M5 12h14' }],
  progress: [{ kind: 'path', d: 'M3 20h18M6 16l4-5 4 3 6-8' }],
  profile: [
    { kind: 'circle', cx: 12, cy: 8, r: 4 },
    { kind: 'path', d: 'M4 21c1-4 4-6 8-6s7 2 8 6' },
  ],
} satisfies Record<string, ShapeData[]>;

export type NavIconName = keyof typeof ICONS;

type Props = { name: NavIconName; size: number; color: ColorValue };

/** Ícono de una pestaña de la barra de navegación. */
export function NavIcon({ name, size, color }: Props) {
  return <StrokeIcon shapes={ICONS[name]} size={size} color={color} />;
}
