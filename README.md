<div align="center">

# FORJA

**Registra tus cargas en un toque. Mira cómo progresas. Diseña tus rutinas con imágenes.**

[![CI](https://github.com/ElkinAcevedo/forja-gym/actions/workflows/ci.yml/badge.svg)](https://github.com/ElkinAcevedo/forja-gym/actions/workflows/ci.yml)
![Expo SDK 58](https://img.shields.io/badge/Expo-SDK%2058-000?logo=expo)
![TypeScript](https://img.shields.io/badge/TypeScript-strict-3178C6?logo=typescript&logoColor=white)
![Plataforma](https://img.shields.io/badge/plataforma-Android%20%7C%20iOS-C8F135)
[![Licencia MIT](https://img.shields.io/badge/licencia-MIT-blue)](LICENSE)

</div>

FORJA es una app móvil de gimnasio **local-first**: funciona sin conexión, guarda cada serie al instante en el teléfono y solo usa la nube como respaldo opcional.

> **Estado:** en desarrollo activo, Fase 0 (base del proyecto). Consulta la [hoja de ruta](#hoja-de-ruta).

## Funcionalidades

- **Registro rápido:** las series se precargan con tu última sesión. Ajustas con `+ / −`, confirmas con ✓ y arranca el temporizador de descanso.
- **Progreso:** gráfica por ejercicio, 1RM estimado, récords y nivel de Principiante a Élite ajustado a tu peso corporal.
- **Rutinas por día:** eliges ejercicios y máquinas por imagen y ves en vivo los músculos que trabajas.
- **Rutinas populares:** PPL, Upper/Lower, Full Body, Arnold Split y Bro Split, explicadas día por día.
- **Asistente:** eliges un estilo y tus días por semana, y te propone configuraciones con la frecuencia por grupo muscular.
- **Perfil:** objetivo (fuerza, hipertrofia o resistencia), metas, logros, racha con recuperaciones y exportación a CSV.

El diseño de referencia está en [`docs/mockup.html`](docs/mockup.html): un mockup interactivo de 10 pantallas. Ábrelo en el navegador.

## Stack

| Capa              | Tecnología                                                           |
| ----------------- | -------------------------------------------------------------------- |
| App               | [Expo](https://expo.dev) SDK 58 · React Native · TypeScript estricto |
| Navegación        | Expo Router                                                          |
| Datos locales     | SQLite + Drizzle ORM _(Fase 0)_                                      |
| Respaldo opcional | Supabase _(Fase 4)_                                                  |
| Calidad           | ESLint · Prettier · Jest · GitHub Actions                            |

## Empezar

Requisitos: Node.js 24 (ver [`.nvmrc`](.nvmrc)) y la app [Expo Go](https://expo.dev/go) en tu móvil.

```bash
git clone https://github.com/ElkinAcevedo/forja-gym.git
cd forja-gym
npm install
npx expo start
```

Escanea el código QR con Expo Go. El móvil y el ordenador tienen que estar en la misma red WiFi; si no conecta, usa `npx expo start --tunnel`.

### Scripts

| Comando             | Qué hace                                          |
| ------------------- | ------------------------------------------------- |
| `npm start`         | Arranca el servidor de desarrollo                 |
| `npm run lint`      | Revisa el código y el formato (ESLint + Prettier) |
| `npm run typecheck` | Comprueba los tipos de TypeScript                 |
| `npm test`          | Ejecuta las pruebas con Jest                      |
| `npm run format`    | Corrige el formato de todo el proyecto            |

## Estructura

```
src/
  app/          pantallas (cada archivo es una ruta de Expo Router)
  components/   componentes de interfaz reutilizables
  hooks/        lógica de interfaz reutilizable
  domain/       reglas del negocio, funciones puras con pruebas
  theme.ts      tokens de diseño: colores, tamaños, radios y espacios
docs/           mockup y convenciones de código
```

Las reglas de estilo, nombres, comentarios y Git están en [`docs/convenciones.md`](docs/convenciones.md).

## Diseño

Tema oscuro con **Grafito** `#0D0F13` y **Lima** `#C8F135` como base. El lima marca lo activo y lo que sube; el **Coral** `#FF6B4A` aparece solo cuando algo baja.

## Hoja de ruta

- [ ] **Fase 0 · Base:** proyecto, base de datos, catálogo de ejercicios y sistema de diseño
- [ ] **Fase 1 · Registro (MVP):** inicio, registro rápido, selector por imagen y temporizador
- [ ] **Fase 2 · Rutinas:** mis rutinas, editor de día, rutinas populares y asistente
- [ ] **Fase 3 · Progreso y perfil:** gráficas, niveles, metas, logros e imágenes de ejercicios
- [ ] **Fase 4 · Nube y respaldo:** cuenta, sincronización y copia de seguridad

## Licencia

[MIT](LICENSE) © 2026 Elkin Acevedo
