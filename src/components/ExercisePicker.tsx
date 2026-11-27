import { useState } from 'react';
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from 'react-native';

import { EQUIPMENT, type EquipmentId } from '@/db/seed/equipment';
import { MUSCLES, type MuscleId } from '@/db/seed/muscles';
import { exerciseSearchText } from '@/db/seed/searchAliases';
import { filterExercises, NO_FILTER, type ExerciseFilter } from '@/domain/exerciseFilter';
import type { ExerciseCard } from '@/services/catalog';
import { color, font, radius, space } from '@/theme';

import { BodyMap } from './body/BodyMap';
import { BODY_VIEWBOX } from './body/bodyShapes';
import { Button } from './Button';
import { Card } from './Card';
import { Chip } from './Chip';
import { ExerciseThumb } from './ExerciseThumb';
import { Sheet, SHEET_PADDING } from './Sheet';
import { TextField } from './TextField';

const COLUMNS = 3;

type Props = {
  visible: boolean;
  /** Ejercicios entre los que elegir (normalmente, todo el catálogo). */
  exercises: readonly ExerciseCard[];
  onPick: (exercise: ExerciseCard) => void;
  /** Abre "Crear ejercicio" para lo que no esté en el catálogo. */
  onCreate: () => void;
  onClose: () => void;
};

/** Una fila de la lista: tres miniaturas, el encabezado de "También lo trabajan" o un aviso. */
type Row =
  | { kind: 'thumbs'; key: string; items: ExerciseCard[] }
  | { kind: 'alsoHeader'; key: string; count: number }
  | { kind: 'empty'; key: string };

const chunk = (list: readonly ExerciseCard[], prefix: string): Row[] =>
  Array.from({ length: Math.ceil(list.length / COLUMNS) }, (_, i) => ({
    kind: 'thumbs',
    key: `${prefix}${i}`,
    items: list.slice(i * COLUMNS, (i + 1) * COLUMNS),
  }));

const muscleName = (id: MuscleId) => MUSCLES.find((m) => m.id === id)?.name ?? id;

/**
 * Selector de ejercicio: se busca por texto (con sinónimos de gym) o se toca un músculo en el
 * mapa, y se filtra por equipo; cada ejercicio se elige por su miniatura.
 *
 * Es una FlatList porque cada miniatura es un mapa muscular en SVG: dibujar el catálogo entero
 * de golpe tardaba segundos. Así solo se dibujan las filas que se ven.
 */
export function ExercisePicker({ visible, exercises, onPick, onCreate, onClose }: Props) {
  const [filter, setFilter] = useState<ExerciseFilter>(NO_FILTER);
  const [showAlso, setShowAlso] = useState(false);
  const { width } = useWindowDimensions();
  const thumbSize = (width - SHEET_PADDING * 2 - space.gap * (COLUMNS - 1)) / COLUMNS;
  // Los dos mapas ocupan todo el ancho de la tarjeta: más grandes, más fáciles de tocar.
  const mapWidth = (width - SHEET_PADDING * 2 - space.gap * 2 - space.lg) / 2;
  const mapHeight = (mapWidth * BODY_VIEWBOX.height) / BODY_VIEWBOX.width;

  const results = filterExercises(exercises, filter, exerciseSearchText);
  const searching = filter.query.trim().length > 0;
  const muscle = filter.muscle as MuscleId | null;

  const rows: Row[] = [
    ...(results.main.length === 0 && results.also.length === 0
      ? [{ kind: 'empty', key: 'empty' } as const]
      : chunk(results.main, 'main')),
    ...(results.also.length > 0
      ? [{ kind: 'alsoHeader', key: 'also', count: results.also.length } as const]
      : []),
    ...(showAlso ? chunk(results.also, 'also') : []),
  ];

  const toggleMuscle = (id: MuscleId) => {
    setShowAlso(false);
    setFilter((f) => ({ ...f, muscle: f.muscle === id ? null : id }));
  };
  const setEquipment = (equipment: EquipmentId | null) => setFilter((f) => ({ ...f, equipment }));

  const pick = (exercise: ExerciseCard) => {
    onPick(exercise);
    setFilter(NO_FILTER);
  };

  const header = (
    <View style={styles.header}>
      <TextField
        accessibilityLabel="Buscar ejercicio"
        value={filter.query}
        onChangeText={(query) => setFilter((f) => ({ ...f, query }))}
        placeholder="Buscar: remo, pantorrilla, barra guiada…"
        returnKeyType="search"
        autoCorrect={false}
      />
      {/* Mientras se escribe, el mapa se oculta para que los resultados queden a la vista. */}
      {!searching && (
        <>
          <Text style={styles.muted}>O toca el músculo que quieres trabajar</Text>
          <Card style={styles.mapCard}>
            <View style={styles.maps}>
              {(['front', 'back'] as const).map((view) => (
                <BodyMap
                  key={view}
                  view={view}
                  height={mapHeight}
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
        </>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
    </View>
  );

  const renderRow = ({ item }: { item: Row }) => {
    switch (item.kind) {
      case 'empty':
        return (
          <Text style={[styles.muted, styles.empty]}>
            Ningún ejercicio coincide. Prueba otra palabra o créalo abajo.
          </Text>
        );
      case 'alsoHeader':
        return (
          <Pressable
            onPress={() => setShowAlso((v) => !v)}
            accessibilityRole="button"
            accessibilityState={{ expanded: showAlso }}
            style={styles.alsoHeader}>
            <Text style={styles.alsoTitle}>También lo trabajan ({item.count})</Text>
            <Text style={styles.alsoTitle}>{showAlso ? '▴' : '▾'}</Text>
          </Pressable>
        );
      case 'thumbs':
        return (
          <View style={styles.row}>
            {item.items.map((e) => (
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
        );
    }
  };

  return (
    <Sheet visible={visible} title="Elige ejercicio" onClose={onClose} scroll={false}>
      <FlatList
        data={rows}
        keyExtractor={(row) => row.key}
        renderItem={renderRow}
        ListHeaderComponent={header}
        ListFooterComponent={
          <View style={styles.create}>
            <Button title="+ Crear ejercicio" variant="secondary" size="small" onPress={onCreate} />
          </View>
        }
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        initialNumToRender={4}
        windowSize={5}
      />
    </Sheet>
  );
}

const styles = StyleSheet.create({
  content: { padding: SHEET_PADDING, gap: space.gap },
  header: { gap: space.md, marginBottom: space.sm },
  muted: { color: color.textMuted, fontSize: font.caption },
  mapCard: { gap: space.sm, padding: space.gap },
  maps: { flexDirection: 'row', justifyContent: 'center', gap: space.lg },
  selected: { flexDirection: 'row', justifyContent: 'center', gap: space.sm },
  equipment: { gap: space.sm },
  row: { flexDirection: 'row', gap: space.gap },
  item: { gap: 6, borderRadius: radius.thumb },
  itemName: { color: color.text, fontSize: font.caption, textAlign: 'center' },
  empty: { textAlign: 'center', paddingVertical: space.screen },
  alsoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: space.md,
    borderTopWidth: 1,
    borderTopColor: color.line,
  },
  alsoTitle: { color: color.textMuted, fontSize: font.label, fontWeight: '700' },
  create: { marginTop: space.md },
});
