import { useState } from 'react';

import Link from 'next/link';

import GuestLayout from '@/components/Layouts/GuestLayout';
import { ApplicationLogo } from '@/components/ui/ApplicationLogo';
import AuthCard from '@/components/ui/AuthCard';
import AuthSessionStatus from '@/components/ui/AuthSessionStatus';
import AuthValidationErrors from '@/components/ui/AuthValidationErrors';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/auth';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth({ middleware: 'guest' });

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  const submitForm = (event) => {
    event.preventDefault();

    forgotPassword({ email, setErrors, setStatus });
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
          Forgot your password? No problem. Just let us know your email address
          and we will email you a password reset link that will allow you to
          choose a new one.
        </div>

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
              onChange={(event) => setEmail(event.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="flex flex-col items-center justify-center mt-4 gap-4">
            <Button>Email Password Reset Link</Button>
            <div className="flex flex-row justify-around content-center w-full">
              <Link
                href="/login"
                className="text-sm text-orange-600 hover:text-orange-700 underline underline-offset-4">
                Return to login
              </Link>
            </div>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default ForgotPassword;
