import React from 'react';

interface FilterSelectOption {
  id: string | number;
  name: string;
}

interface FilterSelectProps {
  value: string | number | undefined;
  onChange: (value: string | number | undefined) => void;
  options: FilterSelectOption[];
  placeholder: string;
  className?: string;
}

export const FilterSelect: React.FC<FilterSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  className = '',
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newValue = e.target.value || undefined;
    onChange(newValue);
  };

  return (
    <select
      value={value || ''}
      onChange={handleChange}
      className={`px-3 py-2 bg-white rounded-md border border-gray-200 shadow-[0_2px_4px_0_rgba(0,0,0,0.15)] focus:ring-2 focus:ring-orange-500 focus:shadow-[0_2px_6px_0_rgba(0,0,0,0.2)] text-sm transition-colors hover:bg-gray-50 ${className}`}>
      <option value="">{placeholder}</option>
      {options.map((option) => (
        <option key={option.id} value={option.id}>
          {option.name}
        </option>
      ))}
    </select>
  );
};
