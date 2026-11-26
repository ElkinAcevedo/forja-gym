import { StyleSheet, Text, View } from 'react-native';

import { color, font, space } from '@/theme';

type Props = {
  label: string;
  value: string;
  /** Pinta el valor en lima, p. ej. cuando algo sube. */
  highlight?: boolean;
  /** Valor más pequeño, para filas de tres casillas con textos largos. */
  compact?: boolean;
};

/** Casilla con una cifra destacada y su etiqueta (sesiones, volumen, récords…). */
export function StatTile({ label, value, highlight = false, compact = false }: Props) {
  return (
    <View style={styles.tile} accessible accessibilityLabel={`${label}: ${value}`}>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, compact && styles.compact, highlight && styles.highlight]}>
        {value}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    flex: 1,
    padding: space.md,
    gap: space.xs,
    backgroundColor: color.surface1,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: color.line,
  },
  label: { color: color.textMuted, fontSize: font.tiny },
  value: { color: color.text, fontSize: font.value, fontWeight: '700' },
  compact: { fontSize: font.label },
  highlight: { color: color.accent },
});
