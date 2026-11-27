import type { GestureResponderEvent } from 'react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { color } from '@/theme';

import { NavIcon } from './icons/NavIcon';

const SIZE = 56;
const LIFT = 22; // cuánto sobresale por encima de la barra

type Props = { onPress?: (event: GestureResponderEvent) => void };

/**
 * Botón central "Entrenar" de la barra de navegación: grande, en lima y elevado,
 * para llegar a registrar una serie con un solo toque desde cualquier pantalla.
 */
export function TrainTabButton({ onPress }: Props) {
  return (
    <View style={styles.slot}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Entrenar"
        onPress={onPress}
        style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
        <NavIcon name="train" size={28} color={color.bg} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  slot: { flex: 1, alignItems: 'center' },
  button: {
    width: SIZE,
    height: SIZE,
    marginTop: -LIFT,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.accent,
    // Brillo lima del mockup (sombra en iOS, elevación en Android).
    shadowColor: color.accent,
    shadowOpacity: 0.35,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  pressed: { opacity: 0.85 },
});
