import { requireEnv } from '@/lib/env';
import axios from 'axios';
import CredentialsProvider from 'next-auth/providers/credentials';

interface User {
  id: string;
  email: string;
  name: string | null;
  image?: string | null;
  roles?: any[];
  [key: string]: any; // Permitir cualquier otra propiedad
}

interface AuthResponse {
  data?: {
    user: User;
    access_token?: string;
  };
  status?: number;
}

export const authOptions = {
  pages: {
    signIn: '/login',
    error: '/login',
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
  debug: process.env.NODE_ENV === 'development',
  trustHost: true,
  providers: [
    CredentialsProvider({
      name: 'Email and Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          // Crear una instancia de axios para el servidor con la URL completa
          const apiUrl = requireEnv('NEXT_PUBLIC_API_URL');

          // Variable para almacenar las cookies de sesión entre peticiones
          let sessionCookies: string[] = [];

          const serverAxios = axios.create({
            baseURL: apiUrl,
            headers: {
              Accept: 'application/json',
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
            withCredentials: true,
            maxRedirects: 5,
          });

          // Interceptor para capturar cookies de las respuestas
          serverAxios.interceptors.response.use(
            (response) => {
              const setCookieHeader = response.headers['set-cookie'];
              if (setCookieHeader) {
                const cookies = Array.isArray(setCookieHeader)
                  ? setCookieHeader
                  : [setCookieHeader];

                // Agregar nuevas cookies, evitando duplicados
                cookies.forEach((cookie) => {
                  const cookieName = cookie.split('=')[0];
                  // Remover cookie existente con el mismo nombre si existe
                  sessionCookies = sessionCookies.filter(
                    (c) => !c.startsWith(cookieName + '=')
                  );
                  // Agregar la nueva cookie
                  sessionCookies.push(cookie);
                });

                if (process.env.NODE_ENV === 'development') {
                  // eslint-disable-next-line no-console
                  console.log(
                    '[NextAuth] Cookies capturadas:',
                    cookies.length,
                    'nuevas cookies'
                  );
                  // eslint-disable-next-line no-console
                  console.log(
                    '[NextAuth] Total cookies en sesión:',
                    sessionCookies.length
                  );
                  // eslint-disable-next-line no-console
                  console.log(
                    '[NextAuth] Nombres de cookies:',
                    sessionCookies.map((c) => c.split('=')[0])
                  );
                }
              }
              return response;
            },
            (error) => {
              return Promise.reject(error);
            }
          );

          // Interceptor para agregar cookies a las peticiones
          serverAxios.interceptors.request.use(
            (config) => {
              if (sessionCookies.length > 0 && config.headers) {
                // Agregar las cookies de sesión a la cabecera Cookie
                const cookieHeader = sessionCookies
                  .map((cookie) => cookie.split(';')[0]) // Solo el nombre=valor, sin atributos
                  .join('; ');
                config.headers['Cookie'] = cookieHeader;

                if (process.env.NODE_ENV === 'development') {
                  // eslint-disable-next-line no-console
                  console.log(
                    '[NextAuth] Agregando cookies a petición:',
                    config.url,
                    {
                      cookieCount: sessionCookies.length,
                      hasCookieHeader: !!cookieHeader,
                    }
                  );
                }
              } else if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.warn(
                  '[NextAuth] No hay cookies para agregar a la petición:',
                  config.url
                );
              }
              return config;
            },
            (error) => {
              return Promise.reject(error);
            }
          );

          // Paso 1: Obtener XSRF-TOKEN de Laravel Sanctum desde el servidor
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log(
              '[NextAuth] Obteniendo XSRF-TOKEN de:',
              `${apiUrl}/sanctum/csrf-cookie`
            );
          }

          // Limpiar cookies anteriores
          sessionCookies = [];

          const csrfResponse = await serverAxios.get('/sanctum/csrf-cookie');

          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('[NextAuth] Respuesta CSRF:', {
              status: csrfResponse.status,
              headers: Object.keys(csrfResponse.headers),
              hasSetCookie: !!csrfResponse.headers['set-cookie'],
            });
          }

          // Extraer el XSRF-TOKEN de las cookies de la respuesta
          const setCookieHeader = csrfResponse.headers['set-cookie'];
          let xsrfToken: string | undefined;

          if (setCookieHeader) {
            const cookies = Array.isArray(setCookieHeader)
              ? setCookieHeader
              : [setCookieHeader];
            const xsrfCookie = cookies.find((cookie) =>
              cookie.includes('XSRF-TOKEN=')
            );

            if (xsrfCookie) {
              // Extraer el valor del token (puede estar URL encoded)
              const match = xsrfCookie.match(/XSRF-TOKEN=([^;]+)/);
              if (match && match[1]) {
                xsrfToken = decodeURIComponent(match[1]);
                if (process.env.NODE_ENV === 'development') {
                  // eslint-disable-next-line no-console
                  console.log('[NextAuth] XSRF-TOKEN obtenido exitosamente');
                }
              }
            }
          }

          // Si no pudimos obtener el token, loguear el problema
          if (!xsrfToken) {
            if (process.env.NODE_ENV === 'development') {
              // eslint-disable-next-line no-console
              console.warn(
                '[NextAuth] No se pudo obtener XSRF-TOKEN de las cookies'
              );
              // eslint-disable-next-line no-console
              console.log('[NextAuth] Set-Cookie headers:', setCookieHeader);
            }
            // Intentar continuar sin token (puede que Laravel lo acepte en algunos casos)
          }

          // Paso 2: Hacer login a Laravel con las credenciales
          const data = {
            email: credentials.email,
            password: credentials.password,
          };

          // Configurar headers para el login
          const loginHeaders: Record<string, string> = {};
          if (xsrfToken) {
            loginHeaders['X-XSRF-TOKEN'] = xsrfToken;
          }

          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('[NextAuth] Intentando login a Laravel:', {
              url: `${apiUrl}/login`,
              hasXSRFToken: !!xsrfToken,
            });
          }

          const response = await serverAxios.post<AuthResponse>(
            '/login',
            data,
            {
              headers: loginHeaders,
            }
          );

          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.log('[NextAuth] Respuesta de Laravel login:', {
              status: response.status,
              statusText: response.statusText,
            });
          }

          // Laravel puede retornar 204 (No Content) cuando el login es exitoso
          // En ese caso, necesitamos obtener el usuario por separado
          if (response.status === 204 || response.status === 200) {
            // Intentar obtener el usuario desde diferentes endpoints posibles
            // Las cookies de sesión deberían estar en sessionCookies
            try {
              if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log(
                  '[NextAuth] Intentando obtener usuario, cookies disponibles:',
                  sessionCookies.length
                );
              }

              // Actualizar el XSRF-TOKEN si es necesario (puede haber cambiado)
              const updatedXSRFToken = xsrfToken; // Por ahora usar el mismo
              const userHeaders: Record<string, string> = {};
              if (updatedXSRFToken) {
                userHeaders['X-XSRF-TOKEN'] = updatedXSRFToken;
              }

              // Probar diferentes endpoints comunes de Laravel
              // Mantener /api/user por si el problema es la URL (https vs http)
              const possibleEndpoints = [
                '/internal/me',
                '/api/user',
                '/user',
                '/me',
              ];
              let userResponse: any = null;
              let lastError: any = null;

              for (const endpoint of possibleEndpoints) {
                try {
                  if (process.env.NODE_ENV === 'development') {
                    // eslint-disable-next-line no-console
                    console.log('[NextAuth] Intentando endpoint:', endpoint);
                  }

                  userResponse = await serverAxios.get(endpoint, {
                    headers: userHeaders,
                  });

                  // Si llegamos aquí, el endpoint funcionó
                  if (process.env.NODE_ENV === 'development') {
                    // eslint-disable-next-line no-console
                    console.log('[NextAuth] Endpoint exitoso:', endpoint);
                  }
                  break; // Salir del loop si encontramos un endpoint que funciona
                } catch (endpointError: any) {
                  lastError = endpointError;
                  if (process.env.NODE_ENV === 'development') {
                    // eslint-disable-next-line no-console
                    console.log(
                      '[NextAuth] Endpoint falló:',
                      endpoint,
                      'Status:',
                      endpointError?.response?.status
                    );
                  }
                  // Continuar con el siguiente endpoint
                }
              }

              if (!userResponse) {
                throw lastError || new Error('Todos los endpoints fallaron');
              }

              if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log('[NextAuth] Respuesta del endpoint:', {
                  status: userResponse.status,
                  hasData: !!userResponse.data,
                  dataKeys: userResponse.data
                    ? Object.keys(userResponse.data)
                    : [],
                  dataSample: JSON.stringify(userResponse.data).substring(
                    0,
                    200
                  ), // Primeros 200 caracteres
                });
              }

              // Laravel puede retornar el usuario directamente o dentro de data
              // El endpoint /internal/me retorna: { code, message, result: { id, name, email, ... } }
              // Intentar diferentes estructuras posibles
              let userData = null;

              if (userResponse.data) {
                // Probar diferentes estructuras (el endpoint /internal/me usa result)
                userData =
                  userResponse.data?.result ||
                  userResponse.data?.data?.user ||
                  userResponse.data?.user ||
                  userResponse.data?.data ||
                  userResponse.data;
              }

              if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.log('[NextAuth] Datos del usuario extraídos:', {
                  hasUserData: !!userData,
                  userDataType: typeof userData,
                  isArray: Array.isArray(userData),
                  hasEmail: !!userData?.email,
                  userId: userData?.id,
                  userKeys: userData ? Object.keys(userData) : [],
                });
              }

              if (userData && (userData.email || userData.id)) {
                // Retornar TODOS los datos del usuario para que Auth.js los guarde en el JWT
                // Incluyendo roles, y todas las demás propiedades
                const user = {
                  // Primero incluir todos los datos del usuario
                  ...userData,
                  // Luego sobrescribir campos específicos para asegurar formato correcto
                  id: String(userData.id || ''),
                  email: String(userData.email || credentials.email),
                  name: userData.name ? String(userData.name) : null,
                  image: userData.profile_photo_path || userData.image || null,
                  roles: userData.roles || [],
                  access_token:
                    userResponse.data?.access_token || userData?.access_token,
                };

                if (process.env.NODE_ENV === 'development') {
                  // eslint-disable-next-line no-console
                  console.log('[NextAuth] Usuario retornado a Auth.js:', {
                    id: user.id,
                    email: user.email,
                    hasName: !!user.name,
                    hasRoles: !!user.roles && Array.isArray(user.roles),
                    rolesCount: user.roles?.length || 0,
                    allKeys: Object.keys(user),
                  });
                }

                return user as User & { access_token?: string };
              }
            } catch (userError: any) {
              if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.error('[NextAuth] Error al obtener usuario:', {
                  status: userError?.response?.status,
                  message: userError?.message,
                });
              }
            }

            // Si el login fue exitoso (204 o 200) pero no pudimos obtener el usuario,
            // retornar un usuario básico con el email
            if (response.status === 204 || response.status === 200) {
              if (process.env.NODE_ENV === 'development') {
                // eslint-disable-next-line no-console
                console.warn(
                  '[NextAuth] Login exitoso pero no se pudo obtener usuario, usando email como fallback'
                );
              }
              return {
                id: '',
                email: String(credentials.email),
                name: null,
              } as User;
            }
          }

          // Si llegamos aquí, el login falló
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error(
              '[NextAuth] Login falló con status:',
              response.status
            );
          }

          return null;
        } catch (error: any) {
          // Log error in development
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.error('[NextAuth] Authorize error:', {
              message: error?.message,
              response: error?.response?.data,
              status: error?.response?.status,
              statusText: error?.response?.statusText,
              url: error?.config?.url,
              baseURL: error?.config?.baseURL,
            });
          }
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      if (user) {
        // Guardar TODOS los datos del usuario en el JWT
        // Incluyendo roles y todas las demás propiedades
        token.user = {
          id: String(user.id || ''),
          email: String(user.email || ''),
          name: user.name ? String(user.name) : null,
          image: user.image || user.profile_photo_path || null,
          roles: user.roles || [],
          // Incluir todas las demás propiedades del usuario
          ...Object.keys(user).reduce((acc: any, key) => {
            // Excluir campos que ya procesamos o que no queremos guardar
            if (
              ![
                'id',
                'email',
                'name',
                'image',
                'roles',
                'access_token',
              ].includes(key)
            ) {
              // Solo guardar valores serializables
              const value = user[key];
              if (value !== undefined && value !== null) {
                if (
                  typeof value === 'string' ||
                  typeof value === 'number' ||
                  typeof value === 'boolean'
                ) {
                  acc[key] = value;
                } else if (Array.isArray(value)) {
                  acc[key] = value;
                } else if (typeof value === 'object' && value !== null) {
                  // Intentar serializar objetos
                  try {
                    JSON.stringify(value);
                    acc[key] = value;
                  } catch {
                    // Si no es serializable, omitirlo
                  }
                }
              }
            }
            return acc;
          }, {}),
        };
        if (user.access_token) {
          token.accessToken = String(user.access_token);
        }
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      // Asegurar que solo retornamos datos serializables
      try {
        // Crear un nuevo objeto de sesión con datos serializables
        const serializableSession = {
          ...session,
          user: {
            id: '',
            email: '',
            name: null,
            image: null,
          },
        };

        // Actualizar desde token.user si está disponible
        // Incluir TODOS los datos del usuario, incluyendo roles
        if (
          token.user &&
          typeof token.user === 'object' &&
          !Array.isArray(token.user)
        ) {
          serializableSession.user = {
            id: token.user.id ? String(token.user.id) : '',
            email: token.user.email ? String(token.user.email) : '',
            name: token.user.name ? String(token.user.name) : null,
            image: token.user.image ? String(token.user.image) || null : null,
            roles: token.user.roles || [],
            // Incluir todas las demás propiedades del usuario
            ...Object.keys(token.user).reduce((acc: any, key) => {
              // Excluir campos que ya procesamos
              if (!['id', 'email', 'name', 'image', 'roles'].includes(key)) {
                const value = token.user[key];
                if (value !== undefined && value !== null) {
                  // Solo incluir valores serializables
                  if (
                    typeof value === 'string' ||
                    typeof value === 'number' ||
                    typeof value === 'boolean'
                  ) {
                    acc[key] = value;
                  } else if (Array.isArray(value)) {
                    acc[key] = value;
                  } else if (typeof value === 'object' && value !== null) {
                    try {
                      JSON.stringify(value);
                      acc[key] = value;
                    } catch {
                      // Omitir si no es serializable
                    }
                  }
                }
              }
              return acc;
            }, {}),
          };
        } else if (session.user) {
          // Fallback a session.user si token.user no está disponible
          serializableSession.user = {
            id: session.user.id ? String(session.user.id) : '',
            email: session.user.email ? String(session.user.email) : '',
            name: session.user.name ? String(session.user.name) || null : null,
            image: session.user.image
              ? String(session.user.image) || null
              : null,
          };
        }

        // Agregar accessToken si existe
        if (token.accessToken && typeof token.accessToken === 'string') {
          serializableSession.accessToken = token.accessToken;
        }

        return serializableSession;
      } catch (error) {
        // Si hay error, retornar una sesión mínima válida
        // eslint-disable-next-line no-console
        console.error('[NextAuth] Session callback error:', error);
        const fallbackExpires = new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000
        ).toISOString();
        return {
          expires: fallbackExpires,
          user: {
            id: '',
            email: '',
            name: null,
            image: null,
          },
        };
      }
    },
  },
};
