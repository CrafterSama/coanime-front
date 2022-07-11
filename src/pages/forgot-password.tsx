import ApplicationLogo from '../../src/components/ApplicationLogo';
import AuthCard from '../../src/components/AuthCard';
import AuthSessionStatus from '../../src/components/AuthSessionStatus';
import AuthValidationErrors from '../../src/components/AuthValidationErrors';
import Button from '../../src/components/Button';
import GuestLayout from '../../src/components/Layouts/GuestLayout';
import Input from '../../src/components/Input';
import Label from '../../src/components/Label';
import Link from 'next/link';
import { useAuth } from '../../src/hooks/auth';
import { useState } from 'react';

const ForgotPassword = () => {
  const { forgotPassword } = useAuth({ middleware: 'guest' });

  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);

  const submitForm = event => {
    event.preventDefault();

    forgotPassword({ email, setErrors, setStatus });
  };

  return (
    <GuestLayout>
      <AuthCard
        logo={
          <Link href="/">
            <a>
              <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
            </a>
          </Link>
        }>
        <div className="mb-4 text-sm text-gray-600">
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
              onChange={event => setEmail(event.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="flex items-center justify-end mt-4">
            <Button>Email Password Reset Link</Button>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default ForgotPassword;
