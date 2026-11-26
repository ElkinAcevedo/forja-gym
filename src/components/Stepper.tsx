import { useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { parseInput, stepValue } from '@/domain/numbers';
import { useHoldRepeat } from '@/hooks/useHoldRepeat';
import { color, font, radius, size } from '@/theme';

const HOLD_DELAY_MS = 400; // tiempo pulsado antes de empezar a repetir
const HOLD_INTERVAL_MS = 90; // velocidad de la repetición

type Props = {
  value: number;
  onChange: (value: number) => void;
  /** Lo que suma o resta cada toque de + / −. */
  step: number;
  min?: number;
  max: number;
  /** Múltiplo permitido: 0.5 para kg, 1 para reps. Define también el teclado. */
  precision?: number;
  unit?: string;
  /** Nombre para lectores de pantalla, p. ej. "Peso". */
  label: string;
  /** Serie confirmada: se tiñe de lima. */
  done?: boolean;
};

/**
 * Control numérico con botones − / + y el valor en el centro.
 * - Toque corto: cambia un paso.
 * - Mantener pulsado: repite el paso hasta soltar.
 * - Tocar el número: abre el teclado numérico para escribir el valor.
 */
export function Stepper({
  value,
  onChange,
  step,
  min = 0,
  max,
  precision = 1,
  unit,
  label,
  done,
}: Props) {
  const hold = useHoldRepeat(HOLD_INTERVAL_MS);
  const [draft, setDraft] = useState<string | null>(null); // texto mientras se escribe

  const change = (from: number, delta: number) => stepValue(from, delta, min, max, precision);

  const startHold = (delta: number) => {
    // Cuenta desde el valor del momento en que empieza el gesto, sin esperar a que la
    // pantalla se actualice entre repeticiones.
    let current = value;
    hold.start(() => {
      current = change(current, delta);
      onChange(current);
    });
  };

  const commitDraft = () => {
    const typed = draft === null ? null : parseInput(draft, min, max, precision);
    if (typed !== null) onChange(typed);
    setDraft(null); // si no es válido, vuelve a mostrar el valor anterior
  };

  const amount = unit ? `${step} ${unit}` : `${step}`;

  return (
    <View style={[styles.box, done && styles.done]}>
      <StepButton
        sign="−"
        accessibilityLabel={`Restar ${amount} a ${label}`}
        onTap={() => onChange(change(value, -step))}
        onHold={() => startHold(-step)}
        onRelease={hold.stop}
      />

      <View style={styles.center}>
        <TextInput
          accessibilityLabel={label}
          value={draft ?? String(value)}
          onFocus={() => setDraft(String(value))}
          onChangeText={setDraft}
          onBlur={commitDraft}
          onSubmitEditing={commitDraft}
          keyboardType={precision < 1 ? 'decimal-pad' : 'number-pad'}
          returnKeyType="done"
          selectTextOnFocus
          maxLength={6}
          style={styles.value}
        />
        {unit ? <Text style={styles.unit}>{unit}</Text> : null}
      </View>

      <StepButton
        sign="+"
        accessibilityLabel={`Sumar ${amount} a ${label}`}
        onTap={() => onChange(change(value, step))}
        onHold={() => startHold(step)}
        onRelease={hold.stop}
      />
    </View>
  );
}

type StepButtonProps = {
  sign: string;
  accessibilityLabel: string;
  onTap: () => void;
  onHold: () => void;
  onRelease: () => void;
};

function StepButton({ sign, accessibilityLabel, onTap, onHold, onRelease }: StepButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onTap}
      onLongPress={onHold}
      delayLongPress={HOLD_DELAY_MS}
      onPressOut={onRelease}
      hitSlop={6}
      style={styles.button}>
      {({ pressed }) => <Text style={[styles.sign, pressed && styles.signPressed]}>{sign}</Text>}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  box: {
    flexDirection: 'row',
    alignItems: 'center',
    height: size.control,
    backgroundColor: color.surface2,
    borderRadius: radius.control,
    borderWidth: 1,
    borderColor: color.line,
  },
  done: { backgroundColor: color.accentSoft, borderColor: 'transparent' },
  button: { width: size.touch, height: '100%', alignItems: 'center', justifyContent: 'center' },
  sign: { fontSize: font.heading, color: color.textMuted },
  signPressed: { color: color.accent },
  center: { flex: 1, flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center' },
  value: {
    minWidth: 24,
    padding: 0,
    textAlign: 'center',
    fontSize: font.value,
    fontWeight: '700',
    color: color.text,
  },
  unit: { marginLeft: 2, fontSize: font.tiny, fontWeight: '500', color: color.textMuted },
});
