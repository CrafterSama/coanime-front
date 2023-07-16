import {
  Controller,
  DeepRequired,
  FieldError,
  FieldErrorsImpl,
  Merge,
  useFormContext,
} from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

type FormSelectProps = {
  id?: string;
  placeholder?: string;
  options: any[];
  callBack?: any;
  onInputChange?: any;
  isLoading?: boolean;
  defaultValue?: any;
  value?: any;
  disabled?: boolean;
  height?: string;
  errors?: string | Merge<FieldError, FieldErrorsImpl<DeepRequired<any>>>;
  name?: string;
  getOptionLabel?: any;
  isClearable?: boolean;
  inputValue?: string;
};

const FormSelect = ({
  id = '',
  placeholder = '',
  options,
  callBack,
  isLoading = false,
  onInputChange,
  defaultValue = {},
  value = {},
  disabled = false,
  height = '45px',
  errors = null,
  name = '',
  getOptionLabel,
  isClearable = true,
  inputValue = '',
}: FormSelectProps) => {
  const { control } = useFormContext();

  const colourStyles: StylesConfig = {
    control: (base) => {
      return {
        ...base,
        height,
        backgroundColor: disabled ? 'rgb(249 250 251)' : '#fff',
        borderRadius: '6px',
        borderWidth: '2px',
        borderColor: errors ? '#ce0000' : 'rgb(116, 253, 235)',
        boxShadow: 'none',
        '&:hover': { borderColor: 'rgb(116, 253, 235)' },
        '&:focus': {
          borderColor: 'rgb(116, 253, 235)',
          boxShadow: 'none',
        },
        color: disabled ? '#666' : '#333',
        cursor: disabled ? 'not-allowed' : 'default',
      };
    },
  };

  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={() => (
          <Select
            id={id || name}
            value={value}
            defaultValue={defaultValue}
            isSearchable
            isClearable={isClearable}
            isLoading={isLoading}
            options={options}
            onInputChange={onInputChange}
            onChange={(value) => callBack(value)}
            isDisabled={disabled}
            styles={colourStyles}
            name={name}
            menuPlacement="auto"
            placeholder={placeholder}
            getOptionLabel={getOptionLabel}
            inputValue={inputValue}
          />
        )}
      />
      {errors && (
        <div className="flex flex-row justify-between mt-1">
          <div className="text-red-400">{errors as string}</div>
        </div>
      )}
    </div>
  );
};

export default FormSelect;
