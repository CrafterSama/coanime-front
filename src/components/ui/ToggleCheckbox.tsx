import { FC } from 'react';
import { useFormContext } from 'react-hook-form';

type ToggleCheckboxProps = {
  label?: string;
  name?: string;
  disabled?: boolean;
  onChange?: (any: any) => void;
  checked?: boolean;
};

const ToggleCheckbox: FC<ToggleCheckboxProps> = ({
  label = '',
  name = '',
  disabled = false,
  onChange = () => {
    //
  },
  ...props
}) => {
  const { register, watch } = useFormContext();
  return (
    <div className="flex items-center justify-center">
      <label
        htmlFor="toggle"
        className="inline-flex relative items-center mr-5 cursor-pointer"
      >
        <input
          type="checkbox"
          value={watch(name)}
          id="toggle"
          name={name}
          className="sr-only peer"
          onChange={onChange}
          disabled={disabled}
          {...props}
          {...register}
        />
        <div className="w-11 h-6 bg-gray-200 rounded-full peer dark:bg-gray-700 peer-focus:ring-4 peer-focus:ring-orange-300 dark:peer-focus:ring-orange-800 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-orange-400"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">
          {label}
        </span>
      </label>
    </div>
  );
};

export default ToggleCheckbox;
