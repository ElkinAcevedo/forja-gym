import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import type { FieldSpec, SetField, SetValues } from '@/domain/workout';
import { color, font, radius, size, space } from '@/theme';

import { ConfirmDialog } from '../ConfirmDialog';
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
  /** Elimina la serie; sin él (p. ej. si es la única) el número no se puede tocar. */
  onDelete?: () => void;
};

/**
 * Una serie del registro: un stepper por campo y el botón ✓ que la confirma o la desmarca.
 * Tocar el número pregunta si eliminar la serie.
 */
export function SetRow({
  number,
  fields,
  values,
  previous,
  weightStep,
  saved,
  onChange,
  onToggleSaved,
  onDelete,
}: Props) {
  const [confirming, setConfirming] = useState(false);

  return (
    <View style={styles.row}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Eliminar serie ${number}`}
        disabled={!onDelete}
        onPress={() => setConfirming(true)}
        hitSlop={4}
        style={styles.numberColumn}>
        <Text style={styles.number}>{number}</Text>
        {onDelete && <Text style={styles.delete}>✕</Text>}
      </Pressable>
      <ConfirmDialog
        visible={confirming}
        title={`¿Eliminar la serie ${number}?`}
        message={saved ? 'También se borra de este entrenamiento.' : undefined}
        confirmTitle="Eliminar"
        onConfirm={() => {
          setConfirming(false);
          onDelete?.();
        }}
        onCancel={() => setConfirming(false)}
      />

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
  numberColumn: { width: 22, height: size.control, justifyContent: 'center' },
  number: {
    textAlign: 'center',
    color: color.textMuted,
    fontWeight: '700',
  },
  delete: { color: color.textMuted, fontSize: font.tiny, textAlign: 'center' },
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
