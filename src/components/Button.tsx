import { Pressable, StyleSheet, Text } from 'react-native';

import { color, font, radius, size } from '@/theme';

type Props = {
  title: string;
  onPress: () => void;
  /** primary: acción principal en lima · secondary: acción secundaria en gris. */
  variant?: 'primary' | 'secondary';
  size?: 'regular' | 'small';
  disabled?: boolean;
};

/** Botón de texto a todo el ancho disponible. */
export function Button({
  title,
  onPress,
  variant = 'primary',
  size: buttonSize = 'regular',
  disabled = false,
}: Props) {
  const isSmall = buttonSize === 'small';

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        isSmall && styles.small,
        styles[variant],
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}>
      <Text style={[styles.text, isSmall && styles.textSmall, textColor[variant]]}>{title}</Text>
    </Pressable>
  );
}

const textColor = {
  primary: { color: color.bg },
  secondary: { color: color.text },
} as const;

const styles = StyleSheet.create({
  base: {
    height: size.button,
    borderRadius: radius.button,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  small: { height: size.buttonSmall, borderRadius: radius.small },
  primary: { backgroundColor: color.accent },
  secondary: { backgroundColor: color.surface2, borderWidth: 1, borderColor: color.line },
  pressed: { opacity: 0.8 },
  disabled: { opacity: 0.4 },
  text: { fontSize: font.body, fontWeight: '700' },
  textSmall: { fontSize: font.label },
});
