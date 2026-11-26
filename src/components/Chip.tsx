import { Pressable, StyleSheet, Text } from 'react-native';

import { color, font, radius } from '@/theme';

// on: seleccionado · muscle: músculo principal · muted: músculo secundario
type Variant = 'default' | 'on' | 'muscle' | 'muted';

type Props = { label: string; variant?: Variant; onPress?: () => void };

export function Chip({ label, variant = 'default', onPress }: Props) {
  const v = variants[variant];
  return (
    <Pressable
      accessibilityRole={onPress ? 'button' : 'text'}
      accessibilityState={onPress ? { selected: variant === 'on' } : undefined}
      disabled={!onPress}
      onPress={onPress}
      hitSlop={8}
      style={[styles.base, { backgroundColor: v.bg, borderColor: v.border }]}>
      <Text style={[styles.text, { color: v.text, fontWeight: variant === 'on' ? '600' : '400' }]}>{label}</Text>
    </Pressable>
  );
}

const variants: Record<Variant, { bg: string; border: string; text: string }> = {
  default: { bg: color.surface2, border: color.line, text: color.text },
  on: { bg: color.accent, border: color.accent, text: color.bg },
  muscle: { bg: color.accentSoft, border: 'transparent', text: color.accent },
  muted: { bg: 'transparent', border: color.line, text: color.textMuted },
};

const styles = StyleSheet.create({
  base: { alignSelf: 'flex-start', paddingVertical: 6, paddingHorizontal: 12, borderRadius: radius.pill, borderWidth: 1 },
  text: { fontSize: font.xs },
});
