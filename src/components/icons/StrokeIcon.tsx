import type { ColorValue } from 'react-native';
import Svg, { G } from 'react-native-svg';

import { Shape, type ShapeData } from '../svg/Shape';

type Props = {
  shapes: readonly ShapeData[];
  size: number;
  color: ColorValue;
  strokeWidth?: number;
};

/** Ícono de trazo en un lienzo de 24 × 24, con el estilo de línea redondeada del mockup. */
export function StrokeIcon({ shapes, size, color, strokeWidth = 2 }: Props) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <G
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round">
        {shapes.map((shape, i) => (
          <Shape key={i} shape={shape} />
        ))}
      </G>
    </Svg>
  );
}
