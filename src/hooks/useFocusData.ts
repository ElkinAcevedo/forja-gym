import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

/**
 * Carga los datos de una pantalla cada vez que se vuelve a ella, para que reflejen lo
 * último que se guardó (p. ej. al volver de registrar un entrenamiento).
 * `load` debe ser estable (definido fuera del componente o con useCallback).
 * Devuelve los datos y `reload`, para recargarlos tras un cambio hecho en la propia pantalla.
 */
export function useFocusData<T>(load: () => T): [data: T | null, reload: () => void] {
  const [data, setData] = useState<T | null>(null);
  const reload = useCallback(() => setData(load()), [load]);

  useFocusEffect(reload);

  return [data, reload];
}
