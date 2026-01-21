import { useFormContext } from 'react-hook-form';

import { Label } from '@/components/ui/label';

const TextArea = ({
  label,
  name,
  errors,
  disabled = false,
  className = '',
  ...props
}) => {
  const { register } = useFormContext();
  return (
    <>
      {label && <Label htmlFor={name}>{label}</Label>}
      <textarea
        {...register(name)}
        id={name}
        name={name}
        disabled={disabled}
        className={`rounded-md min-w-full shadow-sm border-2 outline-2 border-orange-300 disabled:bg-gray-50 disabled:text-gray-400 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2 ${className} ${
          errors ? 'border-red-400' : ''
        }`}
        {...props}
      />
      {errors && (
        <div className="flex flex-row justify-between mt-1">
          <div className="text-red-400">{errors} </div>
        </div>
      )}
    </>
  );
};

export const TextAreaWithoutContext = ({
  label,
  name,
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <>
      {label && <Label htmlFor={name}>{label}</Label>}
      <textarea
        id={name}
        name={name}
        disabled={disabled}
        className={`rounded-md shadow-sm border-2 outline-2 border-orange-300 disabled:bg-gray-50 disabled:text-gray-400 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2 ${className}`}
        {...props}
      />
    </>
  );
};

export default TextArea;
