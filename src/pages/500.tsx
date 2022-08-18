import Image from 'next/image';
import Link from 'next/link';

import WebLayout from '@/components/Layouts/WebLayout';
import Head from 'next/head';

const ErrorPage = () => (
  <WebLayout>
    <Head>
      <title>404 - Not Found</title>
    </Head>
    <div className="relative flex items-top justify-center min-h-screen bg-white sm:items-center sm:pt-0">
      <div className="container">
        <div className="text-center w-full flex flex-col gap-4 justify-center items-center text-lg">
          <div className="relative w-[430px] h-[380px]">
            <img src="/images/opps.gif" alt="500" className="w-full h-auto" />
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

export default ErrorPage;
