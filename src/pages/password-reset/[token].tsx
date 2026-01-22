import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import GuestLayout from '@/components/Layouts/GuestLayout';
import { ApplicationLogo } from '@/components/ui/ApplicationLogo';
import AuthCard from '@/components/ui/AuthCard';
import AuthSessionStatus from '@/components/ui/AuthSessionStatus';
import AuthValidationErrors from '@/components/ui/AuthValidationErrors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PasswordInput } from '@/components/ui/password-input';
import { useAuth } from '@/hooks/auth';

const PasswordReset = () => {
  const router = useRouter();

  const { resetPassword } = useAuth({ middleware: 'guest' });

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [status, setStatus] = useState<string | null>(null);

  const submitForm = (event: React.FormEvent) => {
    event.preventDefault();

    resetPassword({
      email,
      password,
      password_confirmation: passwordConfirmation,
      setErrors: (errors: string[]) => setErrors(errors),
      setStatus: (status: string | null) => setStatus(status),
    });
  };

  useEffect(() => {
    setEmail(router?.query?.email as string);
  }, [router?.query?.email]);

  return (
    <GuestLayout>
      <AuthCard
        logo={
          <Link href="/">
            <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
          </Link>
        }>
        {/* Session Status */}
        <AuthSessionStatus className="mb-4" status={status} />

        {/* Validation Errors */}
        <AuthValidationErrors className="mb-4" errors={errors} />

        <form onSubmit={submitForm}>
          {/* Email Address */}
          <div>
            <Label htmlFor="email">Email</Label>

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

          {/* Password */}
          <div className="mt-4">
            <Label htmlFor="password">Contraseña</Label>
            <PasswordInput
              id="password"
              name="password"
              value={password}
              className="block mt-1 w-full"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPassword(event.target.value)
              }
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mt-4">
            <Label htmlFor="passwordConfirmation">Confirmar contraseña</Label>

            <PasswordInput
              id="passwordConfirmation"
              name="passwordConfirmation"
              value={passwordConfirmation}
              className="block mt-1 w-full"
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                setPasswordConfirmation(event.target.value)
              }
              required
            />
          </div>

          <div className="flex items-center justify-end mt-4">
            <Button>Restablecer contraseña</Button>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default PasswordReset;
