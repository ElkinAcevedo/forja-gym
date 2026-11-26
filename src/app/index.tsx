import { StyleSheet, Text, View } from 'react-native';

import { color, font } from '@/theme';

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>
        FOR<Text style={{ color: color.accent }}>JA</Text>
      </Text>
      <Text style={styles.sub}>Fase 0 · proyecto listo</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: color.bg },
  logo: { color: color.text, fontSize: 48, fontWeight: '800', letterSpacing: -1 },
  sub: { color: color.textMuted, fontSize: font.sm, marginTop: 8 },
});
