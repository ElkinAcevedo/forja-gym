import type { AchievementRule } from '../../domain/achievements';

/** Logros del perfil (mockup). */
export const ACHIEVEMENTS = [
  { id: 'first_pr', name: 'Primer récord', icon: '🏆', rule: { type: 'first_pr' } },
  { id: 'streak_10', name: 'Racha de 10 días', icon: '🔥', rule: { type: 'streak', days: 10 } },
  { id: 'workouts_100', name: '100 entrenos', icon: '💪', rule: { type: 'workouts', count: 100 } },
  {
    id: 'ton_day',
    name: '1 tonelada en un día',
    icon: '🏋️',
    rule: { type: 'day_volume', kg: 1000 },
  },
  {
    id: 'months_3',
    name: '3 meses seguidos',
    icon: '📅',
    rule: { type: 'consecutive_months', months: 3 },
  },
  {
    id: 'bench_100',
    name: 'Banca 100 kg',
    icon: '🥇',
    rule: { type: 'exercise_weight', exerciseId: 'banca', kg: 100 },
  },
  { id: 'streak_30', name: 'Racha de 30 días', icon: '⚡', rule: { type: 'streak', days: 30 } },
  { id: 'level_advanced', name: 'Nivel Avanzado', icon: '👑', rule: { type: 'level', level: 3 } },
] as const satisfies readonly { id: string; name: string; icon: string; rule: AchievementRule }[];
