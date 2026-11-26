import { useCallback, useEffect, useRef } from 'react';

/**
 * Repite una acción a intervalos fijos mientras el usuario mantiene pulsado un botón.
 *
 * `start` siempre detiene la repetición anterior antes de empezar otra: así dos gestos
 * seguidos (o dos botones a la vez) nunca dejan un temporizador suelto.
 * La repetición se detiene sola si el componente se desmonta.
 */
export function useHoldRepeat(intervalMs: number) {
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const stop = useCallback(() => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  }, []);

  const start = useCallback(
    (tick: () => void) => {
      stop();
      timer.current = setInterval(tick, intervalMs);
    },
    [intervalMs, stop],
  );

  useEffect(() => stop, [stop]);

  return { start, stop };
}
