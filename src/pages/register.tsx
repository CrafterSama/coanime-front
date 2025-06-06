import { useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import GuestLayout from '@/components/Layouts/GuestLayout';
import { ApplicationLogo } from '@/components/ui/ApplicationLogo';
import AuthCard from '@/components/ui/AuthCard';
import AuthValidationErrors from '@/components/ui/AuthValidationErrors';
import Button from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import { useAuth } from '@/hooks/auth';

const Register = () => {
  const { register } = useAuth({
    middleware: 'guest',
    redirectIfAuthenticated: '/',
  });

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [errors, setErrors] = useState([]);

  const submitForm = (event) => {
    event.preventDefault();

    register({
      name,
      email,
      password,
      password_confirmation: passwordConfirmation,
      setErrors,
    });
  };

  return (
    <GuestLayout>
      <Head>
        <title>Coanime.net - register</title>
      </Head>
      <AuthCard
        logo={
          <Link href="/">
            <ApplicationLogo className="w-20 h-20 fill-current text-orange-500" />
          </Link>
        }>
        {/* Validation Errors */}
        <AuthValidationErrors className="mb-4" errors={errors} />

        <form onSubmit={submitForm}>
          {/* Name */}
          <div>
            <Label htmlFor="name">Name</Label>

            <Input
              id="name"
              type="text"
              name="name"
              value={name}
              className="block mt-1 w-full"
              onChange={(event) => setName(event.target.value)}
              required
              autoFocus
            />
          </div>

          {/* Email Address */}
          <div className="mt-4">
            <Label htmlFor="email">Email</Label>

            <Input
              id="email"
              type="email"
              name="email"
              value={email}
              className="block mt-1 w-full"
              onChange={(event) => setEmail(event.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="mt-4">
            <Label htmlFor="password">Password</Label>

            <Input
              id="password"
              type="password"
              name="password"
              value={password}
              className="block mt-1 w-full"
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="new-password"
            />
          </div>

          {/* Confirm Password */}
          <div className="mt-4">
            <Label htmlFor="passwordConfirmation">Confirm Password</Label>

            <Input
              id="passwordConfirmation"
              type="password"
              name="passwordConfirmation"
              value={passwordConfirmation}
              className="block mt-1 w-full"
              onChange={(event) => setPasswordConfirmation(event.target.value)}
              required
            />
          </div>

          <div className="flex flex-col items-center justify-end mt-4 gap-4">
            <Button>Register</Button>
            <div className="flex w-full justify-center">
              <Link
                href="/login"
                className="underline underline-offset-4 text-sm text-orange-600 hover:text-orange-700">
                Already registered?
              </Link>
            </div>
          </div>
        </form>
      </AuthCard>
    </GuestLayout>
  );
};

export default Register;
