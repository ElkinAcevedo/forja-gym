import type { ShapeData } from '../svg/Shape';

/** Íconos de los ajustes del Perfil (mockup), para `SettingRow`. */
export const SETTING_ICONS = {
  units: [{ kind: 'path', d: 'M4 7h16M4 12h10M4 17h7' }],
  increment: [{ kind: 'path', d: 'M2 12h20M5 8v8M8 6v12M16 6v12M19 8v8' }],
  autofill: [{ kind: 'path', d: 'M4 4v6h6M20 20v-6h-6M5 15a7 7 0 0012 3M19 9A7 7 0 007 6' }],
} satisfies Record<string, ShapeData[]>;
