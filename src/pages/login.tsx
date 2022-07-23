import { useEffect, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';

import GuestLayout from '@/components/Layouts/GuestLayout';
import { ApplicationLogo } from '@/components/ui/ApplicationLogo';
import AuthCard from '@/components/ui/AuthCard';
import AuthSessionStatus from '@/components/ui/AuthSessionStatus';
import AuthValidationErrors from '@/components/ui/AuthValidationErrors';
import Button from '@/components/ui/Button';
import Checkbox from '@/components/ui/Checkbox';
import { InputWithoutContext } from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { useAuth } from '@/hooks/auth';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);
  const [redirect, setRedirect] = useState<string | string[]>('');

  const redirectionIfLoggedIn = () => {
    if (router.query.redirect) setRedirect(router.query.redirect as string);
    setRedirect('/dashboard');
  };

  const { login } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: redirect as string,
  });

  useEffect(() => {
    redirectionIfLoggedIn();
  });

  useEffect(() => {
    if (router.query.reset?.length > 0 && errors.length === 0) {
      setStatus(String(router.query.reset));
    } else {
      setStatus(null);
    }
  }, []);

  const submitForm = async (event) => {
    event.preventDefault();

    login({ email, password, setErrors, setStatus });
  };

  return (
    <GuestLayout>
      <Head>
        <title>Coanime.net - Login</title>
      </Head>
      <AuthCard
        logo={
          <Link href="/">
            <a>
              <ApplicationLogo className="w-20 h-20 fill-current text-orange-500" />
            </a>
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
              value={password}
              className="block mt-1 w-full"
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
            />
          </div>

          {/* Remember Me */}
          <div className="block mt-4">
            <Checkbox id="remember_me" name="remember" text="Remember me" />
          </div>

          <div className="flex flex-col items-center justify-end mt-4 gap-4">
            <Button className="ml-3">Login</Button>

            <div className="flex flex-row justify-around content-center w-full">
              <Link href="/forgot-password">
                <a className="text-sm text-orange-600 hover:text-orange-700 underline underline-offset-4">
                  Forgot your password?
                </a>
              </Link>
              <Link href="/register">
                <a className="text-sm text-orange-600 hover:text-orange-700 underline underline-offset-4">
                  {`Don't have an account?`}
                </a>
              </Link>
            </div>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default Login;
