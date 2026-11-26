# Convenciones de código

Reglas para que el código de FORJA sea fácil de leer, de cambiar y de crecer.

## Estructura

| Carpeta           | Contiene                                    | Regla                                                                                                          |
| ----------------- | ------------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| `src/app/`        | Pantallas (rutas de Expo Router)            | Solo componen piezas; sin lógica de negocio                                                                    |
| `src/components/` | Componentes de interfaz reutilizables       | Reciben datos por props; no acceden a la base de datos                                                         |
| `src/hooks/`      | Lógica de interfaz reutilizable (`useAlgo`) | Un comportamiento por hook                                                                                     |
| `src/domain/`     | Reglas del negocio: series, niveles, 1RM…   | Funciones puras, sin React Native, siempre con pruebas                                                         |
| `src/db/`         | Esquema de SQLite, cliente y migraciones    | El esquema se cambia en `schema/` y luego `npm run db:generate`; las migraciones generadas no se editan a mano |
| `src/theme.ts`    | Colores, tamaños, radios y espacios         | Única fuente de valores visuales                                                                               |

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
