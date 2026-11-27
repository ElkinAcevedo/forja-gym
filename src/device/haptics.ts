/**
 * Respuesta táctil de la app (documento de diseño, apartado 9.6).
 * Es un extra: si el dispositivo no la soporta, se ignora el error en lugar de interrumpir
 * el registro de la serie.
 */
import * as Haptics from 'expo-haptics';
import { Vibration } from 'react-native';

const ignore = () => {};

/** Toque leve al confirmar una serie con ✓. */
export const confirmSetFeedback = () =>
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(ignore);

/** Celebración al batir un récord. */
export const recordFeedback = () =>
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(ignore);

/** Fin del descanso con la app abierta, cuando no hay notificación que lo avise. */
export const restEndFeedback = () => Vibration.vibrate([0, 400, 200, 400]);
