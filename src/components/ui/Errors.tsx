type ErrorsProps = {
  errors?: any[];
};

const Errors = ({ errors = [] }: ErrorsProps) => {
  const hasNotErrors = errors.length === 0;

  if (hasNotErrors) return null;

  return (
    <div className="p-4 flex flex-row gap-4 border-l-4 border-red-700 bg-red-50 mt-4">
      <div className="w-full">
        <div className="mt-3 list-disc list-inside text-sm text-red-600">
          <span className="text-base">Whoops!: </span>
          {errors?.map((error, index) => (
            <span key={index}>
              <span>{error?.message}</span>
              {errors.length > 1 && ', '}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Errors;
