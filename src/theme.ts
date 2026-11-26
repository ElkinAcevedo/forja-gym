/**
 * Tokens del sistema de diseño de FORJA (documento de diseño, apartado 9).
 * Toda medida o color de la interfaz sale de aquí: los componentes no usan valores sueltos.
 * Tema oscuro único.
 */

export const color = {
  bg: '#0D0F13', // Grafito: fondo de la app
  accent: '#C8F135', // Lima: lo activo y lo que sube
  accentSoft: 'rgba(200,241,53,.14)', // chips de músculo, series confirmadas
  muscleSecondary: 'rgba(200,241,53,.42)',
  muscleOff: '#353B47', // músculo no trabajado
  bodyBase: '#262B35', // silueta del mapa muscular
  thumbBg: '#1B1F27', // fondo de las miniaturas de ejercicio
  heroBg: '#1A2011', // tarjeta destacada (tono plano del degradado del mockup)
  heroBorder: '#3A4A14',
  surface1: '#16191F', // tarjetas
  surface2: '#1E222A', // controles
  line: '#2A2F39', // bordes y separadores
  down: '#FF6B4A', // Coral: solo bajadas y alertas
  text: '#F2F4F7',
  textMuted: '#8A93A3',
} as const;

export const font = {
  display: 30, // números grandes
  title: 26, // título de pantalla
  heading: 21,
  value: 19, // valor de un stepper o una estadística
  body: 16,
  label: 14,
  caption: 12,
  tiny: 11,
} as const;

/** Alturas de los controles. 44 es el mínimo táctil recomendado. */
export const size = {
  button: 52,
  buttonSmall: 44,
  control: 48,
  touch: 44,
} as const;

export const radius = {
  card: 22,
  button: 16,
  control: 14,
  thumb: 16,
  small: 12,
  badge: 8,
  pill: 99,
} as const;

export const space = { xs: 4, sm: 8, md: 12, lg: 16, screen: 18, gap: 10 } as const;
