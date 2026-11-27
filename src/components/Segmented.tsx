import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, radius, space } from '@/theme';

type Option<T> = { value: T; label: string };

type Props<T> = {
  options: readonly Option<T>[];
  value: T;
  onChange: (value: T) => void;
  /** Nombre del grupo para lectores de pantalla, p. ej. "Unidades". */
  label: string;
  /** full: ocupa todo el ancho (objetivo) · compact: pequeño, a la derecha de un ajuste. */
  variant?: 'full' | 'compact';
};

/** Selector de una opción entre varias, con la elegida resaltada. */
export function Segmented<T extends string | number>({
  options,
  value,
  onChange,
  label,
  variant = 'compact',
}: Props<T>) {
  const compact = variant === 'compact';
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={label}
      style={[styles.group, compact ? styles.groupCompact : styles.groupFull]}>
      {options.map((option) => {
        const selected = option.value === value;
        return (
          <Pressable
            key={String(option.value)}
            accessibilityRole="radio"
            accessibilityState={{ checked: selected }}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              compact ? styles.optionCompact : styles.optionFull,
              selected && (compact ? styles.selectedCompact : styles.selectedFull),
            ]}>
            <Text
              style={[
                styles.text,
                compact && styles.textCompact,
                selected && (compact ? styles.textSelectedCompact : styles.textSelectedFull),
              ]}>
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  group: { flexDirection: 'row' },
  groupFull: {
    padding: space.xs,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.surface1,
  },
  groupCompact: { padding: 3, borderRadius: 10, backgroundColor: color.surface2 },
  option: { alignItems: 'center', justifyContent: 'center' },
  optionFull: { flex: 1, height: 38, borderRadius: 10 },
  optionCompact: { minHeight: 32, paddingHorizontal: 10, borderRadius: 8 },
  selectedFull: { backgroundColor: color.surface2 },
  selectedCompact: { backgroundColor: color.accent },
  text: { color: color.textMuted, fontSize: font.label, fontWeight: '600' },
  textCompact: { fontSize: font.caption },
  textSelectedFull: { color: color.text },
  textSelectedCompact: { color: color.bg },
});
