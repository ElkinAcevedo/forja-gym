import { useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EQUIPMENT, type EquipmentId } from '@/db/seed/equipment';
import { MUSCLES, type MuscleId } from '@/db/seed/muscles';
import { filterExercises, NO_FILTER, type ExerciseFilter } from '@/domain/exerciseFilter';
import type { ExerciseCard } from '@/services/catalog';
import { color, font, radius, space } from '@/theme';

import { BodyMap } from './body/BodyMap';
import { Card } from './Card';
import { Chip } from './Chip';
import { ExerciseThumb } from './ExerciseThumb';

const COLUMNS = 3;
const MAP_HEIGHT = 200;

type Props = {
  visible: boolean;
  /** Ejercicios entre los que elegir (normalmente, todo el catálogo). */
  exercises: readonly ExerciseCard[];
  onPick: (exercise: ExerciseCard) => void;
  onClose: () => void;
};

const muscleName = (id: MuscleId) => MUSCLES.find((m) => m.id === id)?.name ?? id;

/**
 * Selector de ejercicio por imagen: se toca un músculo en el mapa y se filtra por equipo;
 * cada ejercicio se elige por su miniatura.
 */
export function ExercisePicker({ visible, exercises, onPick, onClose }: Props) {
  const [filter, setFilter] = useState<ExerciseFilter>(NO_FILTER);
  const { width } = useWindowDimensions();
  const thumbSize = (width - space.screen * 2 - space.gap * (COLUMNS - 1)) / COLUMNS;
  const results = filterExercises(exercises, filter);
  const muscle = filter.muscle as MuscleId | null;

  const toggleMuscle = (id: MuscleId) =>
    setFilter((f) => ({ ...f, muscle: f.muscle === id ? null : id }));
  const setEquipment = (equipment: EquipmentId | null) => setFilter((f) => ({ ...f, equipment }));

  const pick = (exercise: ExerciseCard) => {
    setFilter(NO_FILTER);
    onPick(exercise);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={styles.dismiss} onPress={onClose} accessibilityLabel="Cerrar" />
        <SafeAreaView style={styles.sheet} edges={['bottom']}>
          <View style={styles.grab} />
          <View style={styles.header}>
            <Text style={styles.title}>Elige ejercicio</Text>
            <Pressable
              onPress={onClose}
              accessibilityRole="button"
              accessibilityLabel="Cerrar selector"
              hitSlop={10}
              style={styles.close}>
              <Text style={styles.closeText}>✕</Text>
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            <Text style={styles.muted}>Toca el músculo que quieres trabajar</Text>
            <Card style={styles.mapCard}>
              <View style={styles.maps}>
                {(['front', 'back'] as const).map((view) => (
                  <BodyMap
                    key={view}
                    view={view}
                    height={MAP_HEIGHT}
                    primary={muscle ? [muscle] : []}
                    selected={muscle}
                    onPressMuscle={toggleMuscle}
                  />
                ))}
              </View>
              {muscle && (
                <View style={styles.selected}>
                  <Chip label={muscleName(muscle)} variant="selected" />
                  <Chip label="Quitar ✕" onPress={() => toggleMuscle(muscle)} />
                </View>
              )}
            </Card>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.equipment}>
              <Chip
                label="Todo"
                variant={filter.equipment === null ? 'selected' : 'default'}
                onPress={() => setEquipment(null)}
              />
              {EQUIPMENT.map((e) => (
                <Chip
                  key={e.id}
                  label={e.name}
                  variant={filter.equipment === e.id ? 'selected' : 'default'}
                  onPress={() => setEquipment(e.id)}
                />
              ))}
            </ScrollView>

            {results.length === 0 ? (
              <Text style={[styles.muted, styles.empty]}>
                Ningún ejercicio trabaja ese músculo con ese equipo.
              </Text>
            ) : (
              <View style={styles.grid}>
                {results.map((e) => (
                  <Pressable
                    key={e.id}
                    onPress={() => pick(e)}
                    accessibilityRole="button"
                    accessibilityLabel={`Añadir ${e.name}`}
                    style={[styles.item, { width: thumbSize }]}>
                    <ExerciseThumb
                      primary={e.primary}
                      secondary={e.secondary}
                      equipment={e.equipmentId}
                      size={thumbSize}
                    />
                    <Text style={styles.itemName} numberOfLines={2}>
                      {e.name}
                    </Text>
                  </Pressable>
                ))}
              </View>
            )}
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)' },
  dismiss: { flex: 1 },
  sheet: {
    height: '90%',
    paddingTop: space.gap,
    backgroundColor: color.bg,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    borderTopWidth: 1,
    borderColor: color.line,
  },
  grab: {
    alignSelf: 'center',
    width: 40,
    height: 5,
    borderRadius: 3,
    marginBottom: space.md,
    backgroundColor: color.line,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: space.screen,
  },
  title: { color: color.text, fontSize: font.heading, fontWeight: '800' },
  close: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: color.surface2,
  },
  closeText: { color: color.textMuted, fontSize: font.body },
  content: { padding: space.screen, gap: space.md },
  muted: { color: color.textMuted, fontSize: font.caption },
  mapCard: { gap: space.sm, padding: space.gap },
  maps: { flexDirection: 'row', justifyContent: 'center', gap: space.lg },
  selected: { flexDirection: 'row', justifyContent: 'center', gap: space.sm },
  equipment: { gap: space.sm },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: space.gap },
  item: { gap: 6, borderRadius: radius.thumb },
  itemName: { color: color.text, fontSize: font.caption, textAlign: 'center' },
  empty: { textAlign: 'center', paddingVertical: space.screen },
});
