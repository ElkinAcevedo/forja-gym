# Convenciones de código

Reglas para que el código de FORJA sea fácil de leer, de cambiar y de crecer.

## Estructura

| Carpeta           | Contiene                                          | Regla                                                                                                          |
| ----------------- | ------------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `src/app/`        | Pantallas (rutas de Expo Router)                  | Solo componen piezas; sin lógica de negocio                                                                    |
| `src/components/` | Componentes de interfaz reutilizables             | Reciben datos por props; no acceden a la base de datos                                                         |
| `src/hooks/`      | Lógica de interfaz reutilizable (`useAlgo`)       | Un comportamiento por hook                                                                                     |
| `src/domain/`     | Reglas del negocio: series, niveles, 1RM…         | Funciones puras, sin React Native, siempre con pruebas                                                         |
| `src/db/`         | Esquema de SQLite, cliente y migraciones          | El esquema se cambia en `schema/` y luego `npm run db:generate`; las migraciones generadas no se editan a mano |
| `src/services/`   | Lectura y escritura de datos para las pantallas   | Reciben la base de datos como parámetro, para poder probarse con sql.js                                        |
| `src/device/`     | Funciones del teléfono: notificaciones, vibración | Aisladas aquí; los fallos de lo que es un extra (p. ej. vibrar) no interrumpen al usuario                      |
| `src/theme.ts`    | Colores, tamaños, radios y espacios               | Única fuente de valores visuales                                                                               |

## Catálogo

Los ejercicios, músculos, rutinas populares y logros están en `src/db/seed/`, tipados: si un ejercicio menciona un músculo que no existe, TypeScript da error.

Para cambiar el catálogo: edita esos archivos y **sube `CATALOG_VERSION`** en `src/db/seed/index.ts`. La app lo recarga al arrancar sin tocar los entrenamientos del usuario.

## Nombres

- Código en **inglés** (`stepValue`, `useHoldRepeat`); textos de la app y comentarios en **español**.
- Componentes en `PascalCase.tsx` (`Stepper.tsx`); hooks y módulos en `camelCase.ts` (`useHoldRepeat.ts`).
- Pruebas junto al archivo que prueban: `numbers.ts` → `numbers.test.ts`.
- Constantes de configuración en `UPPER_SNAKE_CASE` (`HOLD_DELAY_MS`), con la unidad en el nombre.

## Componentes

- Un componente exportado por archivo, con un comentario `/** … */` que diga para qué sirve.
- Props tipadas con `type Props`; las no obvias, documentadas.
- Estilos con `StyleSheet.create` al final del archivo y valores de `theme.ts`, nunca números sueltos.
- Accesibilidad: rol y etiqueta en todo lo que se toca; área táctil mínima de 44 pt.

## Comentarios

Explican el **porqué**, no el qué. Si un comentario repite lo que ya dice el código, sobra.

```ts
// Mal: suma delta al valor
// Bien: redondear evita que 2.5 + 2.5 + … acumule errores de coma flotante
```

## Calidad

Antes de abrir un pull request, los tres comandos deben pasar (la CI los repite):

```bash
npm run lint       # ESLint + formato Prettier
npm run typecheck  # TypeScript estricto
npm test           # pruebas con Jest
```

`npm run format` corrige el formato de todo el proyecto.

## Git

- Una rama por tarea: `feat/…`, `fix/…`, `chore/…`, `docs/…`, `refactor/…`, `test/…`.
- Commits en formato [Conventional Commits](https://www.conventionalcommits.org/es/), en español e imperativo: `feat: añade el temporizador de descanso`.
- Todo entra a `main` por pull request con la CI en verde, con squash merge.
