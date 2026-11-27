import { StyleSheet, TextInput, type TextInputProps } from 'react-native';

import { color, font, radius, size, space } from '@/theme';

/** Campo de texto con el estilo de la app (buscador, nombre de un ejercicio…). */
export function TextField(props: TextInputProps) {
  return (
    <TextInput
      placeholderTextColor={color.textMuted}
      {...props}
      style={[styles.input, props.style]}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    height: size.control,
    paddingHorizontal: space.md,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.surface2,
    color: color.text,
    fontSize: font.body,
  },
});
