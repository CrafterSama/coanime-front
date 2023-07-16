import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

import Label from '@/components/ui/Label';
import { Show } from './Show';

type InputProps = {
  id?: string;
  type?: string;
  label?: string;
  left?: React.ReactNode;
  right?: React.ReactNode;
  name?: string;
  errors?: any;
  defaultValue?: any;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  hint?: string | number;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  charactersCount?: any;
};

const Input: FC<InputProps> = ({
  name,
  id = name,
  type = 'text',
  label,
  left = null,
  right = null,
  errors,
  defaultValue = null,
  placeholder = '',
  disabled = false,
  className = '',
  hint = '',
  onChange = () => {
    //
  },
  charactersCount = null,
  ...props
}) => {
  const { register } = useFormContext();
  return (
    <div className="flex flex-col gap-2">
      <Show condition={Boolean(label)}>
        <Label htmlFor={name}>{label}</Label>
      </Show>
      <div className="mt-1 relative rounded-md shadow-sm">
        <Show condition={Boolean(left)}>
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{left}</span>
          </div>
        </Show>
        <input
          {...register(name)}
          type={type}
          id={id}
          name={name}
          onChange={onChange}
          defaultValue={defaultValue}
          placeholder={placeholder}
          disabled={disabled}
          className={`w-full rounded-md shadow-sm border-2 outline-2 border-orange-300 disabled:bg-gray-50 disabled:text-gray-400 focus:border-orange-300 focus:outline-0 focus:ring focus:ring-orange-200 focus:ring-opacity-50 ${
            left ? 'pl-10 py-2 pr-2' : 'p-2'
          } ${className} ${errors ? 'border-red-400' : ''}`}
          {...props}
        />
        <Show condition={Boolean(right)}>
          <div className="absolute inset-y-0 right-0 pl-3 flex items-center pointer-events-none">
            <span className="text-gray-500 sm:text-sm">{right}</span>
          </div>
        </Show>
      </div>
      <Show condition={Boolean(hint)}>
        <div className="flex flex-row justify-start">
          <div className="text-gray-400 text-xs">{hint} </div>
        </div>
      </Show>
      <Show condition={charactersCount >= 0 && charactersCount !== null}>
        <div className="flex flex-row justify-end">
          <div
            className={`${
              charactersCount > 75 ? 'text-red-400' : 'text-gray-400'
            } text-xs`}>
            {`Cantidad de Caracteres: ${charactersCount}`}
          </div>
        </div>
      </Show>
      <Show condition={Boolean(errors)}>
        <div className="flex flex-row justify-start mt-1">
          <div className="text-red-400">{errors} </div>
        </div>
      </Show>
    </div>
  );
};

export const InputWithoutContext = ({
  disabled = false,
  className = '',
  hint = '',
  ...props
}) => {
  return (
    <div className="flex flex-col gap-2">
      <input
        disabled={disabled}
        className={`rounded-md shadow-sm border-2 outline-2 border-orange-300 disabled:bg-gray-50 disabled:text-gray-400 focus:border-orange-300 focus:ring focus:ring-orange-200 focus:ring-opacity-50 p-2 w-full ${className}`}
        {...props}
      />
      <Show condition={Boolean(hint)}>
        <div className="flex flex-row justify-between mt-1">
          <div className="text-gray-400">{hint}</div>
        </div>
      </Show>
    </div>
  );
};

export default Input;
