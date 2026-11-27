import type { ConfigContext, ExpoConfig } from 'expo/config';

/**
 * Variante de la app según APP_VARIANT (lo pone eas.json en el perfil development).
 * El build de desarrollo es otra app, "FORJA Dev", con su propio paquete: así convive con la
 * FORJA del gym y nunca hay que desinstalar esa (desinstalar borra los datos).
 * El resto de la configuración vive en app.json.
 */
const IS_DEV = process.env.APP_VARIANT === 'development';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: IS_DEV ? 'FORJA Dev' : 'FORJA',
  slug: 'forja',
  scheme: IS_DEV ? 'forja-dev' : 'forja',
  android: {
    ...config.android,
    package: IS_DEV ? 'com.elkinacevedo.forja.dev' : 'com.elkinacevedo.forja',
  },
  plugins: [
    ...(config.plugins ?? []),
    // Solo FORJA Dev responde al QR de `expo start`; la del gym no lo intercepta.
    ['expo-dev-client', { addGeneratedScheme: IS_DEV }],
  ],
});
