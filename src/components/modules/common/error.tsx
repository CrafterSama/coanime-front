import { useEffect, useState } from 'react';

import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';

import WebLayout from '@/components/layouts/web-layout';

const IMAGES_404 = [
  {
    url: '/images/404/anime-01.gif',
    text: `Comercial relacionado con Kiki: Entregas a domicilio`,
  },
  {
    url: '/images/404/castle-01.webp',
    text: `El increíble castillo vagabundo, Studio Ghibli 2004 ©`,
  },
  {
    url: '/images/404/castle-02.webp',
    text: `El increíble castillo vagabundo, Studio Ghibli 2004 ©`,
  },
  {
    url: '/images/404/castle-03.webp',
    text: `El increíble castillo vagabundo, Studio Ghibli 2004 ©`,
  },
  {
    url: '/images/404/castle-04.webp',
    text: `El increíble castillo vagabundo, Studio Ghibli 2004 ©`,
  },
  {
    url: '/images/404/castle-05.webp',
    text: `El increíble castillo vagabundo, Studio Ghibli 2004 ©`,
  },
  {
    url: '/images/404/champloo-01.webp',
    text: `Samurai Champloo, Shinichiro Watanabe, Fuji TV 2004 ©`,
  },
  {
    url: '/images/404/champloo-02.webp',
    text: `Samurai Champloo, Shinichiro Watanabe, Fuji TV 2004 ©`,
  },
  {
    url: '/images/404/kikis-02.webp',
    text: `Kiki: Entregas a domicilio, Studio Ghibli 1989 ©`,
  },
  {
    url: '/images/404/kikis-03.webp',
    text: `Kiki: Entregas a domicilio, Studio Ghibli 1989 ©`,
  },
  {
    url: '/images/404/kikis-04.webp',
    text: `Kiki: Entregas a domicilio, Studio Ghibli 1989 ©`,
  },
  {
    url: '/images/404/kikis-01.webp',
    text: `Kiki: Entregas a domicilio, Studio Ghibli 1989 ©`,
  },
  {
    url: '/images/404/mary-01.webp',
    text: `Mary y la flor de la hechicera, Studio Ponoc 2017 ©`,
  },
  {
    url: '/images/404/mary-02.gif',
    text: `Mary y la flor de la hechicera, Studio Ponoc 2017 ©`,
  },
  {
    url: '/images/404/mononoke-01.webp',
    text: `La princesa Mononoke, Studio Ghibli 1997 ©`,
  },
  {
    url: '/images/404/mononoke-02.webp',
    text: `La princesa Mononoke, Studio Ghibli 1997 ©`,
  },
  {
    url: '/images/404/op-01.webp',
    text: `One Piece, Eiichirō Oda, Toei Animation 1999 ©`,
  },
  {
    url: '/images/404/op-02.webp',
    text: `One Piece, Eiichirō Oda, Toei Animation 1999 ©`,
  },
  {
    url: '/images/404/op-03.gif',
    text: `One Piece, Eiichirō Oda, Toei Animation 1999 ©`,
  },
  {
    url: '/images/404/op-04.gif',
    text: `One Piece, Eiichirō Oda, Toei Animation 1999 ©`,
  },
  {
    url: '/images/404/totoro-01.webp',
    text: `Mi Vecino Totoro, Studio Ghibli 1988 ©`,
  },
  {
    url: '/images/404/totoro-02.webp',
    text: `Mi Vecino Totoro, Studio Ghibli 1988 ©`,
  },
  {
    url: '/images/404/totoro-03.gif',
    text: `Mi Vecino Totoro, Studio Ghibli 1988 ©`,
  },
  {
    url: '/images/404/viaje-01.webp',
    text: `El viaje de Chihiro, Studio Ghibli 2001 ©`,
  },
  {
    url: '/images/404/viaje-02.webp',
    text: `El viaje de Chihiro, Studio Ghibli 2001 ©`,
  },
  {
    url: '/images/404/viaje-03.webp',
    text: `El viaje de Chihiro, Studio Ghibli 2001 ©`,
  },
  {
    url: '/images/404/viaje-04.webp',
    text: `El viaje de Chihiro, Studio Ghibli 2001 ©`,
  },
  {
    url: '/images/404/cowboy-01.webp',
    text: `Cowboy Bebop, Shinichiro Watanabe, Sunrise 1998 ©`,
  },
  {
    url: '/images/404/cowboy-02.webp',
    text: `Cowboy Bebop, Shinichiro Watanabe, Sunrise 1998 ©`,
  },
  {
    url: '/images/404/cowboy-03.webp',
    text: `Cowboy Bebop, Shinichiro Watanabe, Sunrise 1998 ©`,
  },
  {
    url: '/images/404/cowboy-04.webp',
    text: `Cowboy Bebop, Shinichiro Watanabe, Sunrise 1998 ©`,
  },
  {
    url: '/images/404/cowboy-05.webp',
    text: `Cowboy Bebop, Shinichiro Watanabe, Sunrise 1998 ©`,
  },
  {
    url: '/images/404/cowboy-06.webp',
    text: `Cowboy Bebop, Shinichiro Watanabe, Sunrise 1998 ©`,
  },
];

type ErrorProps = {
  code?: number;
  error?: any;
  text?: string;
};

const Error = ({ code, error, text }: ErrorProps) => {
  const [image, setImage] = useState<{ url: string; text: string } | null>(
    null
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    setImage(IMAGES_404[Math.floor(Math.random() * IMAGES_404.length)]);
  }, []);

  // Convertir error a string de forma segura
  const errorMessage =
    typeof error === 'string'
      ? error
      : error?.message ||
        error?.response?.data?.message ||
        error?.toString() ||
        'Error desconocido';

  return (
    <WebLayout>
      <Head>
        <title>{`${code} - ${errorMessage}`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="relative flex items-top justify-center min-h-[80vh] bg-white sm:items-center sm:pt-0">
        <div className="container">
          <div className="lg:px-24 lg:py-24 md:py-20 md:px-44 px-4 py-24 items-center flex justify-center flex-col-reverse lg:flex-row md:gap-28 gap-16">
            <div className="w-full xl:w-1/2 relative pb-12 lg:pb-0">
              <div className="relative">
                <div className="absolute">
                  <div>
                    <h1 className="my-2 text-gray-800 font-bold text-3xl">
                      {`${code} - ${errorMessage}`}
                    </h1>
                    <p className="my-2 text-gray-800">{text}</p>
                    <p className="my-2 text-gray-600">
                      ~ Vuelve al Inicio y sigue navegando 😇
                    </p>
                    <br />
                    <Link
                      href="/"
                      className="font-semibold py-2 px-4 rounded-lg transition-colors border text-white bg-orange-500 border-orange-500">
                      ¡Sacame de aqui!
                    </Link>
                  </div>
                </div>
                <div className="w-full flex justify-center">
                  <p className="text-[10rem] font-bold text-orange-50">
                    {code}
                  </p>
                </div>
              </div>
            </div>
            <div>
              <div className="relative w-[100%] sm:w-[380px] h-auto rounded-lg overflow-hidden bg-gray-50 shadow">
                {image?.url && (
                  <Image
                    src={image.url}
                    alt={String(code ?? 'Error')}
                    width={380}
                    height={380}
                    className="w-full h-auto"
                    unoptimized
                  />
                )}
                <p className="text-xs text-gray-400 p-2  text-center">
                  {image?.text}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </WebLayout>
  );
};

export default Error;
