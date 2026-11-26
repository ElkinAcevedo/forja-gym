import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

/**
 * Carga los datos de una pantalla cada vez que se vuelve a ella, para que reflejen lo
 * último que se guardó (p. ej. al volver de registrar un entrenamiento).
 * `load` debe ser estable (definido fuera del componente o con useCallback).
 */
export function useFocusData<T>(load: () => T): T | null {
  const [data, setData] = useState<T | null>(null);

  useFocusEffect(
    useCallback(() => {
      setData(load());
    }, [load]),
  );

  return data;
}
