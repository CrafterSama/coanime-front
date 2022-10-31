import { useEffect, useState } from 'react';

import Link from 'next/link';
import { useRouter } from 'next/router';

import GuestLayout from '@/components/Layouts/GuestLayout';
import { ApplicationLogo } from '@/components/ui/ApplicationLogo';
import AuthCard from '@/components/ui/AuthCard';
import AuthSessionStatus from '@/components/ui/AuthSessionStatus';
import AuthValidationErrors from '@/components/ui/AuthValidationErrors';
import Button from '@/components/ui/Button';
import { InputWithoutContext } from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { useAuth } from '@/hooks/auth';

const PasswordReset = () => {
  const router = useRouter();

  const { resetPassword } = useAuth({ middleware: 'guest' });

  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  const submitForm = (event) => {
    event.preventDefault();

    resetPassword({
      email,
      password,
      password_confirmation: passwordConfirmation,
      setErrors,
      setStatus,
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
        }
      >
        {/* Session Status */}
        <AuthSessionStatus className="mb-4" status={status} />

        {/* Validation Errors */}
        <AuthValidationErrors className="mb-4" errors={errors} />

        <form onSubmit={submitForm}>
          {/* Email Address */}
          <div>
            <Label htmlFor="email">Email</Label>

            <InputWithoutContext
              id="email"
              type="email"
              name="email"
              value={email}
              className="block mt-1 w-full"
              onChange={(event) => setEmail(event.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Password */}
          <div className="mt-4">
            <Label htmlFor="password">Password</Label>
            <InputWithoutContext
              id="password"
              type="password"
              name="password"
              value={password}
              className="block mt-1 w-full"
              onChange={(event) => setPassword(event.target.value)}
              required
            />
          </div>

          {/* Confirm Password */}
          <div className="mt-4">
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>

            <InputWithoutContext
              id="passwordConfirmation"
              type="password"
              name="passwordConfirmation"
              value={passwordConfirmation}
              className="block mt-1 w-full"
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              required
            />
          </div>

          <div className="flex items-center justify-end mt-4">
            <Button>Reset Password</Button>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default PasswordReset;
