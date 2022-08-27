import { FormProvider } from 'react-hook-form';

export const FormWithContext = ({ methods, onSubmit, children, ...props }) => {
  return (
    <FormProvider {...methods}>
      <form className="flex flex-col rounded-lg shadow-lg" onSubmit={onSubmit}>
        {children}
      </form>
    </FormProvider>
  );
};
