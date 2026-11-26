import { useEffect, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { parseInput, stepValue } from '@/domain/numbers';
import { color, radius } from '@/theme';

type Props = {
  value: number;
  onChange: (value: number) => void;
  step: number;
  min?: number;
  max: number;
  precision?: number; // múltiplo permitido: 0.5 en kg, 1 en reps
  unit?: string;
  label: string; // para lectores de pantalla, p. ej. "Peso"
  done?: boolean; // serie confirmada
};

const HOLD_EVERY = 90;

export function Stepper({ value, onChange, step, min = 0, max, precision = 1, unit, label, done }: Props) {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  const [draft, setDraft] = useState<string | null>(null); // texto mientras se escribe

  const stop = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };
  useEffect(() => stop, []);

  const tap = (delta: number) => onChange(stepValue(value, delta, min, max, precision));

  // Mantener pulsado: repite desde el valor actual. Siempre detiene la repetición anterior,
  // así dos gestos seguidos nunca dejan un temporizador suelto.
  const hold = (delta: number) => {
    stop();
    let current = value;
    timer.current = setInterval(() => {
      current = stepValue(current, delta, min, max, precision);
      onChange(current);
    }, HOLD_EVERY);
  };

  const commit = () => {
    const n = draft === null ? null : parseInput(draft, min, max, precision);
    if (n !== null) onChange(n);
    setDraft(null);
  };

  return (
    <View style={[styles.box, done && styles.done]}>
      <StepButton sign="−" label={`Restar ${step} ${unit ?? ''} a ${label}`} onTap={() => tap(-step)} onHold={() => hold(-step)} onRelease={stop} />
      <View style={styles.center}>
        <TextInput
          accessibilityLabel={label}
          value={draft ?? String(value)}
          onFocus={() => setDraft(String(value))}
          onChangeText={setDraft}
          onBlur={commit}
          onSubmitEditing={commit}
          keyboardType={precision < 1 ? 'decimal-pad' : 'number-pad'}
          returnKeyType="done"
          selectTextOnFocus
          maxLength={6}
          style={styles.value}
        />
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>
      <StepButton sign="+" label={`Sumar ${step} ${unit ?? ''} a ${label}`} onTap={() => tap(step)} onHold={() => hold(step)} onRelease={stop} />
    </View>
  );
}

type StepButtonProps = { sign: string; label: string; onTap: () => void; onHold: () => void; onRelease: () => void };

function StepButton({ sign, label, onTap, onHold, onRelease }: StepButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onTap}
      onLongPress={onHold}
      delayLongPress={400}
      onPressOut={onRelease}
      hitSlop={6}
      style={styles.btn}>
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
  center: { flex: 1, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' },
  value: { minWidth: 24, padding: 0, textAlign: 'center', fontSize: 19, fontWeight: '700', color: color.text },
  unit: { marginLeft: 2, fontSize: 11, fontWeight: '500', color: color.textMuted },
});
