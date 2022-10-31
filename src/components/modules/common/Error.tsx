import { useEffect, useState } from 'react';

import Head from 'next/head';
import Link from 'next/link';

import WebLayout from '@/components/Layouts/WebLayout';

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

const Error = ({ code, error, text }) => {
  const [image, setImage] = useState(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    setImage(IMAGES_404[Math.floor(Math.random() * IMAGES_404.length)]);
  }, []);

  return (
    <WebLayout>
      <Head>
        <title>{`${code} - ${error}`}</title>
        <meta name="robots" content="noindex" />
      </Head>
      <div className="relative flex items-top justify-center min-h-screen bg-white sm:items-center sm:pt-0">
        <div className="container">
          <div className="text-center w-full flex flex-col gap-4 justify-center items-center text-lg">
            <div className="relative w-[100%] sm:w-[380px] h-auto rounded-lg overflow-hidden bg-gray-50 shadow">
              <img src={image?.url} alt="404" className="w-full h-auto" />
              <small className="text-xs text-gray-400">{image?.text}</small>
            </div>
            <h1 className="text-2xl">{`${code} - ${error}`}</h1>
            <div className="container max-w-6xl">
              <h3>{text}</h3>
              <hr />
              <p>
                O simplemente regresa al{' '}
                <Link href="/" className="text-orange-400 font-bold">
                  
                    Inicio y sigue navegando
                  
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </WebLayout>
  );
};

export default Error;
