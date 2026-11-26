import { useEffect, useState, type ReactNode } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { color, font, space } from '@/theme';

import { setupDatabase } from './setup';

type SetupState = { status: 'loading' } | { status: 'ready' } | { status: 'error'; error: Error };

/** Estado de la preparación de la base de datos (migraciones + catálogo). */
function useDatabaseSetup(): SetupState {
  const [state, setState] = useState<SetupState>({ status: 'loading' });

  useEffect(() => {
    let mounted = true;
    setupDatabase().then(
      () => mounted && setState({ status: 'ready' }),
      (error: unknown) =>
        mounted &&
        setState({
          status: 'error',
          error: error instanceof Error ? error : new Error(String(error)),
        }),
    );
    return () => {
      mounted = false;
    };
  }, []);

  return state;
}

/**
 * Muestra la app solo cuando la base de datos está lista. Mientras tanto no pinta nada
 * (tarda milisegundos); si falla, muestra el error en lugar de dejar que las pantallas
 * trabajen con datos incompletos.
 */
export function DatabaseGate({ children }: { children: ReactNode }) {
  const setup = useDatabaseSetup();

  if (setup.status === 'error') {
    return (
      <View style={styles.center}>
        <Text style={styles.title}>No se pudo preparar la base de datos</Text>
        <Text style={styles.detail}>{setup.error.message}</Text>
      </View>
    );
  }

  if (setup.status === 'loading') return null;

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
