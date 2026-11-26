import { Pressable, StyleSheet, Text, View } from 'react-native';

import { WEEKDAY_LETTERS, WEEKDAY_NAMES } from '@/domain/dates';
import { color, font, radius, space } from '@/theme';

export type WeekStripDay = {
  /** Número del día del mes; si falta, solo se muestra la inicial. */
  dayOfMonth?: number;
  /** Nombre del día de la rutina; nulo = descanso. */
  name: string | null;
  isToday?: boolean;
};

type Props = {
  /** Lunes a domingo. */
  days: readonly WeekStripDay[];
  onPressDay?: (weekday: number) => void;
};

/** Tira de lunes a domingo: los días de entrenamiento en lima suave y hoy con borde. */
export function WeekStrip({ days, onPressDay }: Props) {
  return (
    <View style={styles.row}>
      {days.map((day, weekday) => {
        const trains = day.name !== null;
        const tint = trains ? color.accent : color.textMuted;
        return (
          <Pressable
            key={weekday}
            disabled={!onPressDay}
            onPress={() => onPressDay?.(weekday)}
            accessibilityRole={onPressDay ? 'button' : 'text'}
            accessibilityLabel={`${WEEKDAY_NAMES[weekday]}${day.isToday ? ', hoy' : ''}: ${day.name ?? 'descanso'}`}
            style={[styles.day, trains && styles.training, day.isToday && styles.today]}>
            <Text style={[styles.letter, { color: tint }]}>{WEEKDAY_LETTERS[weekday]}</Text>
            {day.dayOfMonth !== undefined && <Text style={styles.number}>{day.dayOfMonth}</Text>}
            <Text style={[styles.name, { color: tint }]} numberOfLines={1}>
              {day.name ?? '—'}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: 5 },
  day: {
    flex: 1,
    minHeight: 58,
    paddingVertical: space.sm,
    paddingHorizontal: 2,
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.small,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: color.surface2,
  },
  training: { backgroundColor: color.accentSoft },
  today: { borderColor: color.accent },
  letter: { fontSize: 10 },
  number: { color: color.text, fontSize: 13, fontWeight: '700' },
  name: { fontSize: 10 },
});
