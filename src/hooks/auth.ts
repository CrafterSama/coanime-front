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
    redirectTo,
  }: {
    setErrors: (errors: string[]) => void;
    setStatus: (status: string | null) => void;
    email: string;
    password: string;
    redirectTo?: string;
  }) => {
    setErrors([]);
    setStatus(null);

    try {
      // Check for saved redirect URL from 401 error
      const savedRedirect =
        typeof window !== 'undefined'
          ? sessionStorage.getItem('redirectAfterLogin')
          : null;

      // Use saved redirect if available, otherwise use provided redirectTo
      const finalRedirect = savedRedirect || redirectTo || '/';

      // Con JWT, no necesitamos CSRF cookies
      // Auth.js ejecutará authorize en el servidor que hará POST a /api/login
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: finalRedirect,
      });

      if (result?.error) {
        setErrors([result.error]);
        return;
      }

      setStatus('Login exitoso');

      // Redirigir después de un login exitoso
      if (result?.ok) {
        // Clear the saved redirect from sessionStorage
        if (typeof window !== 'undefined' && savedRedirect) {
          sessionStorage.removeItem('redirectAfterLogin');
        }

        router.push(finalRedirect);
      }
    } catch (error: any) {
      console.error('[Login] Error:', error);
      setErrors(['Error al iniciar sesión. Por favor, intenta de nuevo.']);
    }
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
      // Con JWT, no necesitamos CSRF cookies
      // El backend retorna: { access_token, token_type, expires_in, user }
      const response = await axios.post('/api/register', props);

      // Si el registro es exitoso, el backend retorna el token
      // Podemos hacer login automáticamente con Auth.js usando las credenciales
      if (response.data?.access_token) {
        // Hacer login automáticamente con Auth.js
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
      } else {
        // Si no hay token, el registro falló
        setErrors(['Error al registrar. Por favor, intenta de nuevo.']);
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
    // Clear any saved redirect URL
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('redirectAfterLogin');
    }

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
      // Con JWT, no necesitamos CSRF cookie
      const response = await axios.post('/api/forgot-password', { email });
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
      // Con JWT, no necesitamos CSRF cookie
      const response = await axios.post('/api/reset-password', {
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
