import { useMigrations } from 'drizzle-orm/expo-sqlite/migrator';
import type { ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, font, space } from '@/theme';

import { db } from './client';
import migrations from './migrations/migrations';

/**
 * Aplica las migraciones pendientes de la base de datos antes de mostrar la app.
 * Mientras tanto no pinta nada (la operación tarda milisegundos); si falla, muestra el error
 * en lugar de dejar que las pantallas trabajen con un esquema incompleto.
 */
export function MigrationGate({ children }: { children: ReactNode }) {
  const { success, error } = useMigrations(db, migrations);

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>No se pudo preparar la base de datos</Text>
        <Text style={styles.detail}>{error.message}</Text>
      </View>
    );
  }

  if (!success) return null;

  return children;
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: space.screen,
    gap: space.sm,
    backgroundColor: color.bg,
  },
  title: { color: color.down, fontSize: font.body, fontWeight: '700', textAlign: 'center' },
  detail: { color: color.textMuted, fontSize: font.caption, textAlign: 'center' },
});
