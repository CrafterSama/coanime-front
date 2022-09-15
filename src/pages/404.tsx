import Error from '@/components/modules/common/Error';

const NotFoundError = () => {
  return (
    <Error
      code="404"
      error="Not Found"
      text="El Contenido que estas buscando no existe o no esta guardado aun en nuestra Base de Datos, si fuiste redirigido a esta pagina tratando de acceder a algún titulo de la enciclopedia, puedes escribirnos en nuestras redes sociales, pidiendo el titulo en si o escribiendo a traves de nuestro correo contacto@coanime.net"
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
