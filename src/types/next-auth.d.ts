declare module 'next-auth' {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      roles?: any[];
      [key: string]: any;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
    image?: string | null;
    roles?: any[];
    [key: string]: any;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken?: string;
    user?: {
      id: string;
      email: string;
      name: string | null;
      image: string | null;
      roles?: any[];
      [key: string]: any;
    };
  }
}
