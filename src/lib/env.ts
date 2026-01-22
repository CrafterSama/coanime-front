/**
 * Validación y exportación de variables de entorno
 * Este archivo valida que las variables críticas estén presentes
 * y exporta todas las variables de entorno tipadas
 */

// Variables de entorno requeridas (críticas para el funcionamiento)
const requiredEnvVars = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
} as const;

// Variables de entorno opcionales (con valores por defecto o undefined)
const optionalEnvVars = {
  NEXT_PUBLIC_GA_ID: process.env.NEXT_PUBLIC_GA_ID,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  NEXTAUTH_URL_INTERNAL: process.env.NEXTAUTH_URL_INTERNAL,
  ALGOLIA_APP_ID: process.env.ALGOLIA_APP_ID,
  ALGOLIA_SECRET: process.env.ALGOLIA_SECRET,
  GMAPS_API_KEY: process.env.GMAPS_API_KEY,
  NODE_ENV: process.env.NODE_ENV || 'development',
} as const;

// Validar variables requeridas
if (typeof window === 'undefined') {
  // Solo validar en el servidor (build time)
  Object.entries(requiredEnvVars).forEach(([key, value]) => {
    if (!value) {
      throw new Error(
        `❌ Variable de entorno requerida faltante: ${key}\n` +
          `Por favor, configura esta variable en tu archivo .env o .env.local\n` +
          `Ver .env.example para más información.`
      );
    }
  });
}

// Exportar todas las variables tipadas
export const env = {
  ...requiredEnvVars,
  ...optionalEnvVars,
} as const;

// Exportar tipos para TypeScript
export type Env = typeof env;

// Helpers para acceso seguro
export const getEnv = (key: keyof typeof env): string | undefined => {
  return env[key];
};

export const requireEnv = (key: keyof typeof requiredEnvVars): string => {
  const value = env[key];
  if (!value) {
    throw new Error(`Variable de entorno requerida faltante: ${key}`);
  }
  return value;
};
