import Error from '@/components/modules/common/Error';

const ServerError = () => {
  return (
    <Error
      code={500}
      error="Uuuppps! Algo salio mal, nuestro server esta dormido."
      text="Por Alguna razón no pudimos cargar el contenido que estas buscando, yaque el server no la pudo buscar por su actual condición, por favor intenta de nuevo en unos minutos."
    />
  );
};

export function getStaticProps() {
  return {
    props: {
      revalidate: 5 * 60,
    },
  };
}

export default ServerError;
