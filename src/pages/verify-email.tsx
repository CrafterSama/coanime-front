import { useState } from 'react';

import Link from 'next/link';

import GuestLayout from '@/components/Layouts/GuestLayout';
import { ApplicationLogo } from '@/components/ui/ApplicationLogo';
import AuthCard from '@/components/ui/AuthCard';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/auth';

const VerifyEmail = () => {
  const { logout, resendEmailVerification } = useAuth({
    middleware: 'auth',
  });

  const [status, setStatus] = useState<string | null>(null);

  return (
    <GuestLayout>
      <AuthCard
        logo={
          <Link href="/">
            <ApplicationLogo className="w-20 h-20 fill-current text-orange-500" />
          </Link>
        }>
        <div className="mb-4 text-sm text-gray-600">
          ¡Gracias por unirte! Antes de comenzar, verifica tu correo electrónico
          haciendo clic en el enlace que te enviamos. Si no lo recibiste, no hay
          problema, podemos enviarte otro.
        </div>

        {status === 'verification-link-sent' && (
          <div className="mb-4 font-medium text-sm text-green-600">
            Un nuevo enlace de verificación ha sido enviado a tu correo
            electrónico.
          </div>
        )}

        <div className="mt-4 flex items-center justify-between">
          <Button
            onClick={() =>
              resendEmailVerification({
                setStatus: (status: string | null) => setStatus(status),
              })
            }>
            Reenviar correo de verificación
          </Button>

          <button
            type="button"
            className="underline text-sm text-gray-600 hover:text-gray-900"
            onClick={() => logout()}>
            Cerrar sesión
          </button>
        </div>
      </AuthCard>
    </GuestLayout>
  );
};

export default VerifyEmail;
