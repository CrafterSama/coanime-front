import { useEffect } from 'react';

import { signIn, signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';

import axios from '@/lib/axios';

type useAuthProps = {
  middleware?: 'auth' | 'guest';
  redirectIfAuthenticated?: string;
};

export const useAuth = ({
  middleware,
  redirectIfAuthenticated,
}: useAuthProps = {}) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const user = session?.user as any;

  const securePaths = [
    'dashboard',
    'dashboard/posts',
    'dashboard/titles',
    'dashboard/events',
    'dashboard/companies',
    'dashboard/users',
    'dashboard/people',
    'perfil',
    'mi-lista',
  ];

  const pathname = router.pathname.split('/')[1];

  const login = async ({
    setErrors,
    setStatus,
    email,
    password,
  }: {
    setErrors: (errors: string[]) => void;
    setStatus: (status: string | null) => void;
    email: string;
    password: string;
  }) => {
    setErrors([]);
    setStatus(null);

    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      callbackUrl: '/',
    });

    if (result?.error) {
      setErrors([result.error]);
      return;
    }

    setStatus('Login exitoso');
  };

  // Registro: Auth.js no tiene registro nativo, así que llamamos directamente a Laravel
  const register = async ({
    setErrors,
    ...props
  }: {
    setErrors: (errors: string[]) => void;
    [key: string]: any;
  }) => {
    setErrors([]);

    try {
      // Obtener CSRF cookie primero
      await axios.get('/sanctum/csrf-cookie');

      // Hacer el registro
      await axios.post('/register', props);

      // Si el registro es exitoso, hacer login automáticamente
      const loginResult = await signIn('credentials', {
        redirect: false,
        email: props.email,
        password: props.password,
        callbackUrl: '/',
      });

      if (loginResult?.error) {
        // Si el login falla después del registro, redirigir a login
        router.push('/login');
      }
    } catch (error: any) {
      if (error?.response?.status === 422) {
        // Errores de validación de Laravel
        const errors = error.response.data.errors;
        setErrors(Object.values(errors).flat() as string[]);
      } else {
        setErrors(['Error al registrar. Por favor, intenta de nuevo.']);
      }
    }
  };

  const logout = async (redirect: string | null = null) => {
    await signOut({
      callbackUrl: redirect ?? '/login',
    });
  };

  const onLogout = () => {
    if (securePaths.includes(pathname)) {
      const redirectWhenAuthenticated = router.asPath;
      return logout(redirectWhenAuthenticated);
    }
    return logout();
  };

  const forgotPassword = async ({
    setErrors,
    setStatus,
    email,
  }: {
    setErrors: (errors: string[]) => void;
    setStatus: (status: string | null) => void;
    email: string;
  }) => {
    setErrors([]);
    setStatus(null);

    try {
      // Obtener CSRF cookie primero
      await axios.get('/sanctum/csrf-cookie');

      // Hacer la petición de forgot password
      const response = await axios.post('/forgot-password', { email });
      setStatus(response.data.status);
    } catch (error: any) {
      if (error?.response?.status === 422) {
        // Errores de validación de Laravel
        const errors = error.response.data.errors;
        setErrors(Object.values(errors).flat() as string[]);
      } else if (
        error?.code === 'ERR_NETWORK' ||
        error?.message === 'Network Error'
      ) {
        // Error de red (CORS, URL incorrecta, etc.)
        setErrors([
          'Error de conexión. Verifica que la API esté disponible y configurada correctamente.',
        ]);
        console.error('[forgotPassword] Network Error:', error);
      } else {
        // Otros errores
        setErrors([
          'Error al enviar el email de recuperación. Intenta de nuevo.',
        ]);
        console.error('[forgotPassword] Error:', error);
      }
    }
  };

  const resetPassword = async ({
    setErrors,
    setStatus,
    ...props
  }: {
    setErrors: (errors: string[]) => void;
    setStatus: (status: string | null) => void;
    [key: string]: any;
  }) => {
    setErrors([]);
    setStatus(null);

    try {
      // Obtener CSRF cookie primero
      await axios.get('/sanctum/csrf-cookie');

      // Hacer la petición de reset password
      const response = await axios.post('/reset-password', {
        token: router.query.token,
        ...props,
      });

      router.push(
        '/login?reset=' + Buffer.from(response.data.status, 'base64').toString()
      );
    } catch (error: any) {
      if (error?.response?.status === 422) {
        // Errores de validación de Laravel
        const errors = error.response.data.errors;
        setErrors(Object.values(errors).flat() as string[]);
      } else if (
        error?.code === 'ERR_NETWORK' ||
        error?.message === 'Network Error'
      ) {
        // Error de red
        setErrors([
          'Error de conexión. Verifica que la API esté disponible y configurada correctamente.',
        ]);
        console.error('[resetPassword] Network Error:', error);
      } else {
        // Otros errores
        setErrors(['Error al restablecer la contraseña. Intenta de nuevo.']);
        console.error('[resetPassword] Error:', error);
      }
    }
  };

  const resendEmailVerification = ({
    setStatus,
  }: {
    setStatus: (status: string | null) => void;
  }) => {
    axios
      .post('/email/verification-notification')
      .then((response) => setStatus(response.data.status))
      .catch((error: any) => {
        console.error('[resendEmailVerification] Error:', error);
        setStatus('Error al reenviar el email de verificación.');
      });
  };

  // Middleware de protección de rutas (similar al anterior, pero usando session/status)
  useEffect(() => {
    if (
      middleware === 'guest' &&
      redirectIfAuthenticated &&
      status === 'authenticated'
    ) {
      router.push(redirectIfAuthenticated);
    }
    if (
      middleware === 'auth' &&
      status === 'unauthenticated' &&
      securePaths.includes(pathname)
    ) {
      onLogout();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, redirectIfAuthenticated, middleware, pathname]);

  return {
    user,
    status,
    login,
    register,
    forgotPassword,
    resetPassword,
    resendEmailVerification,
    logout,
  };
};
