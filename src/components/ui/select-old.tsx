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
  errors?:
    | string
    | Merge<FieldError, FieldErrorsImpl<DeepRequired<any>>>
    | null;
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
  height = '36px',
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
        height: height || '36px',
        minHeight: height || '36px',
        backgroundColor: disabled ? 'rgb(249 250 251)' : '#fff',
        borderRadius: '6px',
        borderWidth: '1px',
        borderColor: errors ? '#fca5a5' : '#f3f4f6',
        boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
        '&:hover': {
          borderColor: errors ? '#fca5a5' : '#e5e7eb',
        },
        '&:focus-within': {
          borderColor: errors ? '#ef4444' : '#fb923c',
          boxShadow: '0 1px 2px 0 rgba(0,0,0,0.05)',
          outline: 'none',
        },
        color: disabled ? '#666' : '#333',
        cursor: disabled ? 'not-allowed' : 'default',
      };
    },
    menu: (base) => ({
      ...base,
      borderRadius: '6px',
      boxShadow: '0 1px 3px 0 rgba(0,0,0,0.1)',
      border: '1px solid #f3f4f6',
      marginTop: '4px',
    }),
    option: (base, state) => ({
      ...base,
      backgroundColor: state.isSelected
        ? '#fb923c'
        : state.isFocused
        ? '#fff7ed'
        : 'white',
      color: state.isSelected ? 'white' : '#374151',
      '&:active': {
        backgroundColor: state.isSelected ? '#fb923c' : '#fff7ed',
      },
    }),
  };

  return (
    <div>
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <Select
            id={id || name}
            value={value || field.value}
            defaultValue={defaultValue}
            isSearchable
            isClearable={isClearable}
            isLoading={isLoading}
            options={options}
            onInputChange={onInputChange}
            onChange={(value: any) => {
              callBack?.(value);
              field.onChange(value);
            }}
            isDisabled={disabled}
            styles={colourStyles}
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
