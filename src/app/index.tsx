import { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BodyMap } from '@/components/body/BodyMap';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { ExerciseThumb } from '@/components/ExerciseThumb';
import { Stepper } from '@/components/Stepper';
import { EXERCISE_LIST, exerciseById } from '@/db/seed/exercises';
import { MUSCLES, type MuscleId } from '@/db/seed/muscles';
import { DAY_TEMPLATES } from '@/db/seed/templates';
import { LIMITS } from '@/domain/limits';
import { combineMuscles } from '@/domain/muscles';
import { color, font, space } from '@/theme';

// Datos de ejemplo tomados del catálogo; la Fase 1 los leerá de la base de datos.
const PUSH_DAY = DAY_TEMPLATES[0];
const pushMuscles = combineMuscles(PUSH_DAY.exercises.map(exerciseById));
const muscleName = (id: MuscleId) => MUSCLES.find((m) => m.id === id)?.name ?? id;

/**
 * Galería temporal para probar los componentes base en el móvil.
 * Se reemplaza por la pantalla Inicio en la Fase 1.
 */
export default function ComponentGallery() {
  const [kg, setKg] = useState(80);
  const [reps, setReps] = useState(8);
  const [done, setDone] = useState(false);
  const [muscle, setMuscle] = useState<MuscleId | null>('pecho');

  const toggleMuscle = (id: MuscleId) => setMuscle((current) => (current === id ? null : id));
  const filtered = EXERCISE_LIST.filter(
    (e) => !muscle || e.primary.includes(muscle) || e.secondary.includes(muscle),
  );

  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.logo}>
          FOR<Text style={styles.logoAccent}>JA</Text>
        </Text>
        <Text style={styles.subtitle}>Componentes base</Text>

        <Card hero style={styles.cardContent}>
          <Text style={styles.caption}>Hoy · {PUSH_DAY.focus}</Text>
          <Text style={styles.heading}>{PUSH_DAY.name}</Text>
          <View style={styles.bodies}>
            <BodyMap view="front" height={150} {...pushMuscles} />
            <BodyMap view="back" height={150} {...pushMuscles} />
          </View>
          <View style={styles.row}>
            {pushMuscles.primary.map((id) => (
              <Chip key={id} label={muscleName(id)} variant="primaryMuscle" />
            ))}
            {pushMuscles.secondary.map((id) => (
              <Chip key={id} label={muscleName(id)} variant="secondaryMuscle" />
            ))}
          </View>
        </Card>

        <Card style={styles.cardContent}>
          <Text style={styles.caption}>Toca el músculo que quieres trabajar</Text>
          <View style={styles.bodies}>
            <BodyMap
              view="front"
              height={165}
              primary={muscle ? [muscle] : []}
              selected={muscle}
              onPressMuscle={toggleMuscle}
            />
            <BodyMap
              view="back"
              height={165}
              primary={muscle ? [muscle] : []}
              selected={muscle}
              onPressMuscle={toggleMuscle}
            />
          </View>
          <View style={styles.grid}>
            {filtered.map((e) => (
              <View key={e.id} style={styles.gridItem}>
                <ExerciseThumb
                  primary={e.primary}
                  secondary={e.secondary}
                  equipment={e.equipment}
                  size={96}
                />
                <Text style={styles.exerciseName}>{e.name}</Text>
              </View>
            ))}
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
                {...LIMITS.weightKg}
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
                {...LIMITS.reps}
                done={done}
              />
            </View>
          </View>
          <Button
            title={done ? 'Serie hecha ✓' : 'Confirmar serie'}
            onPress={() => setDone(!done)}
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
  heading: { color: color.text, fontSize: font.display, fontWeight: '800' },
  cardContent: { gap: space.md },
  bodies: { flexDirection: 'row', justifyContent: 'center', gap: space.lg },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.gap },
  gridItem: { width: 96, gap: space.xs },
  exerciseName: { color: color.textMuted, fontSize: font.tiny, textAlign: 'center' },
  fill: { flex: 1 },
  caption: { color: color.textMuted, fontSize: font.caption },
});
