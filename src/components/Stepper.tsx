import { useEffect, useRef } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { color, radius } from '@/theme';

type Props = {
  value: number;
  onChange: (value: number) => void;
  step: number;
  min?: number;
  unit?: string;
  label: string; // para lectores de pantalla, p. ej. "Peso"
  done?: boolean; // serie confirmada
};

const HOLD_DELAY = 400;
const HOLD_EVERY = 90;

// Redondea a 2 decimales para que 2.5 + 2.5 + … no acumule errores de coma flotante.
export const stepValue = (value: number, delta: number, min = 0) =>
  Math.max(min, Math.round((value + delta) * 100) / 100);

export function Stepper({ value, onChange, step, min = 0, unit, label, done }: Props) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const stop = () => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
  };
  useEffect(() => stop, []);

  // Al mantener pulsado, el valor sigue cambiando. Se cuenta desde el valor inicial del gesto
  // para no depender de que la pantalla ya se haya actualizado.
  const start = (delta: number) => {
    let current = stepValue(value, delta, min);
    onChange(current);
    const repeat = () => {
      current = stepValue(current, delta, min);
      onChange(current);
      timer.current = setTimeout(repeat, HOLD_EVERY);
    };
    timer.current = setTimeout(repeat, HOLD_DELAY);
  };

  const shown = `${value}${unit ? ` ${unit}` : ''}`;

  return (
    <View
      accessible
      accessibilityRole="adjustable"
      accessibilityLabel={label}
      accessibilityValue={{ text: shown }}
      accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
      onAccessibilityAction={(e) => onChange(stepValue(value, e.nativeEvent.actionName === 'increment' ? step : -step, min))}
      style={[styles.box, done && styles.done]}>
      <StepButton sign="−" onPressIn={() => start(-step)} onPressOut={stop} />
      <Text style={styles.value}>
        {value}
        {unit ? <Text style={styles.unit}> {unit}</Text> : null}
      </Text>
      <StepButton sign="+" onPressIn={() => start(step)} onPressOut={stop} />
    </View>
  );
}

function StepButton({ sign, onPressIn, onPressOut }: { sign: string; onPressIn: () => void; onPressOut: () => void }) {
  return (
    <Pressable onPressIn={onPressIn} onPressOut={onPressOut} hitSlop={6} style={styles.btn}>
      {({ pressed }) => <Text style={[styles.sign, pressed && { color: color.accent }]}>{sign}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    backgroundColor: color.surface2,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: color.line,
  },
  done: { backgroundColor: color.accentSoft, borderColor: 'transparent' },
  btn: { width: 44, height: '100%', alignItems: 'center', justifyContent: 'center' },
  sign: { fontSize: 22, color: color.textMuted },
  value: { flex: 1, textAlign: 'center', fontSize: 19, fontWeight: '700', color: color.text },
  unit: { fontSize: 11, fontWeight: '500', color: color.textMuted },
});
