import { useEffect, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import WebLayout from '@/components/Layouts/WebLayout';

const NotFoundPage = () => {
  const [image, setImage] = useState(null);

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
            <h1 className="text-2xl">404 | Not Found</h1>
            <div className="container max-w-6xl">
              <h3>
                El Contenido que estas buscando no existe o no esta guardado aun
                en nuestra Base de Datos, si fuiste redirigido a esta pagina
                tratando de acceder a algún titulo de la enciclopedia, puedes
                escribirnos en nuestras redes sociales, pidiendo el titulo en si
                o escribo a traves de nuestro correo contacto@coanime.net
              </h3>
              <hr />
              <p>
                O simplemente regresa al{' '}
                <Link href="/">
                  <a className="text-orange-400 font-bold">
                    Inicio y sigue navegando
                  </a>
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

export default NotFoundPage;
