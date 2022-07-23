import { Controller, useFormContext } from 'react-hook-form';
import Select, { StylesConfig } from 'react-select';

type FormSelectProps = {
  options: any[];
  callBack?: any;
  defaultValue?: any;
  value?: any;
  disabled?: boolean;
  height?: string;
  errors?: string;
  name?: string;
};

const FormSelect = ({
  options,
  callBack,
  defaultValue = {},
  value = {},
  disabled = false,
  height = '45px',
  errors = '',
  name = '',
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
        borderColor: errors ? 'red' : 'rgb(253 186 116)',
        boxShadow: 'none',
        '&:hover': { borderColor: 'rgb(253 186 116)' },
        '&:focus': {
          borderColor: 'rgb(253 186 116)',
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
            value={value}
            defaultValue={defaultValue}
            isSearchable
            isClearable
            options={options}
            onChange={(value) => callBack(value)}
            isDisabled={disabled}
            styles={colourStyles}
            name={name}
          />
        )}
      />
      {errors && (
        <div className="flex flex-row justify-between mt-1">
          <div className="text-red-400">{errors} </div>
        </div>
      )}
    </div>
  );
};

export default FormSelect;
