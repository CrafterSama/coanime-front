import Error from '@/components/modules/common/Error';

const ServerError = () => {
  return (
    <Error
      code="500"
      error="Server Error"
      text="It's not you, It's me!, Por Alguna razón no pudimos cargar el contenido que estas buscando, por favor intenta de nuevo."
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
