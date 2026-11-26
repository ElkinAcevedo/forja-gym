import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { formatClock } from '@/domain/format';
import { useNow } from '@/hooks/useNow';
import { color, font, radius, space } from '@/theme';

type Props = {
  /** Momento (ms) en que termina el descanso. */
  endsAt: number;
  totalSeconds: number;
  onSkip: () => void;
  /** Se llama una vez cuando la cuenta llega a 0. */
  onFinish: () => void;
};

/** Barra de descanso entre series: cuenta atrás, progreso y botón para saltarlo. */
export function RestBar({ endsAt, totalSeconds, onSkip, onFinish }: Props) {
  const now = useNow(true);
  const remaining = Math.max(0, Math.ceil((endsAt - now) / 1000));

  useEffect(() => {
    if (remaining === 0) onFinish();
  }, [remaining, onFinish]);

  return (
    <View
      style={styles.bar}
      accessibilityRole="timer"
      accessibilityLabel={`Descanso, quedan ${formatClock(remaining)}`}>
      <Text style={styles.text}>⏱ Descanso</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${(remaining / totalSeconds) * 100}%` }]} />
      </View>
      <Text style={styles.text}>{formatClock(remaining)}</Text>
      <Pressable onPress={onSkip} accessibilityRole="button" hitSlop={10}>
        <Text style={styles.skip}>Saltar</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.button,
    backgroundColor: color.accent,
  },
  text: { color: color.bg, fontSize: font.body, fontWeight: '700' },
  track: {
    flex: 1,
    height: 6,
    borderRadius: 4,
    overflow: 'hidden',
    backgroundColor: 'rgba(13,15,19,0.2)',
  },
  fill: { height: '100%', backgroundColor: color.bg },
  skip: { color: color.bg, fontSize: font.label, fontWeight: '800' },
});
