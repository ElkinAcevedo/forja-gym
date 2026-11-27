import { StyleSheet, Text, View } from 'react-native';

import { EQUIPMENT } from '@/db/seed/equipment';
import type { WeightUnit } from '@/domain/enums';
import { formatSet } from '@/domain/format';
import { formatScheme } from '@/domain/training';
import { formatWeight } from '@/domain/units';
import type { WorkoutExercise } from '@/services/session';
import { color, font, space } from '@/theme';

import { Card } from '../Card';
import { ExerciseThumb } from '../ExerciseThumb';
import { MuscleChips } from '../MuscleChips';
import { StatTile } from '../StatTile';

/** Mejor serie de la última sesión: la de más peso (o la primera, si no hay peso). */
function topSet(exercise: WorkoutExercise) {
  const sets = exercise.lastSession;
  if (sets.length === 0) return null;
  return sets.reduce((best, s) => ((s.weightKg ?? 0) > (best.weightKg ?? 0) ? s : best));
}

/** Ficha del ejercicio que se registra: imagen, músculos, última vez, récord y objetivo. */
export function ExerciseSummary({
  exercise,
  unit,
}: {
  exercise: WorkoutExercise;
  unit: WeightUnit;
}) {
  const { card } = exercise;
  const last = topSet(exercise);
  const equipment = EQUIPMENT.find((e) => e.id === card.equipmentId)?.name ?? '';

  return (
    <Card style={styles.card}>
      <View style={styles.top}>
        <ExerciseThumb
          primary={card.primary}
          secondary={card.secondary}
          equipment={card.equipmentId}
          size={88}
        />
        <View style={styles.info}>
          <Text style={styles.muted}>{equipment}</Text>
          <Text style={styles.name}>{card.name}</Text>
          <MuscleChips primary={card.primary} secondary={card.secondary} />
        </View>
      </View>
      <View style={styles.stats}>
        <StatTile label="Última vez" value={last ? formatSet(last, unit) : '—'} compact />
        <StatTile
          label="Récord"
          value={exercise.bestWeightKg !== null ? formatWeight(exercise.bestWeightKg, unit) : '—'}
          highlight={exercise.bestWeightKg !== null}
          compact
        />
        <StatTile label="Objetivo" value={formatScheme(exercise.scheme)} compact />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { gap: space.md },
  top: { flexDirection: 'row', gap: space.md, alignItems: 'flex-start' },
  info: { flex: 1, gap: space.xs },
  muted: { color: color.textMuted, fontSize: font.caption },
  name: { color: color.text, fontSize: font.heading, fontWeight: '800' },
  stats: { flexDirection: 'row', gap: space.sm },
});
