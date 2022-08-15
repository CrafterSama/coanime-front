import NextAuth from 'next-auth';
import type { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

const options: NextAuthOptions = {
  debug: true,
  session: {},
  jwt: {},
  providers: [
    CredentialsProvider({
      name: 'CoanimeAuth',
      credentials: {
        email: {
          required: true,
          type: 'email',
        },
        password: {
          required: true,
          type: 'password',
        },
      },
      async authorize(credentials) {
        const res = await fetch(
          `${process.env.NEXTAUTH_URL}/api/auth/coanime-auth`,
          {
            method: 'POST',
            body: JSON.stringify(credentials),
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );

        const user = await res.json();

        if (res.ok && user) {
          return user;
        }

        return null;
      },
    }),
  ],
};

export default NextAuth(options);
