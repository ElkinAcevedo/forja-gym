/**
 * Dibujo del cuerpo del mapa muscular, en un lienzo de 200 × 400 con el eje en x = 100.
 *
 * Para que los dos lados sean siempre simétricos, solo se dibuja el lado derecho de cada
 * músculo par (`mirrored: true`) y la app lo refleja para obtener el izquierdo.
 * Los músculos del centro (abdominales, trapecio, lumbar) se dibujan completos.
 * La espalda alta (romboides) es par y queda entre el trapecio y los dorsales.
 */
import type { MuscleId } from '@/db/seed/muscles';
import type { BodyView } from '@/domain/enums';

export const BODY_VIEWBOX = { width: 200, height: 400 } as const;

/** Transformación SVG que refleja un trazado sobre el eje central del cuerpo. */
export const MIRROR_TRANSFORM = `translate(${BODY_VIEWBOX.width},0) scale(-1,1)`;

export type MuscleDrawing = { mirrored: boolean; paths: readonly string[] };

const side = (...paths: string[]): MuscleDrawing => ({ mirrored: true, paths });
const center = (...paths: string[]): MuscleDrawing => ({ mirrored: false, paths });

/** Silueta neutra sobre la que se pintan los músculos. */
export const BODY_OUTLINE = {
  head: 'M100 6C113 6 120 17 120 30C120 44 111 52 100 52C89 52 80 44 80 30C80 17 87 6 100 6Z',
  /** Lado derecho del cuerpo (cuello, torso, brazo, pierna); se refleja para el izquierdo. */
  rightHalf:
    'M100 50C104 50 108 52 109 58L110 64C118 68 130 70 140 74C152 78 158 88 159 102' +
    'C160 118 158 140 159 160C162 182 166 206 167 230C170 240 170 252 166 262' +
    'C163 268 157 266 156 258C155 250 156 240 154 232C150 214 146 196 144 180' +
    'C142 166 140 148 138 132C137 150 136 170 134 188C136 200 140 212 140 226' +
    'C142 252 138 280 132 304C130 312 130 318 132 326C134 346 130 366 124 382' +
    'C124 388 130 392 128 396C122 400 110 400 106 396C104 388 108 380 106 370' +
    'C102 352 102 334 104 318C104 300 102 270 101 240L100 236Z',
} as const;

// Compartidos por las dos vistas: se ven igual de frente y de espalda.
// El deltoide se parte en dos: la cara externa (lateral) y la que mira al torso, que de
// frente es el anterior y de espalda el posterior.
const deltoidOuter = side(
  'M145 77C152 80 158 90 158 102C158 112 154 120 149 123C148 108 147 92 145 77Z',
);
const deltoidInner = side(
  'M140 76C142 76 144 76 145 77C147 92 148 108 149 123L148 124C144 112 138 100 130 90C132 82 135 78 140 76Z',
);
const upperArm = side(
  'M146 128C153 128 157 138 157 150C157 162 153 170 148 172C143 170 140 160 140 148C140 138 142 130 146 128Z',
);
const forearm = side(
  'M148 178C156 180 160 196 162 212C164 224 164 236 162 244C158 248 154 246 152 238C149 222 145 204 144 190C144 182 145 178 148 178Z',
);

/** Músculos visibles en cada vista. Deltoide lateral, antebrazos y gemelos aparecen en las dos. */
export const MUSCLE_DRAWINGS: Record<BodyView, Partial<Record<MuscleId, MuscleDrawing>>> = {
  front: {
    deltoide_anterior: deltoidInner,
    deltoide_lateral: deltoidOuter,
    pecho: side('M102 82C112 76 126 78 132 86C138 94 140 104 134 112C126 120 112 120 102 114Z'),
    biceps: upperArm,
    antebrazos: forearm,
    // Seis cuadros y la parte baja del abdomen.
    abs: center(
      'M88 120h11v17h-11Z',
      'M101 120h11v17h-11Z',
      'M88 140h11v17h-11Z',
      'M101 140h11v17h-11Z',
      'M88 160h11v18h-11Z',
      'M101 160h11v18h-11Z',
      'M89 181h10v18C95 204 92 198 89 192Z',
      'M101 181h10v11C108 198 105 204 101 199Z',
    ),
    oblicuos: side(
      'M115 120C124 118 132 122 134 130C134 150 133 170 130 186C126 194 118 198 115 194Z',
    ),
    // Cuádriceps: parte externa y la "gota" interna sobre la rodilla. Los aductores ocupan
    // la cara interna del muslo, junto a la ingle.
    aductores: side(
      'M101 238C103 230 106 225 111 222C114 236 113 250 107 261C105 261 103 260 101 258Z',
    ),
    cuadriceps: side(
      'M113 221C120 214 130 217 136 228C140 252 136 282 128 304C126 310 122 310 120 304C121 286 115 272 109 263C115 250 116 235 113 221Z',
      'M103 262C113 270 121 288 119 302C116 312 106 312 103 304C101 292 101 276 103 262Z',
    ),
    gemelos: side(
      'M108 324C116 318 126 322 128 336C130 352 126 368 120 378C116 382 110 380 108 372C105 356 105 338 108 324Z',
    ),
  },
  back: {
    trapecio: center(
      'M100 54C108 60 120 68 134 74C126 84 116 92 108 98L100 102L92 98C84 92 74 84 66 74C80 68 92 60 100 54Z',
    ),
    espalda_alta: side(
      'M101 105L109 101C117 95 126 87 133 80C136 86 137 92 136 97C126 101 116 110 107 121L101 129Z',
    ),
    deltoide_posterior: deltoidInner,
    deltoide_lateral: deltoidOuter,
    dorsales: side(
      'M108 124C116 112 126 100 137 98C141 114 139 136 131 154C124 166 114 172 106 172C104 156 104 138 108 124Z',
    ),
    triceps: upperArm,
    antebrazos: forearm,
    lumbar: center('M93 176C97 180 103 180 107 176L110 198C104 202 96 202 90 198Z'),
    abductores: side(
      'M113 200C121 192 130 189 135 192C137 199 138 206 137 213C131 205 122 201 113 202Z',
    ),
    gluteos: side(
      'M101 206C114 200 132 204 137 218C140 234 132 250 118 252C108 252 102 246 101 238Z',
    ),
    isquios: side(
      'M104 258C116 254 132 256 136 266C138 284 132 302 124 312C116 314 108 312 106 304C102 288 102 272 104 258Z',
    ),
    gemelos: side(
      'M107 320C118 314 130 320 132 336C134 352 128 366 120 374C114 376 108 368 106 356C104 344 104 330 107 320Z',
    ),
  },
};
