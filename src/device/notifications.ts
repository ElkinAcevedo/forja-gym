/**
 * Aviso de fin de descanso con una notificación local: suena y vibra aunque el móvil esté
 * bloqueado o la app en segundo plano. Funciona en Expo Go (solo las push remotas no).
 */
import * as Notifications from 'expo-notifications';
import { AndroidImportance } from 'expo-notifications';
import { Platform } from 'react-native';

const REST_CHANNEL_ID = 'rest-timer';
const REST_VIBRATION_MS = [0, 400, 200, 400];

let prepared: Promise<boolean> | null = null;

/**
 * Configura las notificaciones una sola vez y pide permiso si hace falta.
 * Devuelve si el usuario las permite. En Android 13+ el permiso solo se puede pedir
 * después de crear el canal.
 */
function prepareNotifications(): Promise<boolean> {
  prepared ??= (async () => {
    // Con la app abierta también se muestra el aviso y suena.
    Notifications.setNotificationHandler({
      handleNotification: async () => ({
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      }),
    });
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync(REST_CHANNEL_ID, {
        name: 'Descanso entre series',
        importance: AndroidImportance.HIGH,
        vibrationPattern: REST_VIBRATION_MS,
      });
    }
    const current = await Notifications.getPermissionsAsync();
    if (current.granted) return true;
    return (await Notifications.requestPermissionsAsync()).granted;
  })();
  return prepared;
}

/**
 * Programa el aviso de fin de descanso dentro de `seconds`. Devuelve su id para poder
 * cancelarlo, o null si el usuario no permite notificaciones.
 */
export async function scheduleRestEnd(seconds: number, exerciseName: string) {
  if (!(await prepareNotifications())) return null;
  return Notifications.scheduleNotificationAsync({
    content: { title: '⏱ Descanso terminado', body: `Siguiente serie de ${exerciseName}` },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: Math.max(1, Math.round(seconds)),
      channelId: REST_CHANNEL_ID,
    },
  });
}

/** Cancela un aviso programado (al saltar o cambiar el descanso). */
export async function cancelRestEnd(notificationId: string) {
  await Notifications.cancelScheduledNotificationAsync(notificationId);
}
