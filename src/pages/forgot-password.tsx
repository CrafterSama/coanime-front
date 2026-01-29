import { useState } from 'react';

import Link from 'next/link';

import GuestLayout from '@/components/layouts/guest-layout';
import { ApplicationLogo } from '@/components/ui/application-logo';
import AuthCard from '@/components/ui/auth-card';
import AuthSessionStatus from '@/components/ui/auth-session-status';
import AuthValidationErrors from '@/components/ui/auth-validation-errors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/auth';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth({ middleware: 'guest' });

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();

    forgotPassword({
      email,
      setErrors: (errors: string[]) => setErrors(errors),
      setStatus: (status: string | null) => setStatus(status),
    });
  };

  return (
    <GuestLayout>
      <AuthCard
        logo={
          <Link href="/">
            <ApplicationLogo className="w-20 h-20 fill-current text-orange-500" />
          </Link>
        }>
        <div className="mb-4 text-sm text-gray-600 max-w-[480px]">
          ¿Olvidaste tu contraseña? ¡No te preocupes! Solo compártenos tu correo
          electrónico y te enviaremos un enlace para que puedas crear una nueva.
        </div>

        {/* Session Status */}
        <AuthSessionStatus className="mb-4" status={status} />

        {/* Validation Errors */}
        <AuthValidationErrors className="mb-4" errors={errors} />

        <form onSubmit={submitForm}>
          {/* Email Address */}
          <div>
            <Label htmlFor="email">Correo electrónico</Label>
            <Input
              id="email"
              type="email"
              name="email"
              value={email}
              className="block mt-1 w-full"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setEmail(event.target.value)
              }
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col items-center justify-center mt-4 gap-4">
            <Button variant="solid-orange">
              Enviar enlace de restablecimiento de contraseña
            </Button>
            <div className="flex flex-row justify-around content-center w-full">
              <Link
                href="/login"
                className="text-sm text-orange-600 hover:text-orange-700 underline underline-offset-4">
                Volver a iniciar sesión
              </Link>
            </div>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default ForgotPassword;
