import { StyleSheet, View, type ViewProps } from 'react-native';

import { color, radius } from '@/theme';

type Props = ViewProps & { hero?: boolean };

export function Card({ hero, style, ...rest }: Props) {
  return <View style={[styles.card, hero && styles.hero, style]} {...rest} />;
}

const styles = StyleSheet.create({
  card: { backgroundColor: color.surface1, borderColor: color.line, borderWidth: 1, borderRadius: radius.card, padding: 16 },
  hero: { backgroundColor: color.heroBg, borderColor: color.heroBorder },
});
