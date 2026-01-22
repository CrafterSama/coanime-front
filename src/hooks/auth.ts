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
      // Paso 1: Obtener XSRF-TOKEN del cliente antes de hacer login
      // Esto establece la cookie XSRF-TOKEN en el navegador
      await axios.get('/sanctum/csrf-cookie');

      // Paso 2: Ahora que tenemos el XSRF-TOKEN, hacer login con Auth.js
      // Auth.js ejecutará authorize en el servidor, pero el cliente ya tiene el token
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
        callbackUrl: redirectTo || '/',
      });

      if (result?.error) {
        setErrors([result.error]);
        return;
      }

      // Paso 3: Si el login fue exitoso, hacer una petición adicional a Laravel
      // para establecer las cookies de sesión en el navegador
      // Esto es necesario porque las cookies establecidas en el servidor no se propagan al cliente
      // Las cookies de sesión de Laravel son necesarias para futuras peticiones autenticadas
      if (result?.ok) {
        try {
          // Hacer una petición a un endpoint protegido de Laravel
          // Esto establecerá las cookies de sesión de Laravel en el navegador
          // Usamos /internal/me que es el endpoint correcto según la configuración
          await axios.get('/internal/me');
        } catch (sessionError: any) {
          // Si hay error, loguearlo pero no fallar el login
          // El login ya fue exitoso en Auth.js
          if (process.env.NODE_ENV === 'development') {
            // eslint-disable-next-line no-console
            console.warn(
              '[Login] Error al establecer cookies de sesión:',
              sessionError?.response?.status
            );
          }
        }
      }

      setStatus('Login exitoso');

      // Redirigir después de un login exitoso
      if (result?.ok) {
        router.push(redirectTo || '/');
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
