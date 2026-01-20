import type { NextAuthOptions } from 'next-auth';
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

/**
 * Configuración de Auth.js (next-auth) usando un proveedor de credenciales
 * que delega el login en la API interna `/api/auth/coanime-auth`.
 *
 * Esta ruta interna ya se encarga de hablar con Laravel y devolver los datos del usuario.
 */

export const authOptions: NextAuthOptions = {
  session: {
    strategy: 'jwt',
  },
  providers: [
    Credentials({
      name: 'Email and Password',
      credentials: {
        email: {
          label: 'Email',
          type: 'email',
          placeholder: 'you@example.com',
        },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          const baseUrl =
            process.env.NEXTAUTH_URL_INTERNAL ??
            process.env.NEXTAUTH_URL ??
            'http://localhost:3000';

          // Llamar a nuestra API interna que maneja CSRF correctamente
          const res = await fetch(`${baseUrl}/api/auth/coanime-auth`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) {
            const errorData = await res.json().catch(() => ({}));
            console.error(
              '[Auth.js] Error en coanime-auth:',
              res.status,
              errorData
            );
            return null;
          }

          const data = await res.json();

          // Ajusta esta parte según la estructura que devuelva tu API
          const user = (data && (data.user || data.data || data)) || null;

          if (!user) {
            return null;
          }

          // Lo que devuelves aquí se guarda en el JWT (callback jwt) y luego en session
          return user as any;
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('[Auth.js] Error en authorize', error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      // Cuando el usuario hace login, `user` tiene la data retornada por authorize
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      // Exponer el usuario completo en session
      if ((token as any).user) {
        (session as any).user = (token as any).user;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
