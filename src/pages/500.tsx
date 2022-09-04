import { useEffect } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import WebLayout from '@/components/Layouts/WebLayout';

const ErrorPage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <WebLayout>
      <Head>
        <title>404 - Not Found</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="relative flex items-top justify-center min-h-screen bg-white sm:items-center sm:pt-0">
        <div className="container">
          <div className="text-center w-full flex flex-col gap-4 justify-center items-center text-lg">
            <div className="relative w-[100%] sm:w-[380px] h-auto rounded-lg overflow-hidden bg-gray-50 shadow">
              <img src="/images/404.gif" alt="404" className="w-full h-auto" />
              <small className="text-xs text-gray-400">
                Mi Vecino Totoro, Studio Ghibli 1988 &copy;
              </small>
            </div>
            <h1 className="text-2xl">500 | It's not you, It's me!</h1>
            <div className="container">
              <h3>
                Por Alguna razón no pudimos cargar el contenido que estas
                buscando, por favor intenta de nuevo
              </h3>
              <hr />
              <p>
                Regresa al{' '}
                <Link href="/">
                  <a className="text-orange-400 font-bold">Inicio</a>
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </WebLayout>
  );
};

export function getStaticProps() {
  return {
    props: {
      revalidate: 5 * 60,
    },
  };
}

export default ErrorPage;
