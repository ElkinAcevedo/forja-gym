import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, font, space } from '@/theme';

import { StrokeIcon } from './icons/StrokeIcon';
import type { ShapeData } from './svg/Shape';

type Props = {
  icon: readonly ShapeData[];
  title: string;
  /** Qué hace el ajuste, en una línea. */
  description: string;
  /** El control del ajuste (Segmented, Switch…), a la derecha. */
  children: ReactNode;
  /** La última fila de una tarjeta no lleva línea separadora. */
  last?: boolean;
  /** Pone el control debajo del texto, para controles anchos (p. ej. 4 opciones). */
  stacked?: boolean;
};

/** Fila de un ajuste: ícono, título, explicación y su control. */
export function SettingRow({
  icon,
  title,
  description,
  children,
  last = false,
  stacked = false,
}: Props) {
  return (
    <View style={[styles.container, !last && styles.separator]}>
      <View style={styles.row}>
        <View style={styles.icon}>
          <StrokeIcon shapes={icon} size={18} color={color.accent} />
        </View>
        <View style={styles.text}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
        {!stacked && children}
      </View>
      {stacked && <View style={styles.below}>{children}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { paddingVertical: space.md, gap: space.md },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  below: { alignItems: 'flex-start', paddingLeft: 34 + space.md },
  separator: { borderBottomWidth: 1, borderBottomColor: color.line },
  icon: {
    width: 34,
    height: 34,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: color.surface2,
  },
  text: { flex: 1, gap: 2 },
  title: { color: color.text, fontSize: 14.5 },
  description: { color: color.textMuted, fontSize: font.caption },
});
