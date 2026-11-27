import { StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { color, font, space } from '@/theme';

type Props = {
  title: string;
  /** Fase del cronograma en la que se construye la pantalla. */
  phase: number;
  description: string;
};

/** Pantalla provisional para las secciones que llegan en fases posteriores del cronograma. */
export function ComingSoon({ title, phase, description }: Props) {
  return (
    <SafeAreaView style={styles.screen}>
      <Text style={styles.title}>{title}</Text>
      <View style={styles.center}>
        <Text style={styles.phase}>Llega en la Fase {phase}</Text>
        <Text style={styles.description}>{description}</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, padding: space.screen, backgroundColor: color.bg },
  title: { color: color.text, fontSize: font.title, fontWeight: '800', letterSpacing: -0.5 },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: space.sm },
  phase: { color: color.accent, fontSize: font.body, fontWeight: '700' },
  description: { color: color.textMuted, fontSize: font.label, textAlign: 'center' },
});
