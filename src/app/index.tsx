import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { Stepper } from '@/components/Stepper';
import { color, font, space } from '@/theme';

type Goal = 'strength' | 'hypertrophy' | 'endurance';

const GOALS: { id: Goal; label: string }[] = [
  { id: 'strength', label: 'Fuerza' },
  { id: 'hypertrophy', label: 'Hipertrofia' },
  { id: 'endurance', label: 'Resistencia' },
];

/**
 * Galería temporal para probar los componentes base en el móvil.
 * Se reemplaza por la pantalla Inicio en la Fase 1.
 */
export default function ComponentGallery() {
  const [kg, setKg] = useState(80);
  const [reps, setReps] = useState(8);
  const [done, setDone] = useState(false);
  const [goal, setGoal] = useState<Goal>('hypertrophy');

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>
          FOR<Text style={styles.logoAccent}>JA</Text>
        </Text>
        <Text style={styles.subtitle}>Componentes base</Text>

        <Card hero style={styles.cardContent}>
          <Text style={styles.caption}>Press de banca · Barra</Text>
          <View style={styles.row}>
            <Chip label="Pecho" variant="primaryMuscle" />
            <Chip label="Tríceps" variant="secondaryMuscle" />
            <Chip label="Hombros" variant="secondaryMuscle" />
          </View>
        </Card>

        <Card style={styles.cardContent}>
          <Text style={styles.caption}>Serie 1</Text>
          <View style={styles.row}>
            <View style={styles.fill}>
              <Stepper
                label="Peso"
                value={kg}
                onChange={setKg}
                step={2.5}
                max={500}
                precision={0.5}
                unit="kg"
                done={done}
              />
            </View>
            <View style={styles.fill}>
              <Stepper
                label="Repeticiones"
                value={reps}
                onChange={setReps}
                step={1}
                max={100}
                done={done}
              />
            </View>
          </View>
          <Button
            title={done ? 'Serie hecha ✓' : 'Confirmar serie'}
            onPress={() => setDone(!done)}
          />
        </Card>

        <Card style={styles.cardContent}>
          <Text style={styles.caption}>Objetivo</Text>
          <View style={styles.row}>
            {GOALS.map(({ id, label }) => (
              <Chip
                key={id}
                label={label}
                variant={goal === id ? 'selected' : 'default'}
                onPress={() => setGoal(id)}
              />
            ))}
          </View>
          <Button
            title="+ Serie (copia la anterior)"
            variant="secondary"
            size="small"
            onPress={() => {}}
          />
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: { padding: space.screen, gap: space.gap },
  logo: {
    color: color.text,
    fontSize: 40,
    fontWeight: '800',
    letterSpacing: -1,
    marginTop: space.sm,
  },
  logoAccent: { color: color.accent },
  subtitle: { color: color.textMuted, fontSize: font.label, marginBottom: space.sm },
  cardContent: { gap: space.md },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  fill: { flex: 1 },
  caption: { color: color.textMuted, fontSize: font.caption },
});
