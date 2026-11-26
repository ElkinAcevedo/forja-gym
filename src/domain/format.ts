/** Textos de cifras tal como los muestra la app. */
import type { SetValues } from './workout';

/** Segundos como reloj: 75 → "1:15", 3725 → "62:05". */
export function formatClock(totalSeconds: number): string {
  const seconds = Math.max(0, Math.floor(totalSeconds));
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
}

/** Resumen de una serie: "80 kg × 8", "45 s", "500 m", "1:30 · 400 m". */
export function formatSet({ weightKg, reps, durationS, distanceM }: SetValues): string {
  if (weightKg !== null && reps !== null) return `${weightKg} kg × ${reps}`;
  const parts = [
    durationS !== null ? (durationS >= 60 ? formatClock(durationS) : `${durationS} s`) : null,
    distanceM !== null ? `${distanceM} m` : null,
    reps !== null ? `${reps} reps` : null,
  ].filter(Boolean);
  return parts.join(' · ') || '—';
}
