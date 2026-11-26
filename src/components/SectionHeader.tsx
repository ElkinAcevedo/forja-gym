import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, font, space } from '@/theme';

type Props = {
  title: string;
  /** Enlace opcional a la derecha, p. ej. "Ver progreso". */
  action?: { label: string; onPress: () => void };
};

/** Título de sección en mayúsculas pequeñas, como en el mockup. */
export function SectionHeader({ title, action }: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
      {action && (
        <Pressable accessibilityRole="link" onPress={action.onPress} hitSlop={8}>
          <Text style={styles.action}>{action.label}</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: space.lg,
  },
  title: {
    color: color.textMuted,
    fontSize: font.tiny,
    fontWeight: '600',
    letterSpacing: 1.1,
    textTransform: 'uppercase',
  },
  action: { color: color.accent, fontSize: font.caption },
});
