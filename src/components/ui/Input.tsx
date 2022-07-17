import { useFormContext } from 'react-hook-form';

const Input = ({ name, disabled = false, className = '', ...props }) => {
  const { register } = useFormContext();
  return (
    <input
      {...register(name)}
      name={name}
      disabled={disabled}
      className={`${className} rounded-md shadow-sm border outline-2 border-orange-300 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2`}
      {...props}
    />
  );
};

export default Input;
function useFomContext(): { register: any } {
  throw new Error('Function not implemented.');
}
