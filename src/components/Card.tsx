import { StyleSheet, View, type ViewProps } from 'react-native';

import { color, radius, space } from '@/theme';

type Props = ViewProps & {
  /** Tarjeta destacada con tinte lima, p. ej. el entrenamiento de hoy. */
  hero?: boolean;
};

/** Contenedor con fondo, borde y esquinas redondeadas. Acepta todas las props de View. */
export function Card({ hero = false, style, ...rest }: Props) {
  return <View style={[styles.card, hero && styles.hero, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: color.surface1,
    borderColor: color.line,
    borderWidth: 1,
    borderRadius: radius.card,
    padding: space.lg,
  },
  hero: { backgroundColor: color.heroBg, borderColor: color.heroBorder },
});
