import { useEffect, useState } from 'react';

/**
 * Hora actual (ms) que se actualiza cada `intervalMs` mientras `active` sea true.
 * Sirve para relojes y cuentas atrás; apagado no consume batería.
 */
export function useNow(active: boolean, intervalMs = 1000): number {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!active) return;
    const timer = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(timer);
  }, [active, intervalMs]);

  return now;
}
