import Svg, { G, Path } from 'react-native-svg';

import { MUSCLES, type MuscleId } from '@/db/seed/muscles';
import type { BodyView } from '@/domain/enums';
import { color } from '@/theme';

import {
  BODY_OUTLINE,
  BODY_VIEWBOX,
  MIRROR_TRANSFORM,
  MUSCLE_DRAWINGS,
  muscleLayers,
  type MuscleDrawing,
} from './bodyShapes';

type Props = {
  view: BodyView;
  /** Alto en puntos; el ancho sale de la proporción del dibujo. */
  height: number;
  primary?: readonly MuscleId[];
  secondary?: readonly MuscleId[];
  /** Modo calor: veces por semana que se trabaja cada músculo. Más veces, más intenso. */
  heat?: Partial<Record<MuscleId, number>>;
  /** Modo selector: cada músculo se puede tocar. */
  onPressMuscle?: (muscle: MuscleId) => void;
  selected?: MuscleId | null;
};

const VIEW_NAME: Record<BodyView, string> = { front: 'frontal', back: 'posterior' };

const muscleName = (id: MuscleId) => MUSCLES.find((m) => m.id === id)?.name ?? id;

/** Grosor de la línea que separa músculos vecinos y del borde del músculo seleccionado. */
const SEPARATOR_WIDTH = 1.4;
const SELECTED_WIDTH = 2.5;

/** Lima con opacidad según las veces por semana: 1 vez = suave, 4 o más = pleno. */
const heatFill = (times: number) => `rgba(200,241,53,${Math.min(0.25 + times * 0.2, 1)})`;

/**
 * Mapa muscular de frente o de espalda.
 * Pinta en lima los músculos principales y en lima translúcido los secundarios.
 */
export function BodyMap({
  view,
  height,
  primary = [],
  secondary = [],
  heat,
  onPressMuscle,
  selected,
}: Props) {
  const width = (height * BODY_VIEWBOX.width) / BODY_VIEWBOX.height;
  const muscles = Object.entries(MUSCLE_DRAWINGS[view]) as [MuscleId, MuscleDrawing][];

  const fillOf = (id: MuscleId) => {
    if (primary.includes(id)) return color.accent;
    if (secondary.includes(id)) return color.muscleSecondary;
    const times = heat?.[id] ?? 0;
    return times > 0 ? heatFill(times) : color.muscleOff;
  };

  const summary = [
    `Mapa muscular ${VIEW_NAME[view]}`,
    primary.length > 0 && `Principal: ${primary.map(muscleName).join(', ')}`,
    secondary.length > 0 && `Secundario: ${secondary.map(muscleName).join(', ')}`,
  ]
    .filter(Boolean)
    .join('. ');

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${BODY_VIEWBOX.width} ${BODY_VIEWBOX.height}`}
      // En modo selector cada músculo es un botón propio; si no, el mapa es una sola imagen.
      accessible={!onPressMuscle}
      accessibilityRole={onPressMuscle ? undefined : 'image'}
      accessibilityLabel={onPressMuscle ? undefined : summary}>
      <G fill={color.bodyBase}>
        <Path d={BODY_OUTLINE.head} />
        <Path d={BODY_OUTLINE.rightHalf} />
        <Path d={BODY_OUTLINE.rightHalf} transform={MIRROR_TRANSFORM} />
      </G>

      {/* Sin selector, los músculos del mismo color van juntos: muchas menos figuras SVG. */}
      {!onPressMuscle &&
        muscleLayers(view, fillOf).map((layer) => (
          <G
            key={layer.fill}
            fill={layer.fill}
            stroke={color.bodyBase}
            strokeWidth={SEPARATOR_WIDTH}>
            <Path d={layer.d} />
            {layer.mirroredD && <Path d={layer.mirroredD} transform={MIRROR_TRANSFORM} />}
          </G>
        ))}

      {onPressMuscle &&
        muscles.map(([id, drawing]) => {
          const isSelected = selected === id;
          return (
            <G
              key={id}
              fill={fillOf(id)}
              stroke={isSelected ? color.text : color.bodyBase}
              strokeWidth={isSelected ? SELECTED_WIDTH : SEPARATOR_WIDTH}
              onPress={() => onPressMuscle(id)}
              accessible
              accessibilityRole="button"
              accessibilityLabel={muscleName(id)}
              accessibilityState={{ selected: isSelected }}>
              {drawing.paths.map((d) => (
                <Path key={d} d={d} />
              ))}
              {drawing.mirrored &&
                drawing.paths.map((d) => (
                  <Path key={`mirror-${d}`} d={d} transform={MIRROR_TRANSFORM} />
                ))}
            </G>
          );
        })}
    </Svg>
  );
}

/** Vista en la que se ve mejor un ejercicio: la de su primer músculo principal. */
export const preferredView = (primary: readonly MuscleId[]): BodyView =>
  MUSCLES.find((m) => m.id === primary[0])?.view ?? 'front';
