import { useFormContext } from 'react-hook-form';
import Label from '@/components/ui/Label';

const Input = ({
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
      <input
        {...register(name)}
        id={name}
        name={name}
        disabled={disabled}
        className={`rounded-md shadow-sm border-2 outline-2 border-orange-300 disabled:bg-gray-50 disabled:text-gray-400 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2 ${className} ${
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

export const InputWithoutContext = ({
  disabled = false,
  className = '',
  ...props
}) => {
  return (
    <input
      disabled={disabled}
      className={`${className} rounded-md shadow-sm border-2 outline-2 border-orange-300 disabled:bg-gray-50 disabled:text-gray-400 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2`}
      {...props}
    />
  );
};

export default Input;
