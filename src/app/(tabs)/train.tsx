import { router } from 'expo-router';
import { useMemo, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { ExercisePicker } from '@/components/ExercisePicker';
import { ExerciseThumb } from '@/components/ExerciseThumb';
import { Toast } from '@/components/Toast';
import { ExerciseSummary } from '@/components/workout/ExerciseSummary';
import { RestBar } from '@/components/workout/RestBar';
import { SetRow } from '@/components/workout/SetRow';
import { db } from '@/db/client';
import { formatClock } from '@/domain/format';
import { formatWeight, incrementFor } from '@/domain/units';
import { fieldsFor, isExerciseDone } from '@/domain/workout';
import { useNow } from '@/hooks/useNow';
import { useToast } from '@/hooks/useToast';
import { useWorkout } from '@/hooks/useWorkout';
import { getExerciseCards } from '@/services/catalog';
import type { WorkoutPlan } from '@/services/session';
import { color, font, space } from '@/theme';

const THUMB_SIZE = 74;

/** Registro rápido: series precargadas, + / − y ✓ que guarda la serie y arranca el descanso. */
export default function TrainScreen() {
  const [chosenDayId, setChosenDayId] = useState<string>();
  const workout = useWorkout(chosenDayId);
  const toast = useToast();
  const { state } = workout;
  const now = useNow(!!state?.sessionId);
  const [pickerOpen, setPickerOpen] = useState(false);
  // El catálogo no cambia mientras la app está abierta: se lee una sola vez.
  const catalog = useMemo(() => getExerciseCards(db), []);

  if (!state) return null;
  const { plan, drafts, currentId } = state;

  const picker = (
    <ExercisePicker
      visible={pickerOpen}
      exercises={catalog}
      onClose={() => setPickerOpen(false)}
      onPick={(exercise) => {
        setPickerOpen(false);
        workout.addExercise(exercise.id);
      }}
    />
  );

  if (plan.exercises.length === 0) {
    return (
      <>
        <RestDay
          days={plan.trainableDays}
          onChoose={setChosenDayId}
          onFreeWorkout={() => setPickerOpen(true)}
        />
        {picker}
      </>
    );
  }

  const index = Math.max(
    0,
    plan.exercises.findIndex((e) => e.card.id === currentId),
  );
  const exercise = plan.exercises[index];
  const sets = drafts[exercise.card.id];
  const { unit } = plan.settings;
  const fields = fieldsFor(exercise.card.tracking, unit);
  const isLast = index === plan.exercises.length - 1;
  const elapsed = plan.session ? (now - new Date(plan.session.startedAt).getTime()) / 1000 : 0;

  const onToggle = (setIndex: number) => {
    const { isPr } = workout.toggleSet(exercise.card.id, setIndex);
    const weight = sets[setIndex].values.weightKg ?? 0;
    if (isPr)
      toast.show(`🏆 ¡Nuevo récord! ${formatWeight(weight, unit)} en ${exercise.card.name}`);
  };

  const onNext = () => {
    if (!isLast) {
      workout.selectExercise(plan.exercises[index + 1].card.id);
      return;
    }
    workout.finish();
    setChosenDayId(undefined);
    router.navigate('/');
  };

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <View>
            <Text style={styles.muted}>Entrenando · {plan.day?.name ?? 'Libre'}</Text>
            <Text style={styles.title}>Registro</Text>
          </View>
          <Chip label={`● ${formatClock(elapsed)}`} />
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.carousel}>
          {plan.exercises.map((e) => {
            const done = isExerciseDone(drafts[e.card.id]);
            return (
              <Pressable
                key={e.card.id}
                onPress={() => workout.selectExercise(e.card.id)}
                accessibilityRole="tab"
                accessibilityState={{ selected: e.card.id === exercise.card.id }}
                accessibilityLabel={`${e.card.name}${done ? ', hecho' : ''}`}
                style={styles.carouselItem}>
                <ExerciseThumb
                  primary={e.card.primary}
                  secondary={e.card.secondary}
                  equipment={e.card.equipmentId}
                  size={THUMB_SIZE}
                  active={e.card.id === exercise.card.id}
                />
                {done && (
                  <View style={styles.doneBadge}>
                    <Text style={styles.doneMark}>✓</Text>
                  </View>
                )}
                <Text style={styles.carouselName} numberOfLines={2}>
                  {e.card.name}
                </Text>
              </Pressable>
            );
          })}
          <Pressable
            onPress={() => setPickerOpen(true)}
            accessibilityRole="button"
            accessibilityLabel="Añadir otro ejercicio"
            style={styles.carouselItem}>
            <View style={styles.otherTile}>
              <Text style={styles.otherPlus}>+</Text>
            </View>
            <Text style={styles.carouselName}>Otro</Text>
          </Pressable>
        </ScrollView>

        <ExerciseSummary exercise={exercise} unit={unit} />

        <Card>
          <View style={styles.setsHeader}>
            <Text style={[styles.columnLabel, styles.numberColumn]}>#</Text>
            {fields.map((f) => (
              <Text key={f.field} style={[styles.columnLabel, styles.fill]}>
                {(f.unit ?? f.label).toUpperCase()}
              </Text>
            ))}
            <View style={styles.checkColumn} />
          </View>
          {sets.map((set, i) => (
            <SetRow
              key={i}
              number={i + 1}
              fields={fields}
              values={set.values}
              previous={exercise.lastSession[i] ?? exercise.lastSession.at(-1)}
              weightStep={incrementFor(plan.settings.incrementKg, unit)}
              saved={set.savedSetId !== null}
              onChange={(field, value) => workout.changeValue(exercise.card.id, i, field, value)}
              onToggleSaved={() => onToggle(i)}
            />
          ))}
          <View style={styles.addSet}>
            <Button
              title="+ Serie (copia la anterior)"
              variant="secondary"
              size="small"
              onPress={() => workout.addSet(exercise.card.id, exercise.card.tracking)}
            />
          </View>
        </Card>

        {workout.rest && (
          <RestBar
            endsAt={workout.rest.endsAt}
            totalSeconds={workout.rest.totalSeconds}
            onAdjust={workout.adjustRest}
            onSkip={workout.skipRest}
            onFinish={workout.finishRest}
          />
        )}

        <Button
          title={isLast ? 'Terminar entrenamiento' : 'Siguiente ejercicio →'}
          onPress={onNext}
        />
      </ScrollView>
      <Toast message={toast.message} />
      {picker}
    </SafeAreaView>
  );
}

