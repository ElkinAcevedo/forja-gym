import type { EquipmentId } from '@/db/seed/equipment';

import type { ShapeData } from '../svg/Shape';
import { StrokeIcon } from './StrokeIcon';

/** Íconos de equipo del mockup. */
const ICONS: Record<EquipmentId, ShapeData[]> = {
  barra: [{ kind: 'path', d: 'M2 12h20M5 8v8M8 6v12M16 6v12M19 8v8' }],
  mancuernas: [{ kind: 'path', d: 'M8 12h8M5 8v8M8 7v10M16 7v10M19 8v8' }],
  maquina: [
    { kind: 'rect', x: 4, y: 3, width: 4, height: 18, rx: 1 },
    { kind: 'path', d: 'M8 7h11M8 12h7M15 12v8M11 20h9' },
  ],
  polea: [
    { kind: 'path', d: 'M5 3h14M12 3v3' },
    { kind: 'circle', cx: 12, cy: 8.5, r: 2.5 },
    { kind: 'path', d: 'M12 11v7M8.5 18h7' },
  ],
  // Barra guiada entre dos rieles.
  smith: [{ kind: 'path', d: 'M5 3v18M19 3v18M2 11h20M8 9v4M16 9v4' }],
  corporal: [
    { kind: 'circle', cx: 12, cy: 4.5, r: 2 },
    { kind: 'path', d: 'M12 7v7M7 10h10M12 14l-3 6M12 14l3 6' },
  ],
};

type Props = { equipment: EquipmentId; size: number; color: string };

/** Ícono del tipo de equipo (barra, mancuernas, máquina, polea, Smith, peso corporal). */
export function EquipmentIcon({ equipment, size, color }: Props) {
  return <StrokeIcon shapes={ICONS[equipment]} size={size} color={color} />;
}
