import { Pressable, StyleSheet, Text } from 'react-native';

import { color, font, radius } from '@/theme';

type Props = {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'ghost';
  size?: 'md' | 'sm';
  disabled?: boolean;
};

export function Button({ title, onPress, variant = 'primary', size = 'md', disabled }: Props) {
  const ghost = variant === 'ghost';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        size === 'sm' && styles.sm,
        ghost ? styles.ghost : styles.primary,
        (pressed || disabled) && { opacity: disabled ? 0.4 : 0.8 },
      ]}>
      <Text style={[styles.text, size === 'sm' && styles.textSm, { color: ghost ? color.text : color.bg }]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: { height: 52, borderRadius: radius.button, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 16 },
  sm: { height: 44, borderRadius: 12 },
  primary: { backgroundColor: color.accent },
  ghost: { backgroundColor: color.surface2, borderWidth: 1, borderColor: color.line },
  text: { fontSize: font.md, fontWeight: '700' },
  textSm: { fontSize: font.sm },
});
