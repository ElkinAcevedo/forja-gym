import { useCallback, useEffect, useRef, useState } from 'react';

import { db } from '@/db/client';
import { restEndFeedback } from '@/device/haptics';
import { cancelRestEnd, scheduleRestEnd } from '@/device/notifications';
import { adjustRest } from '@/domain/rest';
import { saveRestPreference } from '@/services/preferences';

export type Rest = {
  exerciseId: string;
  exerciseName: string;
  /** Momento (ms) en que termina el descanso. */
  endsAt: number;
  totalSeconds: number;
};

type RestExercise = { id: string; name: string; restSeconds: number };

/**
 * Descanso entre series: cuenta atrás, aviso con notificación (también con el móvil
 * bloqueado) y ajuste de ±15 s que se recuerda para el ejercicio.
 *
 * @param onRestSaved se llama cuando el usuario ajusta el descanso de un ejercicio, para
 *   que la siguiente serie ya use el nuevo valor.
 */
export function useRestTimer(onRestSaved: (exerciseId: string, seconds: number) => void) {
  const [rest, setRest] = useState<Rest | null>(null);
  // La notificación se programa de forma asíncrona: se guarda la promesa de su id.
  const notification = useRef<Promise<string | null> | null>(null);
  // Si el usuario no permite notificaciones, el fin del descanso se avisa vibrando.
  const notificationsAllowed = useRef(true);

  const cancelNotification = useCallback(() => {
    const pending = notification.current;
    notification.current = null;
    pending
      ?.then((id) => {
        if (id) return cancelRestEnd(id);
      })
      .catch(() => {});
  }, []);

  const scheduleNotification = useCallback(
    (seconds: number, exerciseName: string) => {
      cancelNotification();
      notification.current = scheduleRestEnd(seconds, exerciseName)
        .then((id) => {
          notificationsAllowed.current = id !== null;
          return id;
        })
        .catch(() => null);
    },
    [cancelNotification],
  );

  // Si se sale del registro con un descanso en marcha, no queda un aviso huérfano.
  useEffect(() => cancelNotification, [cancelNotification]);

  const start = useCallback(
    (exercise: RestExercise) => {
      setRest({
        exerciseId: exercise.id,
        exerciseName: exercise.name,
        endsAt: Date.now() + exercise.restSeconds * 1000,
        totalSeconds: exercise.restSeconds,
      });
      scheduleNotification(exercise.restSeconds, exercise.name);
    },
    [scheduleNotification],
  );

  /** Suma o resta tiempo al descanso en curso y lo recuerda para ese ejercicio. */
  const adjust = useCallback(
    (deltaSeconds: number) => {
      if (!rest) return;
      const totalSeconds = adjustRest(rest.totalSeconds, deltaSeconds);
      const endsAt = rest.endsAt + (totalSeconds - rest.totalSeconds) * 1000;
      setRest({ ...rest, totalSeconds, endsAt });
      scheduleNotification(Math.max(1, (endsAt - Date.now()) / 1000), rest.exerciseName);
      saveRestPreference(db, rest.exerciseId, totalSeconds, new Date());
      onRestSaved(rest.exerciseId, totalSeconds);
    },
    [rest, scheduleNotification, onRestSaved],
  );

  /** "Saltar": termina el descanso ahora y cancela el aviso. */
  const skip = useCallback(() => {
    cancelNotification();
    setRest(null);
  }, [cancelNotification]);

  /** La cuenta llegó a 0 con la app abierta: la notificación ya avisa; si no hay, vibra. */
  const finish = useCallback(() => {
    notification.current = null;
    setRest(null);
    if (!notificationsAllowed.current) restEndFeedback();
  }, []);

  return { rest, start, adjust, skip, finish };
}
