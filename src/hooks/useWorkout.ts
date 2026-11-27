import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';

import { db } from '@/db/client';
import { newId } from '@/db/ids';
import { confirmSetFeedback, recordFeedback } from '@/device/haptics';
import {
  addSetCopy,
  buildDraftSets,
  isExerciseDone,
  type DraftSet,
  type SetField,
} from '@/domain/workout';
import {
  deleteSet,
  finishSession,
  getWorkoutExercise,
  getWorkoutPlan,
  removeSet,
  saveSet,
  type WorkoutPlan,
} from '@/services/session';

import { useRestTimer } from './useRestTimer';

type State = {
  plan: WorkoutPlan;
  /** Series en pantalla de cada ejercicio, por id de ejercicio. */
  drafts: Record<string, DraftSet[]>;
  sessionId: string | null;
  currentId: string | null;
};

function loadState(chosenDayId: string | undefined): State {
  const plan = getWorkoutPlan(db, new Date(), chosenDayId);
  const drafts = Object.fromEntries(
    plan.exercises.map((e) => [
      e.card.id,
      buildDraftSets(
        e.scheme.sets,
        e.card.tracking,
        e.lastSession,
        plan.settings.autofill,
        e.savedSets,
      ),
    ]),
  );
  // Empieza en el primer ejercicio que aún no está terminado.
  const current =
    plan.exercises.find((e) => !isExerciseDone(drafts[e.card.id])) ?? plan.exercises[0];
  return { plan, drafts, sessionId: plan.session?.id ?? null, currentId: current?.card.id ?? null };
}

/**
 * Estado y acciones del registro de un entrenamiento. La pantalla solo dibuja; aquí se
 * coordinan las series en pantalla, el guardado en la base de datos y el descanso
 * (ver `useRestTimer`).
 *
 * shortcut: al volver a la pestaña se recarga desde la base de datos, así que los ajustes de
 * series aún sin confirmar vuelven a los valores precargados. Si molesta, guardar el borrador.
 */
export function useWorkout(chosenDayId: string | undefined) {
  const [state, setState] = useState<State | null>(null);

  // Al ajustar el descanso de un ejercicio, las siguientes series ya usan el nuevo valor.
  const onRestSaved = useCallback((exerciseId: string, restSeconds: number) => {
    setState(
      (s) =>
        s && {
          ...s,
          plan: {
            ...s.plan,
            exercises: s.plan.exercises.map((e) =>
              e.card.id === exerciseId ? { ...e, restSeconds } : e,
            ),
          },
        },
    );
  }, []);
  const restTimer = useRestTimer(onRestSaved);

  useFocusEffect(
    useCallback(() => {
      setState(loadState(chosenDayId));
    }, [chosenDayId]),
  );

  const updateSets = (exerciseId: string, update: (sets: DraftSet[]) => DraftSet[]) =>
    setState(
      (s) => s && { ...s, drafts: { ...s.drafts, [exerciseId]: update(s.drafts[exerciseId]) } },
    );

  // El descanso sigue corriendo al cambiar de ejercicio: es normal prepararse mientras tanto.
  const selectExercise = (exerciseId: string) =>
    setState((s) => s && { ...s, currentId: exerciseId });

  const changeValue = (exerciseId: string, index: number, field: SetField, value: number) =>
    updateSets(exerciseId, (sets) =>
      sets.map((set, i) =>
        i === index ? { ...set, values: { ...set.values, [field]: value } } : set,
      ),
    );

  /** Confirma o desmarca una serie. Devuelve si la serie confirmada es un récord. */
  const toggleSet = (exerciseId: string, index: number): { isPr: boolean } => {
    if (!state) return { isPr: false };
    const set = state.drafts[exerciseId][index];
    const now = new Date();

    if (set.savedSetId) {
      deleteSet(db, set.savedSetId, now);
      updateSets(exerciseId, (sets) =>
        sets.map((s, i) => (i === index ? { ...s, savedSetId: null } : s)),
      );
      return { isPr: false };
    }

    const result = saveSet(
      db,
      {
        sessionId: state.sessionId,
        routineDayId: state.plan.day?.id ?? null,
        exerciseId,
        position: index,
        values: set.values,
      },
      now,
      newId,
    );
    setState(
      (s) =>
        s && {
          ...s,
          sessionId: result.sessionId,
          drafts: {
            ...s.drafts,
            [exerciseId]: s.drafts[exerciseId].map((d, i) =>
              i === index ? { ...d, savedSetId: result.setId } : d,
            ),
          },
          // Un récord sube el "Récord" de la ficha en el momento.
          plan: result.isPr
            ? {
                ...s.plan,
                exercises: s.plan.exercises.map((e) =>
                  e.card.id === exerciseId ? { ...e, bestWeightKg: set.values.weightKg } : e,
                ),
              }
            : s.plan,
        },
    );
    const exercise = state.plan.exercises.find((e) => e.card.id === exerciseId);
    if (exercise) {
      restTimer.start({
        id: exerciseId,
        name: exercise.card.name,
        restSeconds: exercise.restSeconds,
        autoRestSeconds: exercise.autoRestSeconds,
      });
    }
    if (result.isPr) recordFeedback();
    else confirmSetFeedback();
    return { isPr: result.isPr };
  };

  /**
   * Añade un ejercicio elegido en el selector y lo muestra. Si ya estaba, solo lo selecciona.
   * No se guarda nada hasta que se confirme su primera serie.
   */
  const addExercise = (exerciseId: string) => {
    if (!state) return;
    if (state.plan.exercises.some((e) => e.card.id === exerciseId)) {
      selectExercise(exerciseId);
      return;
    }
    const exercise = getWorkoutExercise(db, exerciseId, state.sessionId);
    const sets = buildDraftSets(
      exercise.scheme.sets,
      exercise.card.tracking,
      exercise.lastSession,
      state.plan.settings.autofill,
      [],
    );
    setState(
      (s) =>
        s && {
          ...s,
          currentId: exerciseId,
          plan: { ...s.plan, exercises: [...s.plan.exercises, exercise] },
          drafts: { ...s.drafts, [exerciseId]: sets },
        },
    );
  };

  const addSet = (exerciseId: string, tracking: Parameters<typeof addSetCopy>[1]) =>
    updateSets(exerciseId, (sets) => addSetCopy(sets, tracking));

  /** Quita una serie de la lista y, si estaba guardada, de la sesión. */
  const deleteDraftSet = (exerciseId: string, index: number) => {
    if (state?.sessionId) removeSet(db, state.sessionId, exerciseId, index, new Date());
    updateSets(exerciseId, (sets) => sets.filter((_, i) => i !== index));
  };

  /** Termina el entrenamiento (si llegó a empezar) y deja la pantalla lista para otro. */
  const finish = () => {
    if (state?.sessionId) finishSession(db, state.sessionId, new Date());
    restTimer.skip();
    setState(loadState(undefined));
  };

  return {
    state,
    rest: restTimer.rest,
    adjustRest: restTimer.adjust,
    resetRest: restTimer.reset,
    skipRest: restTimer.skip,
    finishRest: restTimer.finish,
    selectExercise,
    addExercise,
    changeValue,
    toggleSet,
    addSet,
    deleteDraftSet,
    finish,
  };
}
