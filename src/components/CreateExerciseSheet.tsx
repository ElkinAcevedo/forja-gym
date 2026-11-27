import { useState } from 'react';
import { StyleSheet, Text, TextInput, useWindowDimensions, View } from 'react-native';

import { EQUIPMENT, type EquipmentId } from '@/db/seed/equipment';
import { MUSCLES, type MuscleId } from '@/db/seed/muscles';
import { cleanExerciseName, EXERCISE_NAME_MAX, type NewExercise } from '@/services/catalog';
import { color, font, radius, size, space } from '@/theme';

import { BodyMap } from './body/BodyMap';
import { BODY_VIEWBOX } from './body/bodyShapes';
import { Button } from './Button';
import { Card } from './Card';
import { Chip } from './Chip';
import { Sheet } from './Sheet';

type Props = {
  visible: boolean;
  /** Si ya existe un ejercicio con ese nombre, para avisar antes de guardar. */
  isNameTaken: (name: string) => boolean;
  onSave: (exercise: NewExercise) => void;
  onClose: () => void;
};

const muscleName = (id: MuscleId) => MUSCLES.find((m) => m.id === id)?.name ?? id;

/**
 * "Crear ejercicio": nombre, equipo y músculos tocados en el mapa. La imagen del ejercicio
 * será su mapa muscular, igual que la del catálogo.
 */
export function CreateExerciseSheet({ visible, isNameTaken, onSave, onClose }: Props) {
  const [name, setName] = useState('');
  const [equipmentId, setEquipmentId] = useState<EquipmentId | null>(null);
  const [muscles, setMuscles] = useState<MuscleId[]>([]);
  const { width } = useWindowDimensions();
  const mapWidth = (width - space.screen * 2 - space.gap * 2 - space.lg) / 2;
  const mapHeight = (mapWidth * BODY_VIEWBOX.height) / BODY_VIEWBOX.width;

  const clean = cleanExerciseName(name);
  const taken = clean.length > 0 && isNameTaken(clean);
  const canSave = clean.length > 0 && !taken && equipmentId !== null && muscles.length > 0;

  const toggleMuscle = (id: MuscleId) =>
    setMuscles((list) => (list.includes(id) ? list.filter((m) => m !== id) : [...list, id]));

  const close = () => {
    setName('');
    setEquipmentId(null);
    setMuscles([]);
    onClose();
  };

  const save = () => {
    if (!canSave) return;
    onSave({ name: clean, equipmentId, primary: muscles });
    close();
  };

  return (
    <Sheet visible={visible} title="Crear ejercicio" onClose={close}>
      <Text style={styles.label}>Nombre</Text>
      <TextInput
        accessibilityLabel="Nombre del ejercicio"
        value={name}
        onChangeText={setName}
        placeholder="Ej.: Remo Pendlay"
        placeholderTextColor={color.textMuted}
        maxLength={EXERCISE_NAME_MAX}
        autoCapitalize="sentences"
        style={styles.input}
      />
      {taken && <Text style={styles.hint}>Ya existe un ejercicio con ese nombre.</Text>}

      <Text style={styles.label}>Equipo</Text>
      <View style={styles.chips}>
        {EQUIPMENT.map((e) => (
          <Chip
            key={e.id}
            label={e.name}
            variant={equipmentId === e.id ? 'selected' : 'default'}
            onPress={() => setEquipmentId(e.id)}
          />
        ))}
      </View>

      <Text style={styles.label}>Músculos que trabaja · toca en el mapa</Text>
      <Card style={styles.mapCard}>
        <View style={styles.maps}>
          {(['front', 'back'] as const).map((view) => (
            <BodyMap
              key={view}
              view={view}
              height={mapHeight}
              primary={muscles}
              onPressMuscle={toggleMuscle}
            />
          ))}
        </View>
        {muscles.length > 0 && (
          <View style={styles.chips}>
            {muscles.map((m) => (
              <Chip key={m} label={`${muscleName(m)} ✕`} onPress={() => toggleMuscle(m)} />
            ))}
          </View>
        )}
      </Card>

      <Button title="Crear y añadir" onPress={save} disabled={!canSave} />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  label: { color: color.textMuted, fontSize: font.label, fontWeight: '700' },
  input: {
    height: size.control,
    paddingHorizontal: space.md,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.surface2,
    color: color.text,
    fontSize: font.body,
  },
  hint: { color: color.textMuted, fontSize: font.caption },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  mapCard: { gap: space.sm, padding: space.gap },
  maps: { flexDirection: 'row', justifyContent: 'center', gap: space.lg },
});
