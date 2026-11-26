import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Stepper } from '@/components/Stepper';
import { color, font, space } from '@/theme';

// Galería temporal de componentes base; en la Fase 1 se reemplaza por la pantalla Inicio.
export default function Index() {
  const [kg, setKg] = useState(80);
  const [reps, setReps] = useState(8);
  const [done, setDone] = useState(false);
  const [goal, setGoal] = useState<'fue' | 'hip' | 'res'>('hip');

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>
          FOR<Text style={{ color: color.accent }}>JA</Text>
        </Text>
        <Text style={styles.sub}>Componentes base</Text>

        <Card hero style={styles.gap}>
          <Text style={styles.muted}>Press de banca · Barra</Text>
          <View style={styles.row}>
            <Chip label="Pecho" variant="muscle" />
            <Chip label="Tríceps" variant="muted" />
            <Chip label="Hombros" variant="muted" />
          </View>
        </Card>

        <Card style={styles.gap}>
          <Text style={styles.muted}>Serie 1</Text>
          <View style={styles.row}>
            <View style={styles.flex}>
              <Stepper label="Peso" value={kg} onChange={setKg} step={2.5} max={500} precision={0.5} unit="kg" done={done} />
            </View>
            <View style={styles.flex}>
              <Stepper label="Repeticiones" value={reps} onChange={setReps} step={1} max={100} done={done} />
            </View>
          </View>
          <Button title={done ? 'Serie hecha ✓' : 'Confirmar serie'} onPress={() => setDone(!done)} />
        </Card>

        <Card style={styles.gap}>
          <Text style={styles.muted}>Objetivo</Text>
          <View style={styles.row}>
            <Chip label="Fuerza" variant={goal === 'fue' ? 'on' : 'default'} onPress={() => setGoal('fue')} />
            <Chip label="Hipertrofia" variant={goal === 'hip' ? 'on' : 'default'} onPress={() => setGoal('hip')} />
            <Chip label="Resistencia" variant={goal === 'res' ? 'on' : 'default'} onPress={() => setGoal('res')} />
          </View>
          <Button title="+ Serie (copia la anterior)" variant="ghost" size="sm" onPress={() => {}} />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: { padding: space.screen, gap: space.gap },
  logo: { color: color.text, fontSize: 40, fontWeight: '800', letterSpacing: -1, marginTop: 8 },
  sub: { color: color.textMuted, fontSize: font.sm, marginBottom: 8 },
  gap: { gap: 12 },
  row: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  flex: { flex: 1 },
  muted: { color: color.textMuted, fontSize: font.xs },
});
