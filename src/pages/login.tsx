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
import Label from '@/components/ui/Label';
import { useAuth } from '@/hooks/auth';
import { AiOutlineEye, AiOutlineEyeInvisible } from 'react-icons/ai';
import { Input } from '@/components/ui/Input';

const Login = () => {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState(null);
  const [redirect, setRedirect] = useState<string | string[]>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const redirectionIfLoggedIn = () => {
    if (router.query.redirect) setRedirect(router.query.redirect as string);
    setRedirect('/');
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <ApplicationLogo className="w-20 h-20 fill-current text-orange-500" />
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
              value={email}
              className="block mt-1 w-full"
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          {/* Password */}
          <div className="mt-4">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              value={password}
              className="block mt-1 w-full"
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              endIcon={
                showPassword ? (
                  <AiOutlineEyeInvisible size={24} />
                ) : (
                  <AiOutlineEye size={24} />
                )
              }
              endIconAction={() => setShowPassword(!showPassword)}
            />
          </div>

          {/* Remember Me */}
          <div className="block mt-4">
            <Checkbox id="remember_me" name="remember" text="Remember me" />
          </div>

          <div className="flex flex-col items-center justify-end mt-4 gap-4">
            <Button className="ml-3">Login</Button>

            <div className="flex flex-row justify-around content-center w-full">
              <Link
                href="/forgot-password"
                className="text-sm text-orange-600 hover:text-orange-700 underline underline-offset-4">
                ¿Olvidaste tu Contraseña?
              </Link>
              <Link
                href="/register"
                className="text-sm text-orange-600 hover:text-orange-700 underline underline-offset-4">
                ¿No tienes cuenta?
              </Link>
            </div>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default Login;