type RestDayProps = {
  days: WorkoutPlan['trainableDays'];
  onChoose: (dayId: string) => void;
  /** Entrenar ejercicios sueltos elegidos en el selector. */
  onFreeWorkout: () => void;
};

/** Día de descanso: permite entrenar igualmente uno de los días de la rutina. */
function RestDay({ days, onChoose, onFreeWorkout }: RestDayProps) {
  // Si la rutina repite un día (p. ej. Legs dos veces), basta con ofrecerlo una vez.
  const unique = days.filter((d, i) => days.findIndex((o) => o.name === d.name) === i);

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <View style={styles.content}>
        <Text style={styles.title}>Registro</Text>
        <Card style={styles.restCard}>
          <Text style={styles.restTitle}>Hoy toca descanso 😴</Text>
          <Text style={styles.muted}>
            La recuperación también cuenta. ¿Quieres entrenar igualmente?
          </Text>
          <View style={styles.dayChoices}>
            {unique.map((d) => (
              <Chip key={d.id} label={d.name} onPress={() => onChoose(d.id)} />
            ))}
          </View>
          <Button
            title="Elegir ejercicios sueltos"
            variant="secondary"
            size="small"
            onPress={onFreeWorkout}
          />
        </Card>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: { padding: space.screen, gap: space.md, paddingBottom: space.screen * 2 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { color: color.text, fontSize: font.title, fontWeight: '800', letterSpacing: -0.5 },
  muted: { color: color.textMuted, fontSize: font.caption },
  fill: { flex: 1, textAlign: 'center' },
  carousel: { gap: space.gap },
  carouselItem: { width: THUMB_SIZE, gap: 6 },
  carouselName: { color: color.textMuted, fontSize: font.tiny, textAlign: 'center' },
  doneBadge: {
    position: 'absolute',
    top: 5,
    left: 5,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.accent,
  },
  otherTile: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: color.line,
    backgroundColor: color.thumbBg,
  },
  otherPlus: { color: color.accent, fontSize: 30 },
  doneMark: { color: color.bg, fontSize: 11, fontWeight: '900' },
  setsHeader: { flexDirection: 'row', gap: space.sm, paddingBottom: space.xs },
  columnLabel: { color: color.textMuted, fontSize: font.tiny },
  numberColumn: { width: 22, textAlign: 'center' },
  checkColumn: { width: 44 },
  addSet: { marginTop: space.gap },
  restCard: { gap: space.sm, alignItems: 'center', paddingVertical: space.screen * 2 },
  restTitle: { color: color.text, fontSize: font.heading, fontWeight: '800' },
  dayChoices: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: space.sm,
    justifyContent: 'center',
    marginTop: space.sm,
  },
});
