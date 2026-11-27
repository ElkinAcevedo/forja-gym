import { randomUUID } from 'expo-crypto';

import type { IdGenerator } from './types';

/** Id único para una fila nueva. Se genera en el dispositivo: no depende del servidor. */
export const newId: IdGenerator = () => randomUUID();
