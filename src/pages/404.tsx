import Error from '@/components/modules/common/Error';

const NotFoundError = () => {
  return (
    <Error
      code="404"
      error="¡Creemos que te perdiste!"
      text="Si estas buscando algún contenido que no existe o no esta guardado aun en nuestra Base de Datos, puedes escribirnos en nuestras redes sociales solicitando su inclusión"
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

export default NotFoundError;
