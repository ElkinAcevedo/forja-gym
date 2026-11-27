import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { BodyMap } from '@/components/body/BodyMap';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ExerciseThumb } from '@/components/ExerciseThumb';
import { MuscleChips } from '@/components/MuscleChips';
import { SectionHeader } from '@/components/SectionHeader';
import { StatTile } from '@/components/StatTile';
import { WeekStrip } from '@/components/WeekStrip';
import { db } from '@/db/client';
import { formatLongDate } from '@/domain/dates';
import { formatSet } from '@/domain/format';
import { formatVolume, formatWeight, isWeightPerDumbbell } from '@/domain/units';
import { useFocusData } from '@/hooks/useFocusData';
import { getHomeData, type HomeData } from '@/services/home';
import { color, font, space } from '@/theme';

const THUMB_SIZE = 74;

const loadHome = () => getHomeData(db, new Date());

/** Pantalla Inicio: la semana, el entrenamiento de hoy, el resumen semanal y los récords. */
export default function HomeScreen() {
  const [data] = useFocusData(loadHome);
  if (!data) return null;

  const { summary } = data;
  const goToTrain = () => router.push('/train');

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View>
          <Text style={styles.date}>{formatLongDate(new Date())}</Text>
          <Text style={styles.title}>Hola, {data.displayName}</Text>
        </View>

        <WeekStrip
          days={data.week.map((d) => ({
            dayOfMonth: d.date.getDate(),
            name: d.name,
            isToday: d.isToday,
          }))}
        />

        <SectionHeader title="Hoy" />
        {data.today ? (
          <TodayCard routineName={data.routineName} today={data.today} onStart={goToTrain} />
        ) : (
          <Card>
            <Text style={styles.restTitle}>Descanso</Text>
            <Text style={styles.muted}>Hoy te toca recuperar.</Text>
          </Card>
        )}

        <SectionHeader title="Esta semana" />
        <View style={styles.stats}>
          <StatTile label="Sesiones" value={`${summary.sessions}/${summary.plannedSessions}`} />
          <StatTile label="Volumen" value={formatVolume(summary.volumeKg, data.unit)} />
          <StatTile
            label="Récords"
            value={summary.records > 0 ? `+${summary.records}` : '0'}
            highlight={summary.records > 0}
          />
        </View>

        <SectionHeader title="Últimos récords" />
        <Card>
          {data.records.length === 0 ? (
            <Text style={styles.muted}>
              Aún no hay récords. Supera tu mejor peso en un ejercicio y aparecerá aquí.
            </Text>
          ) : (
            data.records.map((record) => (
              <View key={record.setId} style={styles.recordRow}>
                <ExerciseThumb
                  primary={record.exercise.primary}
                  secondary={record.exercise.secondary}
                  equipment={record.exercise.equipmentId}
                  size={58}
                />
                <View style={styles.fill}>
                  <Text style={styles.recordName}>{record.exercise.name}</Text>
                  <Text style={styles.muted}>
                    {formatSet(
                      {
                        weightKg: record.weightKg,
                        reps: record.reps,
                        durationS: null,
                        distanceM: null,
                      },
                      data.unit,
                      isWeightPerDumbbell(record.exercise.equipmentId),
                    )}
                  </Text>
                </View>
                <Text style={styles.gain}>
                  ▲ +
                  {formatWeight(
                    record.gainKg,
                    data.unit,
                    isWeightPerDumbbell(record.exercise.equipmentId),
                  )}
                </Text>
              </View>
            ))
          )}
        </Card>
      </ScrollView>
    </SafeAreaView>
  );
}

type TodayCardProps = {
  routineName: string;
  today: NonNullable<HomeData['today']>;
  onStart: () => void;
};

/** Tarjeta destacada con el entrenamiento de hoy: músculos, ejercicios y botón para empezar. */
function TodayCard({ routineName, today, onStart }: TodayCardProps) {
  return (
    <Card hero style={styles.today}>
      <View style={styles.todayTop}>
        <View style={styles.fill}>
          <Text style={styles.muted}>{routineName}</Text>
          <Text style={styles.dayName}>{today.name}</Text>
          <Text style={styles.muted}>
            {today.exercises.length} ejercicios · ~{today.estimatedMinutes} min
          </Text>
          <View style={styles.chips}>
            <MuscleChips {...today.muscles} />
          </View>
        </View>
        <View style={styles.bodies}>
          <BodyMap view="front" height={130} {...today.muscles} />
          <BodyMap view="back" height={130} {...today.muscles} />
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.carousel}>
        {today.exercises.map((e) => (
          <Pressable
            key={e.id}
            onPress={onStart}
            accessibilityRole="button"
            accessibilityLabel={`Empezar con ${e.name}`}
            style={styles.carouselItem}>
            <ExerciseThumb
              primary={e.primary}
              secondary={e.secondary}
              equipment={e.equipmentId}
              size={THUMB_SIZE}
            />
            <Text style={styles.carouselName} numberOfLines={2}>
              {e.name}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      <Button title="Empezar entrenamiento" onPress={onStart} />
    </Card>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: color.bg },
  content: { padding: space.screen, gap: space.gap, paddingBottom: space.screen * 2 },
  date: { color: color.textMuted, fontSize: font.caption },
  title: { color: color.text, fontSize: font.title, fontWeight: '800', letterSpacing: -0.5 },
  muted: { color: color.textMuted, fontSize: font.caption },
  fill: { flex: 1 },
  today: { gap: space.lg },
  todayTop: { flexDirection: 'row', gap: space.sm },
  dayName: { color: color.text, fontSize: font.display, fontWeight: '800', marginVertical: 2 },
  chips: { marginTop: space.sm },
  bodies: { flexDirection: 'row', gap: 2 },
  carousel: { gap: space.gap },
  carouselItem: { width: THUMB_SIZE, gap: 6 },
  carouselName: { color: color.textMuted, fontSize: font.tiny, textAlign: 'center' },
  restTitle: { color: color.text, fontSize: font.display, fontWeight: '800' },
  stats: { flexDirection: 'row', gap: space.sm },
  recordRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: 6 },
  recordName: { color: color.text, fontSize: 15, fontWeight: '700' },
  gain: { color: color.accent, fontWeight: '700' },
});
