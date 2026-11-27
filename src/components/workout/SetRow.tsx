import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { FieldSpec, SetField, SetValues } from '@/domain/workout';
import { color, font, radius, size, space } from '@/theme';

import { Stepper } from '../Stepper';

type Props = {
  /** Número de serie, empezando en 1. */
  number: number;
  fields: readonly FieldSpec[];
  values: SetValues;
  /** Valores de esta serie en la última sesión, para mostrarlos debajo como referencia. */
  previous?: SetValues;
  /** Lo que suma cada + / − del peso, en la unidad de pantalla (ajuste del perfil). */
  weightStep: number;
  saved: boolean;
  onChange: (field: SetField, value: number) => void;
  onToggleSaved: () => void;
};

/** Una serie del registro: un stepper por campo y el botón ✓ que la confirma o la desmarca. */
export function SetRow({
  number,
  fields,
  values,
  previous,
  weightStep,
  saved,
  onChange,
  onToggleSaved,
}: Props) {
  return (
    <View style={styles.row}>
      <Text style={styles.number}>{number}</Text>

      {fields.map((spec) => {
        const stored = values[spec.field];
        const last = previous?.[spec.field];
        return (
          <View key={spec.field} style={styles.field}>
            <Stepper
              label={`${spec.label}, serie ${number}`}
              value={stored === null ? 0 : spec.toDisplay(stored)}
              onChange={(shown) => onChange(spec.field, spec.fromDisplay(shown))}
              step={spec.field === 'weightKg' ? weightStep : spec.precision}
              min={spec.min}
              max={spec.max}
              precision={spec.precision}
              unit={spec.unit}
              done={saved}
            />
            {last != null && (
              <Text style={styles.previous}>
                ant. {spec.toDisplay(last)}
                {spec.unit ? ` ${spec.unit}` : ''}
              </Text>
            )}
          </View>
        );
      })}

      <Pressable
        accessibilityRole="checkbox"
        accessibilityState={{ checked: saved }}
        accessibilityLabel={`Serie ${number} hecha`}
        onPress={onToggleSaved}
        hitSlop={4}
        style={[styles.check, saved && styles.checkSaved]}>
        <Text style={[styles.checkMark, saved && styles.checkMarkSaved]}>✓</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: space.sm,
    paddingVertical: space.sm,
    borderBottomWidth: 1,
    borderBottomColor: color.line,
  },
  number: {
    width: 22,
    lineHeight: size.control,
    textAlign: 'center',
    color: color.textMuted,
    fontWeight: '700',
  },
  field: { flex: 1, gap: 3 },
  previous: { color: color.textMuted, fontSize: font.tiny, textAlign: 'center' },
  check: {
    width: size.touch,
    height: size.control,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.control,
    borderWidth: 2,
    borderColor: color.line,
  },
  checkSaved: { backgroundColor: color.accent, borderColor: color.accent },
  checkMark: { color: 'transparent', fontSize: 20, fontWeight: '900' },
  checkMarkSaved: { color: color.bg },
});
