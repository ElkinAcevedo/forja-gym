import { Circle, Ellipse, Path, Rect } from 'react-native-svg';

/** Figura SVG descrita como datos, para guardar dibujos (mapa muscular, íconos) sin JSX. */
export type ShapeData =
  | { kind: 'circle'; cx: number; cy: number; r: number }
  | { kind: 'ellipse'; cx: number; cy: number; rx: number; ry: number }
  | { kind: 'rect'; x: number; y: number; width: number; height: number; rx?: number }
  | { kind: 'path'; d: string };

/** Dibuja una `ShapeData`. El color y el trazo los hereda del `<G>` que la contiene. */
export function Shape({ shape }: { shape: ShapeData }) {
  switch (shape.kind) {
    case 'circle':
      return <Circle cx={shape.cx} cy={shape.cy} r={shape.r} />;
    case 'ellipse':
      return <Ellipse cx={shape.cx} cy={shape.cy} rx={shape.rx} ry={shape.ry} />;
    case 'rect':
      return (
        <Rect x={shape.x} y={shape.y} width={shape.width} height={shape.height} rx={shape.rx} />
      );
    case 'path':
      return <Path d={shape.d} />;
  }
}
