type ErrorsProps = {
  errors?: any[];
};

const Errors = ({ errors = [] }: ErrorsProps) => {
  const hasNotErrors = errors.length === 0;

  if (hasNotErrors) return null;

  // Función helper para convertir error a string de forma segura
  const getErrorMessage = (error: any): string => {
    if (typeof error === 'string') {
      return error;
    }
    if (error?.message && typeof error.message === 'string') {
      return error.message;
    }
    if (error?.response?.data?.message) {
      return error.response.data.message;
    }
    if (error?.toString) {
      return error.toString();
    }
    return 'Error desconocido';
  };

  return (
    <div className="p-4 flex flex-row gap-4 border-l-4 border-red-700 bg-red-50 mt-4">
      <div className="w-full">
        <div className="mt-3 list-disc list-inside text-sm text-red-600">
          <span className="text-base">Whoops!: </span>
          {errors?.map((error, index) => (
            <span key={index}>
              <span>{getErrorMessage(error)}</span>
              {errors.length > 1 && ', '}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Errors;
