import { Pressable, StyleSheet, Text } from 'react-native';

import { color, font, radius } from '@/theme';

/**
 * default: etiqueta neutra · selected: opción elegida
 * primaryMuscle: músculo principal · secondaryMuscle: músculo secundario
 */
type Variant = 'default' | 'selected' | 'primaryMuscle' | 'secondaryMuscle';

type Props = {
  label: string;
  variant?: Variant;
  /** Si se pasa, el chip se comporta como botón seleccionable. */
  onPress?: () => void;
};

/** Etiqueta en forma de píldora: músculos, filtros y opciones. */
export function Chip({ label, variant = 'default', onPress }: Props) {
  const isButton = onPress !== undefined;

  return (
    <Pressable
      accessibilityRole={isButton ? 'button' : 'text'}
      accessibilityState={isButton ? { selected: variant === 'selected' } : undefined}
      disabled={!isButton}
      onPress={onPress}
      hitSlop={8}
      style={[styles.base, styles[variant]]}>
      <Text style={[styles.text, textStyle[variant]]}>{label}</Text>
    </Pressable>
  );
}

const textStyle = {
  default: { color: color.text },
  selected: { color: color.bg, fontWeight: '600' },
  primaryMuscle: { color: color.accent },
  secondaryMuscle: { color: color.textMuted },
} as const;

const styles = StyleSheet.create({
  base: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  default: { backgroundColor: color.surface2, borderColor: color.line },
  selected: { backgroundColor: color.accent, borderColor: color.accent },
  primaryMuscle: { backgroundColor: color.accentSoft, borderColor: 'transparent' },
  secondaryMuscle: { backgroundColor: 'transparent', borderColor: color.line },
  text: { fontSize: font.caption },
});
