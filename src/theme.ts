// Tokens del sistema de diseño (doc de diseño, apartado 9). Tema oscuro único.
export const color = {
  bg: '#0D0F13', // Grafito
  accent: '#C8F135', // Lima: lo activo y lo que sube
  accentSoft: 'rgba(200,241,53,.14)',
  muscleSecondary: 'rgba(200,241,53,.42)',
  muscleOff: '#353B47',
  heroBg: '#1A2011', // tarjeta destacada (tono plano del degradado del mockup)
  heroBorder: '#3A4A14',
  surface1: '#16191F',
  surface2: '#1E222A',
  line: '#2A2F39',
  down: '#FF6B4A', // Coral: solo bajadas y alertas
  text: '#F2F4F7',
  textMuted: '#8A93A3',
} as const;

export const radius = { card: 22, button: 16, control: 14, pill: 99 } as const;

export const space = { screen: 18, gap: 10 } as const;

export const font = { xxl: 30, xl: 26, lg: 21, md: 16, sm: 14, xs: 12, xxs: 11 } as const;
