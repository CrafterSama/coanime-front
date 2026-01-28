import { requireEnv } from '@/lib/env';
import CredentialsProvider from 'next-auth/providers/credentials';

interface User {
  id: string;
  email: string;
  name: string | null;
  image?: string | null;
  roles?: any[];
  [key: string]: any; // Permitir cualquier otra propiedad
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
          // Obtener la URL del backend
          const apiUrl = requireEnv('NEXT_PUBLIC_BACKEND_URL');
          const serverApiUrl =
            process.env.NODE_ENV === 'production'
              ? 'https://api.coanime.net'
              : apiUrl;

          // Intentar diferentes endpoints posibles para login
          // Laravel puede tener la ruta en diferentes ubicaciones según la configuración
          const possibleEndpoints = [
            '/api/auth/login', // Ruta común con prefijo auth
            '/api/login', // Ruta directa (según JWT_INSTALLATION.md)
            '/login', // Ruta sin prefijo api
          ];

          let res: Response | null = null;
          let data: any = null;
          let lastError: any = null; // eslint-disable-line @typescript-eslint/no-unused-vars

          // Intentar cada endpoint hasta que uno funcione
          for (const endpoint of possibleEndpoints) {
            const fullUrl = `${serverApiUrl}${endpoint}`;

            // Debug disabled
            // if (process.env.NODE_ENV === 'development') {
            //   console.log('[NextAuth] Intentando login con JWT a Laravel:', {
            //     url: fullUrl,
            //     endpoint,
            //   });
            // }

            try {
              res = await fetch(fullUrl, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                  Accept: 'application/json',
                },
                body: JSON.stringify({
                  email: credentials.email,
                  password: credentials.password,
                }),
              });

              data = await res.json();

              // Si la respuesta es exitosa (200-299), usar este endpoint
              if (res.ok && data?.access_token) {
                // Debug disabled
                break; // Salir del loop si encontramos un endpoint que funciona
              }

              // Si no es exitoso pero no es 404, guardar el error
              if (res.status !== 404) {
                lastError = { status: res.status, data, endpoint };
              }
            } catch (error: any) {
              // Si es un error de red o 404, continuar con el siguiente endpoint
              if (error?.message?.includes('fetch') || res?.status === 404) {
                // Debug disabled
                continue;
              }
              // Para otros errores, guardar y continuar
              lastError = { error, endpoint }; // eslint-disable-line @typescript-eslint/no-unused-vars
            }
          }

          // Si no encontramos ningún endpoint que funcione
          if (!res || !res.ok || !data?.access_token || !data?.user) {
            // Debug disabled
            return null;
          }

          // Debug disabled

          // Verificar que la respuesta tenga el token y el usuario
          if (data?.access_token && data?.user) {
            const userData = data.user;

            // Construir el objeto usuario con todos los datos
            const user: User & { access_token?: string } = {
              ...userData, // Incluir todos los datos del usuario
              id: String(userData.id || ''),
              email: String(userData.email || credentials.email),
              name: userData.name || null,
              image: userData.profile_photo_path || userData.image || null,
              roles: userData.roles || [],
              access_token: data.access_token, // Guardar el token JWT
            };

            // Debug disabled

            // Retornar el usuario (será guardado en el JWT)
            return user as User & { access_token?: string };
          }

          // Si no hay token o usuario, el login falló
          // Debug disabled

          return null;
        } catch (error: any) {
          // Log error in development
          // Debug disabled
          return null;
        }
      },
    }),
  ],
  callbacks: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async jwt({ token, user }: any) {
      // Si hay un usuario (primera vez que se llama), guardar todos sus datos en el token
      if (user) {
        // Debug disabled

        // Guardar access_token en token.accessToken para que esté disponible en la sesión
        token.accessToken = user.access_token;
        // Guardar los datos del usuario en el token
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.image = user.image;
        token.roles = user.roles;
        // Guardar todas las demás propiedades del usuario
        Object.keys(user).forEach((key) => {
          if (
            !['id', 'email', 'name', 'image', 'roles', 'access_token'].includes(
              key
            )
          ) {
            token[key] = user[key];
          }
        });

        // Debug disabled
      }
      return token;
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    async session({ session, token }: any) {
      // Debug disabled

      // Asegurar que session.user tenga la estructura correcta
      if (token?.id) {
        session.user = {
          id: token.id,
          email: token.email || '',
          name: token.name || null,
          image: token.image || null,
          roles: token.roles || [],
          // Incluir todas las demás propiedades del token en el usuario
          ...Object.keys(token).reduce((acc: any, key) => {
            if (
              ![
                'id',
                'email',
                'name',
                'image',
                'roles',
                'accessToken',
                'iat',
                'exp',
                'jti',
                'sub',
                'picture',
              ].includes(key)
            ) {
              acc[key] = token[key];
            }
            return acc;
          }, {}),
        };
      } else {
        // Debug disabled
      }

      // Asegurar que accessToken esté disponible directamente en la sesión
      if (token?.accessToken) {
        session.accessToken = token.accessToken;
      }

      // Debug disabled

      return session;
    },
  },
};
