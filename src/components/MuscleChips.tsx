import { StyleSheet, View } from 'react-native';

import { MUSCLES, type MuscleId } from '@/db/seed/muscles';
import type { MuscleSet } from '@/domain/muscles';
import { space } from '@/theme';

import { Chip } from './Chip';

const muscleName = (id: MuscleId) => MUSCLES.find((m) => m.id === id)?.name ?? id;

/** Chips de los músculos que se trabajan: principales en lima, secundarios en gris. */
export function MuscleChips({ primary, secondary }: MuscleSet<MuscleId>) {
  return (
    <View style={styles.row}>
      {primary.map((id) => (
        <Chip key={id} label={muscleName(id)} variant="primaryMuscle" />
      ))}
      {secondary.map((id) => (
        <Chip key={id} label={muscleName(id)} variant="secondaryMuscle" />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
});
