import { StyleSheet, Text, View } from 'react-native';

import { color, font, radius, space } from '@/theme';

/** Aviso en lima en la parte superior de la pantalla. No pinta nada si no hay mensaje. */
export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <View style={styles.toast} accessibilityLiveRegion="polite" accessibilityRole="alert">
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    top: space.sm,
    left: space.screen,
    right: space.screen,
    padding: space.md,
    borderRadius: radius.button,
    backgroundColor: color.accent,
    elevation: 6,
    zIndex: 10,
  },
  text: { color: color.bg, fontSize: font.body, fontWeight: '700' },
});
