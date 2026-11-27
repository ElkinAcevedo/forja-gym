import { StyleSheet, View } from 'react-native';

import type { EquipmentId } from '@/db/seed/equipment';
import type { MuscleId } from '@/db/seed/muscles';
import { color, radius } from '@/theme';

import { BodyMap, preferredView } from './body/BodyMap';
import { EquipmentIcon } from './icons/EquipmentIcon';

type Props = {
  primary: readonly MuscleId[];
  secondary: readonly MuscleId[];
  equipment: EquipmentId;
  /** Lado del cuadrado en puntos. */
  size: number;
  /** Resalta la miniatura, p. ej. el ejercicio que se está registrando. */
  active?: boolean;
};

/**
 * "Imagen" de un ejercicio: mapa muscular de la vista que mejor lo muestra y una insignia
 * con el equipo. Ocupa el lugar de la ilustración hasta que existan las imágenes con IA.
 */
export function ExerciseThumb({ primary, secondary, equipment, size, active = false }: Props) {
  const badge = Math.round(size * 0.3);

  return (
    <View
      style={[
        styles.box,
        { width: size, height: size, padding: size * 0.03 },
        active && styles.active,
      ]}>
      <BodyMap
        view={preferredView(primary)}
        height={size * 0.94}
        primary={primary}
        secondary={secondary}
      />
      <View style={[styles.badge, { width: badge, height: badge }]}>
        <EquipmentIcon equipment={equipment} size={badge * 0.62} color={color.accent} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.thumbBg,
    borderRadius: radius.thumb,
    borderWidth: 1,
    borderColor: color.line,
  },
  active: { borderWidth: 2, borderColor: color.accent },
  badge: {
    position: 'absolute',
    right: 4,
    bottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: color.bg,
    borderRadius: radius.badge,
    borderWidth: 1,
    borderColor: color.line,
  },
});
