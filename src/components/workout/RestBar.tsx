import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { REST_ADJUST_STEP_S } from '@/domain/rest';
import { formatClock } from '@/domain/format';
import { useNow } from '@/hooks/useNow';
import { color, font, radius, size, space } from '@/theme';

type Props = {
  /** Momento (ms) en que termina el descanso. */
  endsAt: number;
  totalSeconds: number;
  /** Ajusta el descanso de este ejercicio (y lo recuerda para la próxima vez). */
  onAdjust: (deltaSeconds: number) => void;
  onSkip: () => void;
  /** Se llama una vez cuando la cuenta llega a 0. */
  onFinish: () => void;
};

/** Barra de descanso entre series: cuenta atrás, ajuste de ±15 s y botón para saltarlo. */
export function RestBar({ endsAt, totalSeconds, onAdjust, onSkip, onFinish }: Props) {
  const now = useNow(true);
  const remaining = Math.max(0, Math.ceil((endsAt - now) / 1000));

  useEffect(() => {
    if (remaining === 0) onFinish();
  }, [remaining, onFinish]);

  return (
    <View style={styles.bar}>
      <View style={styles.row}>
        <Text
          style={[styles.text, styles.fill]}
          accessibilityRole="timer"
          accessibilityLabel={`Descanso, quedan ${formatClock(remaining)}`}>
          ⏱ {formatClock(remaining)}
        </Text>
        <AdjustButton
          label={`−${REST_ADJUST_STEP_S} s`}
          onPress={() => onAdjust(-REST_ADJUST_STEP_S)}
        />
        <AdjustButton
          label={`+${REST_ADJUST_STEP_S} s`}
          onPress={() => onAdjust(REST_ADJUST_STEP_S)}
        />
        <Pressable onPress={onSkip} accessibilityRole="button" hitSlop={8} style={styles.skip}>
          <Text style={styles.skipText}>Saltar</Text>
        </Pressable>
      </View>
      <View style={styles.track}>
        <View style={[styles.progress, { width: `${(remaining / totalSeconds) * 100}%` }]} />
      </View>
    </View>
  );
}

function AdjustButton({ label, onPress }: { label: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Descanso ${label}`}
      style={({ pressed }) => [styles.adjust, pressed && styles.adjustPressed]}>
      <Text style={styles.adjustText}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bar: {
    gap: space.sm,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.button,
    backgroundColor: color.accent,
  },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  fill: { flex: 1 },
  text: { color: color.bg, fontSize: font.heading, fontWeight: '800' },
  adjust: {
    minWidth: size.touch,
    height: 36,
    paddingHorizontal: space.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.small,
    backgroundColor: 'rgba(13,15,19,0.12)',
  },
  adjustPressed: { backgroundColor: 'rgba(13,15,19,0.25)' },
  adjustText: { color: color.bg, fontSize: font.label, fontWeight: '700' },
  skip: { paddingLeft: space.xs },
  skipText: { color: color.bg, fontSize: font.label, fontWeight: '800' },
  track: {
    height: 6,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(13,15,19,0.2)',
  },
  progress: { height: '100%', backgroundColor: color.bg },
});
